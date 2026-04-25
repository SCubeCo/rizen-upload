# RIZU — Phase 3: Slice 1 Plan — SharePoint Architecture + Isolation Guardrails

Date: 2026-04-25
Status: Pending human approval before Phase 4 execution planning + Phase 5 build
Jira Key: RIZU
Slice: 1 of 5

## Objective

Establish secure and scalable SharePoint foundations for the MVP by:
- Standardizing folder architecture for Clients and Leads.
- Defining and implementing cross-client isolation controls.
- Creating repeatable provisioning for client upload links.

MVP protocol note:
- Request Files links are treated as manual/semi-automated operations in Phase 1.
- Graph API and Power Automate are used to automate surrounding workflows (provisioning registry, notifications, tracking, and downstream processing).

Success: New client onboarding can be executed consistently with no cross-client visibility risk.

---

## Data Touchpoint Map

| Data Source | Build Mode | Synthetic Approach | Real Integration (Phase 6) | Fallback Behaviour |
| --- | --- | --- | --- | --- |
| SharePoint Site Structure | real (existing platform) | Test against non-production site/library | Production SharePoint site with controlled rollout | Stop and escalate on permission mismatch |
| Microsoft 365 Groups/Permissions | real (existing platform) | Use test groups for validation | Production groups by role/client | Deny access by default |
| File Request Links | real (existing platform) | Manual/semi-automated generation in test client folders first | Manual/semi-automated generation for live folders with governance controls | Disable link and rotate if misconfigured |
| Workflow Automation (Graph + Power Automate) | real (existing platform) | Automate notifications and tracking in test environment | Production automation for events, alerts, and metadata workflows | Manual operational fallback |
| Operational Metadata (client registry) | synthetic | Lightweight spreadsheet/list for provisioning log | SharePoint list or controlled internal tracker | Manual checklist fallback |

Build mode note:
- This slice touches existing real Microsoft 365 infrastructure.
- No AWS/S3 dependency is included.
- Request Files creation is not assumed to be a fully automated Graph endpoint in MVP planning.

---

## Task Groups

### Task Group 1.1 — Define Canonical SharePoint Information Architecture

Purpose:
- Lock one folder standard to prevent drift.

Tasks:
1. Define canonical hierarchy:
   - Clients/{Client}/Incoming
   - Clients/{Client}/Processing
   - Clients/{Client}/Final
   - Leads/Incoming Uploads
2. Define naming convention for clients/projects.
3. Define ownership model for folder creation and maintenance.
4. Document architecture in a runbook for operations and onboarding.

Acceptance Criteria:
- [ ] Folder standard documented and approved.
- [ ] Naming convention documented with examples.
- [ ] Ownership matrix defined.
- [ ] Test client folder created using the canonical template.

Files to create/modify:
- .claude/plans/RIZU-phase3-secure-upload-entry.md (this plan as source of truth).
- Operational docs location to be confirmed in Phase 4 execution planning.

Integration Points:
- SharePoint site configuration.
- Internal operations workflow.

Verification:
- Review and approve architecture with stakeholders.
- Validate template against one test client setup.

Data Touchpoints Used:
- SharePoint site structure (real).

---

### Task Group 1.2 — Implement Permission Isolation Model

Purpose:
- Ensure clients can upload only to designated locations and cannot view other files.

Tasks:
1. Define permissions matrix for:
   - External uploader (request link)
   - Project manager
   - Editor/designer
   - Sales/lead intake
2. Configure inheritance strategy and explicit breaks where needed.
3. Validate upload-only behavior on request links.
4. Validate no cross-client visibility through direct and indirect paths.

Acceptance Criteria:
- [ ] Permission matrix approved.
- [ ] External users have upload-only behavior.
- [ ] Internal least-privilege groups mapped.
- [ ] Cross-client access test cases pass.

Files to create/modify:
- Permission matrix artifact location to be set in Phase 4.
- Supporting runbook updates in docs.

Integration Points:
- Microsoft 365 group model.
- SharePoint folder permissions.

