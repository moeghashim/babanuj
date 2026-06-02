#!/usr/bin/env bash
# run-observer.sh — one observer cycle, fail-closed.
#
# Runs the agent headless, validates provenance, and promotes FINDINGS.next.json to
# FINDINGS.json + writes DIGEST.md only on success. Read-only: the agent gets PostHog MCP
# tools + Read/Write for the findings file, and nothing else.
#
# State persistence (keeping FINDINGS.json between runs) is the CALLER's job:
#   - local cron/launchd: the working tree persists it naturally.
#   - CI: the workflow restores it before and commits it to the `observer-state` branch after
#     (NOT main — a commit to main would trigger a Vercel production deploy).
#
# Required env:
#   POSTHOG_MCP_TOKEN  PostHog personal API key (Settings -> Personal API keys). Headless MCP
#                      auth — Bearer token, not OAuth. Keep it a secret; never commit it.
#   ANTHROPIC_API_KEY  for the `claude` CLI (separate key from PostHog).
# Optional:
#   OBSERVER_MAX_TURNS turn cap for the headless run (default 40).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # observer/
REPO="$(cd "$HERE/.." && pwd)"                          # repo root (agent cwd)
cd "$REPO"

: "${POSTHOG_MCP_TOKEN:?Set POSTHOG_MCP_TOKEN (PostHog personal API key) for headless MCP auth}"
export POSTHOG_MCP_TOKEN

TRACE="$(mktemp)"
trap 'rm -f "$TRACE"' EXIT

# Single-flight: don't let an overrun collide with the next scheduled tick.
exec 9>"$HERE/.observer.lock"
if command -v flock >/dev/null 2>&1 && ! flock -n 9; then
  echo "observer: another run is active; exiting." >&2
  exit 0
fi

# First run (or CI with no restored state): seed an empty prior report so the delta read
# doesn't crash on a missing file.
if [ ! -f observer/FINDINGS.json ]; then
  echo '{"generated_at":null,"window_days":14,"findings":[],"resolved_since_last_run":[]}' \
    > observer/FINDINGS.json
fi

DIRECTIVE='Execute the PostHog observer pass exactly as defined in observer/posthog-observer.md.
Read the prior observer/FINDINGS.json for deltas. Write the new report to observer/FINDINGS.next.json.
Apply PostHog'"'"'s "internal & test users" filter to every query. Every finding MUST include a
verbatim `raw` snippet copied character-for-character from a PostHog MCP data result, and `raw`
must be an aggregate/count line — never a string that could contain personal data.'

# Run the agent headless, capturing a stream-json trace of every tool call.
# --strict-mcp-config + --mcp-config load ONLY the Bearer-auth PostHog server (project-scoped
# .mcp.json is not auto-loaded headlessly, and we don't want the OAuth one here).
# (Swap the equivalent trace flag for Codex/Cursor; adapt the parser in validate-findings.js.)
claude -p "$DIRECTIVE" \
  --output-format stream-json --verbose \
  --mcp-config observer/mcp.observer.json --strict-mcp-config \
  --allowedTools "mcp__posthog__*,Read,Write" \
  --max-turns "${OBSERVER_MAX_TURNS:-40}" \
  > "$TRACE"

# Validate provenance. On failure, discard and keep the previous report.
if node observer/validate-findings.js "$TRACE" observer/FINDINGS.next.json; then
  mv observer/FINDINGS.next.json observer/FINDINGS.json
  node observer/digest.js observer/FINDINGS.json | tee observer/DIGEST.md
  # Optional: pipe observer/DIGEST.md to Slack/email here (or in the workflow).
else
  echo "observer: run rejected — keeping previous FINDINGS.json." >&2
  rm -f observer/FINDINGS.next.json
  exit 1   # non-zero so the scheduler can alert on a discarded run
fi
