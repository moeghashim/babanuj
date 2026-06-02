#!/usr/bin/env node
// validate-findings.js — fail-closed provenance check for the PostHog observer.
// Usage: node validate-findings.js <trace.jsonl> <FINDINGS.next.json>
// Exit 0 = valid (every finding traces to a real PostHog MCP DATA result).
// Exit 1 = invalid; prints why. The runner discards the report on exit 1.
//
// Robust to both PostHog MCP shapes:
//   - dispatcher tool (`...__exec` with a `command` like `call query-trends {...}`):
//     only `call` results count as evidence; `search`/`info`/`schema`/`tools` are discovery
//     metadata (schemas, descriptions, examples) and are ignored, so a fabricated `raw` can't
//     hide in a schema dump.
//   - granular tools (`...__query-trends`, `...__execute-sql`, ...): no `command` field, so
//     every result is treated as data.
// A PostHog tool is identified by "posthog" appearing in its (server-prefixed) tool name,
// which holds whether the server is named "posthog" (our headless config) or surfaces the
// PostHog toolset under another prefix.
const fs = require("fs");

const [tracePath, findingsPath] = process.argv.slice(2);
if (!tracePath || !findingsPath) {
  console.error("usage: validate-findings.js <trace.jsonl> <findings.json>");
  process.exit(1);
}

// 1. Walk the run trace. Map tool_use id -> {name, command}, then collect the result text of
//    every tool_result whose originating tool was a PostHog MCP *data* call.
const toolById = {};
const posthogResults = [];

const DISCOVERY = /^\s*(search|info|schema|tools)\b/i; // exec subcommands that return metadata

for (const line of fs.readFileSync(tracePath, "utf8").split("\n")) {
  if (!line.trim()) continue;
  let ev;
  try { ev = JSON.parse(line); } catch { continue; }
  const blocks = ev?.message?.content;
  if (!Array.isArray(blocks)) continue;
  for (const b of blocks) {
    if (b.type === "tool_use" && b.id) {
      const command = b.input && typeof b.input.command === "string" ? b.input.command : "";
      toolById[b.id] = { name: b.name || "", command };
    }
    if (b.type === "tool_result" && b.tool_use_id) {
      const tool = toolById[b.tool_use_id];
      if (!tool || !/posthog/i.test(tool.name)) continue;
      // Dispatcher discovery calls are metadata, not evidence. Granular tools have no command.
      if (tool.command && DISCOVERY.test(tool.command)) continue;
      const text = Array.isArray(b.content)
        ? b.content.map((c) => (c && typeof c.text === "string" ? c.text : "")).join("\n")
        : (typeof b.content === "string" ? b.content : "");
      if (text.trim()) posthogResults.push(text);
    }
  }
}
const haystack = posthogResults.join("\n");

// 2. No PostHog data result at all => the agent observed nothing. Reject.
if (posthogResults.length === 0) {
  console.error("FAIL: run trace has no PostHog MCP data results — nothing was queried.");
  process.exit(1);
}

// 3. Every finding's verbatim `raw` snippet must appear in a captured PostHog data result.
//    A too-short `raw` would match trivially, so require some specificity.
const MIN_RAW_LEN = 8;
let report;
try { report = JSON.parse(fs.readFileSync(findingsPath, "utf8")); }
catch (e) { console.error(`FAIL: cannot parse ${findingsPath}: ${e.message}`); process.exit(1); }

const findings = report.findings || [];
if (findings.length === 0) {
  console.log("OK: 0 findings, PostHog was queried. Clean run.");
  process.exit(0);
}

const failures = [];
for (const f of findings) {
  const raw = (f.raw || "").trim();
  if (!raw) failures.push(`${f.id || "<no id>"}: missing 'raw' evidence snippet`);
  else if (raw.length < MIN_RAW_LEN)
    failures.push(`${f.id || "<no id>"}: 'raw' too short (<${MIN_RAW_LEN} chars) to be a real anchor`);
  else if (!haystack.includes(raw))
    failures.push(`${f.id || "<no id>"}: 'raw' not found in any PostHog data result — unverifiable`);
}

if (failures.length) {
  console.error(`FAIL: ${failures.length}/${findings.length} findings unverifiable:`);
  for (const m of failures) console.error("  - " + m);
  process.exit(1);
}
console.log(`OK: all ${findings.length} findings trace to real PostHog data results.`);
process.exit(0);
