# RIZU — Phase 2 Slice Strategy

Date: 2026-04-25
Status: Updated, pending human approval
Input: SharePoint-first MVP brief understanding

## Objective

Recommend vertical delivery slices for MVP where clients upload media through SharePoint request links and the internal team receives files through OneDrive-mounted folders.

## Recommended Slice Sequence

### Slice 1 — SharePoint Information Architecture + Isolation Guardrails

Goal:
- Establish canonical SharePoint structure for Clients and Leads.
- Define and implement cross-client isolation model.
- Standardize provisioning for client folders and request-file links.

Why first:
- Everything else depends on safe folder structure and permissions.

Primary outputs:
- Approved folder hierarchy template.
- Permission model and group mapping.
- Client provisioning checklist.
- Request Files link provisioning model for MVP (manual/semi-automated), with automation around surrounding steps.

Dependencies:
- Microsoft 365 tenant access and admin-level configuration rights.

---

### Slice 2 — Client Upload UX + Post-Upload Guidance

Goal:
- Deliver no-login upload experience that is clear for bulk media.
- Ensure clients know exactly what to do after upload.

Why second:
- This is direct customer-facing value and validates real-world usability early.

Primary outputs:
- Upload entry page with instructions and constraints.
- Clear post-upload handoff instructions (what link/info to send to team).
- Baseline UX states (started, in-progress, success, failure).

Dependencies:
- Slice 1 request links and folder setup.

---

### Slice 3 — Internal Intake Workflow via OneDrive Sync

Goal:
- Standardize how internal team receives and processes uploaded assets.
- Minimize manual confusion between Incoming, Processing, and Final stages.

Why third:
- Upload value is incomplete without reliable team-side intake behavior.

Primary outputs:
- Team-facing intake SOP.
- Role responsibilities across project managers, editors, and ops.
- Defined sync latency expectation and exception handling.

Dependencies:
- Slice 1 architecture and Slice 2 handoff flow.

---

### Slice 4 — Notifications and Operational Visibility (Phase 1.1)

Goal:
- Add optional near-real-time upload notifications for internal teams.
- Improve responsiveness without introducing heavy custom engineering.

Why fourth:
- Operational enhancement that builds on stable intake flow.

Primary outputs:
- Power Automate flow for upload alerts (Email/Teams).
- Notification routing rules by client/project.
- Basic incident runbook for missing uploads.

Dependencies:
- Slices 1-3 complete.

---

### Slice 5 — Governance: Retention, Abuse Controls, and Scale Playbook

Goal:
- Finalize guardrails for 100+ client scalability and compliance posture.

Why fifth:
- Governance is required before larger rollout but should follow proven workflow.

Primary outputs:
- Link expiry/rotation policy.
- File type and size limits policy.
- Retention/archive/cleanup policy.
- Onboarding playbook for new client setup at scale.

Dependencies:
- Operational learning from Slices 1-4.

## Dependency Map

1. Slice 1 enables all subsequent slices.
2. Slice 2 depends on Slice 1.
3. Slice 3 depends on Slices 1-2.
4. Slice 4 depends on Slices 1-3.
5. Slice 5 consolidates policy and scale operations after workflow validation.

## Why This Sequencing Is Recommended

- It starts with security/isolation primitives before opening broader client usage.
- It delivers user-facing value quickly.
- It ensures internal operational readiness before automation/growth features.
- It codifies governance once real traffic patterns are observed.

## Risks and Mitigations by Slice

- Slice 1 risk: permission misconfiguration leading to cross-client exposure.
  - Mitigation: explicit permission matrix and validation checklist.

- Slice 2 risk: client confusion on upload completion and handoff.
  - Mitigation: mandatory post-upload instructions and guided UX states.

- Slice 3 risk: inconsistent internal processing across teams.
  - Mitigation: shared SOP with clear ownership model.

- Slice 4 risk: alert fatigue or missed notifications.
  - Mitigation: role-based routing and notification severity thresholds.

- Slice 5 risk: storage growth and unmanaged public links.
  - Mitigation: retention policy and link lifecycle governance.

## Open Decisions To Confirm Before Phase 3 Build Planning

1. Upload constraints
- Maximum file size and file type policy by workflow.

2. Isolation model detail
- Folder-level permission strategy versus separate libraries for high-sensitivity clients.

3. Handoff policy
- Required metadata clients must provide after upload (for example, job notes, deadline, contact).

4. Notification scope
- Which internal teams receive alerts by default in Phase 1.1.

5. Retention baseline
- Time windows for Incoming, Processing, Final, and Leads folders.

6. Request-link provisioning model
- Confirm MVP operating mode:
  - Manual/semi-automated creation and rotation of SharePoint Request Files links.
  - Graph API and Power Automate used for adjacent automation (folder setup, notifications, tracking), not as a guaranteed direct API for Request Files link generation.

## Gate

Human approval requested on:
1. Slice order and dependencies.
2. MVP boundary (mandatory slices before launch).
3. Open decisions requiring product and operations input before execution planning.