Verification:
- Test with at least two client folder trees and separate uploader links.
- Confirm no read/list access for external uploader persona.

Data Touchpoints Used:
- M365 groups and SharePoint permissions (real).

---

### Task Group 1.3 — Create Client Provisioning and Link Governance Workflow

Purpose:
- Make onboarding repeatable and safe as client count grows.

Tasks:
1. Define onboarding checklist:
   - create folder tree,
   - assign internal permissions,
   - generate request link (manual/semi-automated),
   - set link lifecycle controls,
   - record client entry in registry.
2. Define link governance baseline:
   - expiry policy,
   - rotation triggers,
   - emergency revocation process.
3. Define upload constraints policy (size/type).
4. Define security guardrails (malware handling and escalation path).
5. Define adjacent automation boundaries:
   - what is automated by Graph/Power Automate in MVP,
   - what remains manual in MVP,
   - what transitions to fuller automation in later phases.

Acceptance Criteria:
- [ ] Onboarding checklist can be executed by operations without ad hoc decisions.
- [ ] Link lifecycle policy documented.
- [ ] Upload constraints policy approved.
- [ ] Abuse/incident response path documented.
- [ ] Manual vs automated responsibility matrix documented for request-link lifecycle.

Files to create/modify:
- Provisioning checklist artifact location to be set in Phase 4.
- Governance policy docs in agreed documentation location.

Integration Points:
- SharePoint request-link administration.
- Internal service operations.

Verification:
- Run one end-to-end dry run for a sample client.
- Confirm revocation flow works within acceptable response time.

Data Touchpoints Used:
- SharePoint request links (real).
- Graph and Power Automate automation paths (real).
- Provisioning registry (synthetic initial tracker).

---

### Task Group 1.4 — Define Internal Intake SLA and Sync Expectations

Purpose:
- Align business expectations with OneDrive sync behavior and reduce operational ambiguity.

Tasks:
1. Define expected upload-to-availability SLA (for example <= 5 minutes target).
2. Define triage path when uploads are not visible in expected window.
3. Define stage transition ownership (Incoming -> Processing -> Final).
4. Define minimum telemetry signals for operations (manual or automated).

Acceptance Criteria:
- [ ] SLA defined and approved.
- [ ] Triage runbook documented.
- [ ] Stage ownership model documented.
- [ ] Team acknowledgement process established.

Files to create/modify:
- Internal intake SOP document location to be set in Phase 4.

Integration Points:
- OneDrive sync clients.
- Team operational workflow.

Verification:
- Execute one sample upload and verify observed sync time against SLA.
- Run one tabletop incident drill for delayed sync.

Data Touchpoints Used:
- OneDrive sync (real).

---

## Task Group Dependency Order

1. Task Group 1.1 (Architecture) — must complete first.
2. Task Group 1.2 (Isolation) — depends on 1.1 structure.
3. Task Group 1.3 (Provisioning/Governance) — depends on 1.1 and 1.2.
4. Task Group 1.4 (Intake SLA) — depends on 1.1 through 1.3.

Recommended execution order:
1.1 -> 1.2 -> 1.3 -> 1.4.

---

## Prerequisite Blocker Check

Before Phase 4 execution planning:

- [ ] Confirm target SharePoint site/library for MVP rollout.
- [ ] Confirm admin-level access for permission and link configuration.
- [ ] Confirm internal owners for operations, security, and intake workflow.
- [ ] Confirm initial policy values for file size/type limits and link expiry.

---

## Success Criteria for Slice 1

After all task groups complete:

1. SharePoint folder architecture is standardized and documented.
2. Permission model prevents cross-client exposure.
3. Client provisioning process is repeatable and auditable.
4. Public upload links have governance controls.
5. Internal intake SLA and triage process are defined.

---

## Phase 3 Gate

This plan is ready for human approval on:

1. Task group scope and order.
2. Permission model strictness and ownership.
3. Link governance defaults (expiry, rotation, constraints).
4. SLA target for upload-to-team visibility.

Once approved, Phase 4 will break each task group into executable work units with exact artifacts and verification steps.
