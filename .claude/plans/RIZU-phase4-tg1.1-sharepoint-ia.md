# RIZU — Phase 4 Execution Plan: TG1.1 SharePoint Information Architecture

Date: 2026-04-25
Jira Key: RIZU
Slice: 1 (SharePoint Architecture + Isolation Guardrails)
Task Group: 1.1 Define Canonical SharePoint Information Architecture
Status: Ready for build after confirmation of external tenant details

## Scope

Deliver the executable implementation package for Task Group 1.1:
1. Canonical folder hierarchy standard.
2. Naming convention standard.
3. Ownership and responsibility matrix.
4. Operational runbook for onboarding and architecture governance.

This phase produces authoritative documentation artifacts and implementation checklists. It does not apply SharePoint tenant mutations directly from this repository.

## Technical Approach

### A. Canonical hierarchy specification

Define one source-of-truth hierarchy for all client onboarding:
- Clients/{Client}/Incoming
- Clients/{Client}/Processing
- Clients/{Client}/Final
- Leads/Incoming Uploads

Architecture rules to include:
- No custom per-client structural deviations without change approval.
- Incoming is always the upload target.
- Processing and Final are internal-only operational stages.

### B. Naming convention specification

Define enforceable standards:
- Client folder naming (normalized slug + display name guidance).
- Optional project subfolder naming pattern.
- Date/version naming pattern for handoff consistency.

Validation rules:
- Character restrictions.
- Length constraints.
- Conflict resolution strategy.

### C. Ownership model

Define accountable roles:
- Provisioning Owner (creates folders, links, baseline access).
- Security Owner (permission review and audit checks).
- Intake Owner (monitors Incoming and stage transitions).
- Escalation Owner (handles incidents and emergency link revocation routing).

Include RACI mapping for:
- New client onboarding.
- Structural exceptions.
- Incident triage.
- Quarterly access review.

### D. Runbook packaging

Create one concise operational runbook with:
- Prerequisites.
- Step-by-step onboarding.
- Verification checklist.
- Rollback/containment guidance.

## Planned Artifacts (Exact Files)

1. docs/sharepoint-intake/architecture-standard.md
- Canonical hierarchy and invariants.

2. docs/sharepoint-intake/naming-conventions.md
- Folder/file naming rules and examples.

3. docs/sharepoint-intake/ownership-matrix.md
- Role model and RACI.

4. docs/sharepoint-intake/onboarding-runbook.md
- End-to-end setup workflow and checks.

5. docs/sharepoint-intake/checklists/new-client-provisioning-checklist.md
- Execution checklist for operations.

6. docs/sharepoint-intake/checklists/architecture-validation-checklist.md
- Quality gate checklist for architecture compliance.

## Implementation Work Units

### Unit 1 — Baseline architecture standard

Actions:
1. Author architecture-standard.md with canonical tree and invariants.
2. Include prohibited deviations and exception process.

Done when:
- Canonical tree is unambiguous.
- All stage semantics are defined.

### Unit 2 — Naming standard

Actions:
1. Author naming-conventions.md with rule set and examples.
2. Include reserved characters and collision handling.

Done when:
- Rules are deterministic enough for operations to apply consistently.

### Unit 3 — Role and ownership model

Actions:
1. Author ownership-matrix.md with role definitions.
2. Add RACI table for onboarding and governance events.

Done when:
- Responsibility boundaries are explicit with no overlap ambiguity.

### Unit 4 — Onboarding runbook and checklists

Actions:
1. Author onboarding-runbook.md with ordered setup steps.
2. Create provisioning and validation checklists.

Done when:
- Another operator can execute setup with no external tribal knowledge.

## Verification Strategy

### Documentation verification

1. Consistency check
- Terminology is consistent across all new documents.
- No contradiction with existing phase plans.

2. Completeness check
- Every acceptance criterion from TG1.1 is mapped to an artifact section.

3. Operational dry-run check
- Simulate one client onboarding using checklist only.
- Record any missing steps and patch docs before approval.

### Acceptance criterion mapping

- Folder standard documented and approved:
  - architecture-standard.md
- Naming convention documented with examples:
  - naming-conventions.md
- Ownership matrix defined:
  - ownership-matrix.md
- Test client folder template ready:
  - onboarding-runbook.md + provisioning checklist validation step

## External Dependencies / Preconditions

1. Confirm target SharePoint site URL and library names.
2. Confirm named owners for provisioning, security, and intake.
3. Confirm file-size/file-type baseline for policy references.

If any dependency is missing, proceed with placeholders marked PENDING-INPUT and block final approval until filled.

## Risks and Controls

1. Risk: Overly generic standards that fail at execution time.
- Control: checklist-driven dry run before sign-off.

2. Risk: Ambiguous ownership leading to missed tasks.
- Control: explicit RACI with one accountable owner per activity.

3. Risk: Future drift between architecture docs and operations.
- Control: architecture-validation checklist and change-control section in runbook.

## Out of Scope (for this task group)

1. Tenant-side automation implementation (Power Automate/Graph flows).
2. Permission model implementation (handled by TG1.2).
3. Link governance policy implementation (handled by TG1.3).
4. SLA and sync triage implementation (handled by TG1.4).

## Execution Command for Next Phase

Upon approval, Phase 5 build for TG1.1 will:
1. Create the six documentation artifacts listed above.
2. Run a consistency verification pass.
3. Produce a brief dry-run report against the validation checklist.
