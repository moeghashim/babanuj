#!/usr/bin/env node
// digest.js — human digest from a VALIDATED FINDINGS.json. Reads it only; adds no claims.
// Usage: node digest.js [path/to/FINDINGS.json]
const fs = require("fs");
let r;
try { r = JSON.parse(fs.readFileSync(process.argv[2] || "FINDINGS.json", "utf8")); }
catch (e) { console.error(`digest: cannot read findings: ${e.message}`); process.exit(1); }

const tag = { error: "[ERR]", gap: "[GAP]", enhancement: "[OPP]" };
const out = [`PostHog observer — ${r.generated_at || "(no timestamp)"} (${r.window_days ?? "?"}d)`, ""];

const findings = r.findings || [];
const fresh = findings.filter((f) => f.status === "new");
if (fresh.length) out.push(`${fresh.length} new since last run`, "");

if (findings.length === 0) {
  out.push("No findings this run — PostHog was queried and nothing cleared the bar.");
}
for (const f of findings) {
  out.push(`${tag[f.type] || "[*]"} ${f.title || "(untitled)"} — ${f.impact_estimate || "impact n/a"}`);
  if (f.evidence) out.push(`    ${f.evidence}`);
  out.push(`    -> ${f.suggested_action || "(no action)"} (${f.status || "?"})`);
}

const resolved = r.resolved_since_last_run || [];
if (resolved.length) out.push("", `resolved: ${resolved.join(", ")}`);

console.log(out.join("\n"));
