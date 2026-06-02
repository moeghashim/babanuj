# PostHog observer

A scheduled, **read-only** agent pass over PostHog that writes a ranked, evidence-backed
findings report. It never changes code, flags, dashboards, or data. See
[`posthog-observer.md`](./posthog-observer.md) for the full behaviour spec.

The trust model: a finding ships only if its verbatim `raw` snippet is found in a real PostHog
MCP result captured in the run trace. A fabricated finding fails the run rather than reaching
the digest (`validate-findings.js`, fail-closed).

## Files

| File | Role |
|---|---|
| `posthog-observer.md` | Agent behaviour spec (the runner points the agent here) |
| `mcp.observer.json` | PostHog MCP server, Bearer-token auth (headless-safe) |
| `run-observer.sh` | One cycle: run agent → validate → promote `FINDINGS.next.json` |
| `validate-findings.js` | Fail-closed provenance check |
| `digest.js` | Deterministic human digest from the **validated** report |
| `../.github/workflows/posthog-observer.yml` | Scheduled headless run + state persistence |

Runtime state (`FINDINGS.json`, `FINDINGS.next.json`, `DIGEST.md`) is **gitignored on `main`**.
In CI it's persisted on a dedicated `observer-state` branch so it never touches `main` (a
`FINDINGS.json` commit to `main` would trigger a Vercel production deploy).

## Auth — important

The hosted PostHog MCP supports OAuth (interactive) **and** a personal API key (Bearer). The
observer uses the **Bearer token**, because OAuth can't complete on a headless/CI runner:

1. PostHog → **Settings → Personal API keys → Create**. Scope it **read-only** (analytics /
   query / error-tracking / web-analytics read scopes are enough; this pass never writes).
2. Provide it as `POSTHOG_MCP_TOKEN`. `mcp.observer.json` injects it via `${POSTHOG_MCP_TOKEN}`
   — the key is never committed.

This is separate from `ANTHROPIC_API_KEY` (which the `claude` CLI needs).

## Run locally

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export POSTHOG_MCP_TOKEN=phx_...        # PostHog personal API key
bash observer/run-observer.sh
cat observer/DIGEST.md
```

Schedule it with cron (fires only while the Mac is awake):

```cron
0 9 * * *  ANTHROPIC_API_KEY=... POSTHOG_MCP_TOKEN=... /path/to/repo/observer/run-observer.sh >> ~/observer.log 2>&1
```

## Run headless (GitHub Actions — recommended for "always on")

1. Add repo secrets: `ANTHROPIC_API_KEY`, `POSTHOG_MCP_TOKEN` (and optionally
   `SLACK_WEBHOOK_URL`).
2. The workflow runs daily (`cron: "0 9 * * *"`, UTC) and on manual dispatch. It restores the
   prior `FINDINGS.json` from `observer-state`, runs the pass, and on success commits the new
   `FINDINGS.json` + `DIGEST.md` back to `observer-state` and writes the digest to the run
   summary.
3. A rejected (fail-closed) run fails the job — so a discarded run is visible/alertable — and
   the previous state is kept.

## Notes

- **First run** is a noisy baseline (everything `new`); from the second run on, the deltas are
  the signal.
- Tune `OBSERVER_MAX_TURNS` (default 40) to bound per-run token cost.
- The runner allows the agent only `mcp__posthog__*` + `Read`/`Write` — no code-editing tools.
- GitHub's scheduled cron is best-effort (can lag minutes); fine for a daily/weekly pass.
