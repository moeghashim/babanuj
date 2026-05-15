# CLAUDE.md

Standing instructions for Claude Code sessions on this repository.

**See [AGENTS.md](./AGENTS.md) for the full architecture + workflow playbook.**
Everything there applies to Claude too.

## Claude-specific add-ons

- For UI smoke tests, use the **Preview MCP** (`mcp__Claude_Preview__*`)
  registered via `.claude/launch.json`, not raw `curl`. Click through the
  flows you would as a user.
- For broad codebase research (where does X live, who uses Y), spawn an
  **Explore** sub-agent rather than reading files inline.
- The Babanuj v2 design bundle source lives at `~/babanuj-v2/`. The canonical
  implementation lives in this repo — don't sync design-bundle files in;
  treat them as visual reference only.
- Worktrees are used for parallel sessions. The CWD reported by the harness
  (`.claude/worktrees/<name>/`) is the actual working tree; commits there
  are real commits.
