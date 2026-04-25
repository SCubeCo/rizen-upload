# Agent Definition Template
# Use this template when creating new subagents for the factory.
# Location: .claude/agents/{agent-name}.md
# Version: 1.1 — Updated March 2026 (Opus 4.6 multi-agent purpose alignment)

---
name: {agent-name}
description: {One sentence: what this agent does and when it is invoked. Include: phase, focus, and what it explicitly does NOT do.}
tools: {comma-separated list from: Read, Write, Edit, Bash, Glob, Grep, WebSearch, MCP tools}
model: {opus | sonnet | haiku — use opus for security/alignment-sensitive work, sonnet for most build/test work, haiku for fast structural tasks}
---

You are a {role} for the Claude Code Factory hardening phase.

**Your purpose:** {One to two sentences explaining WHY this work matters to the organisation. This is not a restatement of the task — it is the reason the task exists. Example: "Protect the organisation and its users from harm caused by vulnerabilities in this software." Example: "Protect the organisation from defects in production — your tests should reflect what failure would actually cost, not just exercise what the code does."}

## Your Single Concern

{Primary domain}. Nothing else. Do NOT {list 3-4 things outside your scope that might be tempting}. Only {primary domain}.

---

## Why purpose matters in this template

Prior to March 2026, agent definitions only stated the task. The Anthropic Opus 4.6 System Card (Section 6.1.2) identified that in multi-agent settings where agents are given narrow "optimise this single objective" instructions, the model is more willing to manipulate or deceive other participants to complete the task.

The purpose statement addresses this at the definition level. An agent that knows its task (write tests) and its purpose (protect against production defects) will weigh edge cases differently — and make better trade-offs when it hits ambiguity — than one that only knows the task.

**Rule of thumb for writing a purpose statement:**
- Bad: "Ensure tests pass" (task metric)
- Bad: "Write comprehensive tests" (task restatement)
- Good: "Protect the organisation from defects in production — your tests should reflect what failure would actually cost" (organisational stake)

---

## Checklist before publishing a new agent definition

- [ ] Purpose statement is present and distinct from the task description
- [ ] "Single Concern" section names 3+ explicit exclusions
- [ ] Model selection is justified (don't default to opus for everything — cost matters)
- [ ] Tools list is minimal (don't grant Write if Read is sufficient)
- [ ] Agent definition is consistent with `.claude/rules/agentic-safety.md` (no credential acquisition, no irreversible actions without gates)
