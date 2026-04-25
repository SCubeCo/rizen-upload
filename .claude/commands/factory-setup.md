---
description: "Factory Setup — Generate CLAUDE.md, rules files, and architecture.html. Two modes: 'discovery' (from discovery outputs) or 'greenfield' (interactive tech stack definition)."
---

# Factory Setup

You are configuring this repository for the Claude Code Factory build workflow. Your job is to generate the lean CLAUDE.md and supporting rules files.

## Determine Mode

Check the argument: `discovery` or `greenfield`.
If no argument, check for `.discovery/` directory. If exists, suggest `discovery`. Otherwise suggest `greenfield`.

---

## Mode: Discovery

### Step 1: Read Discovery Outputs
- `.discovery/phase1-codebase-profile.md` — tech stack, structure, scale
- `.discovery/phase2-architecture.md` — architecture analysis
- `.discovery/phase2-code-quality.md` — coding patterns
- `.discovery/phase3-synthesis.md` — health score, findings
- `.discovery/deliverables/agentic-workspace/` — pre-derived constraints

### Step 2: Generate Files
Generate all files listed in "Output Files" below, deriving content from discovery.

### Step 3: Document Coherence
Invoke `.claude/skills/document-coherence/SKILL.md` to verify no duplication, CLAUDE.md <100 lines, rules internally consistent.

### Step 4: Archive Discovery
```bash
mkdir -p docs/discovery-archive
cp -r .discovery/* docs/discovery-archive/
```

---

## Mode: Greenfield

### Step 1: Gather Tech Stack
Ask the human:
1. What are you building? (one sentence)
2. Primary language and version?
3. Backend framework?
4. Frontend framework?
5. Database?
6. Testing framework?
7. Cloud provider? (optional)
8. CI/CD platform? (optional)
9. IaC tooling? (optional)
10. 3-5 design principles?

### Step 2: Generate Files
Generate all files from answers. Rules files start thin — they grow with the codebase.

### Step 3: Document Coherence
Same as discovery mode.

---

## Output Files

### 1. `CLAUDE.md` (< 100 lines)
Contains ONLY: project name, one-line description, note about rules auto-loading, standing constraints tables, design principles (3-5 bullets), key file locations, FACTORY_CONFIG block.

Does NOT contain: build methodology, architecture details, coding conventions, phase descriptions.

### 2. `.claude/rules/architecture-standards.md`
Code-verified architecture reference. Layers, contracts, registries, key paths, anti-patterns.

### 3. `.claude/rules/design-patterns.md`
Coding conventions. Naming, file organisation, error handling, testing, logging patterns.

### 4. `.claude/rules/build-methodology.md`
Already exists in pack — the standard 7-phase chain. No changes needed.

### 5. `architecture.html`
Living architecture visualisation with SCAN data markers. Discovery mode: populated. Greenfield: skeleton.

### 6. `MEMORY-TEMPLATE.md`
Already exists in pack. Copy if not present.

---

## Plan File Location (CRITICAL)

Plans are written to `.claude/plans/`.

---

## Post-Setup Verification

- [ ] `CLAUDE.md` exists and is under 100 lines
- [ ] `.claude/rules/architecture-standards.md` exists
- [ ] `.claude/rules/design-patterns.md` exists  
- [ ] `.claude/rules/build-methodology.md` exists
- [ ] `.claude/skills/document-coherence/SKILL.md` exists
- [ ] `architecture.html` exists
- [ ] No duplication between CLAUDE.md and rules files
- [ ] Git initialised

Report:
```
Factory v3.0 configured.
Mode: {discovery|greenfield}
CLAUDE.md: {line_count} lines
Rules: 3 files auto-loading
Architecture: {full|skeleton}
Ready to build — run /plan-brief to start.
```
