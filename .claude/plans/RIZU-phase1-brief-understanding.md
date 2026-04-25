# RIZU — Phase 1 Brief Understanding

Date: 2026-04-25
Status: Updated for approval
Source baseline: User-provided SharePoint brief plus discovery outputs

## What We Are Building

Phase 1 (MVP) is a SharePoint-based client media intake system:
- External users (clients and potential leads) upload media using public file request links.
- Files land in SharePoint Online with a client/project folder model.
- Internal team accesses files through OneDrive sync as mounted folders.
- Workflow is optimized for low cost, low friction, and immediate editing handoff.

MVP objective:
- Deliver a reliable upload and handoff pipeline without introducing AWS or new storage cost.

## Scope Boundaries

In scope for MVP:
- SharePoint request-file upload links.
- Folder structure per client with Incoming, Processing, Final stages.
- Internal access through OneDrive sync.
- Core UI/UX for upload and post-upload handoff guidance.

Out of scope for MVP:
- Full custom upload backend.
- CRM automation and lead enrichment (Phase 2).
- NAS hybrid storage and AI processing (Phase 3+).

## Key Technical Decisions

1. Storage platform (resolved)
- SharePoint Online is the storage layer for MVP.
- No AWS/S3 dependency in MVP.

2. Access model (resolved at high level)
- External uploads use no-login public request links.
- Internal access is permission-controlled via Microsoft 365 groups and OneDrive sync.

3. Intake organization model (resolved)
- Primary hierarchy:
  - Clients/{Client}/Incoming
  - Clients/{Client}/Processing
  - Clients/{Client}/Final
  - Leads/Incoming Uploads

4. UI importance (resolved)
- UI is core scope, not polish.
- Required UX states:
  - upload started,
  - upload in progress,
  - upload completed,
  - upload failed guidance,
  - post-upload sharing instructions.

5. Operational guardrails (open)
- Link expiry and rotation policy.
- Allowed file type and size constraints.
- Retention and cleanup policies.
- Anti-abuse and malware handling baseline.

## Risks Identified

1. Public-link abuse risk (high)
- No-login upload links need expiry/rotation and governance.

2. Cross-client exposure risk (high)
- Isolation goal is clear, but exact permission enforcement must be explicitly defined.

3. Scale-operability risk (high)
- 100+ clients can create manual provisioning bottlenecks without a standard workflow.

4. Sync-latency expectation risk (medium)
- OneDrive sync is near-real-time, not guaranteed instant.

5. Lifecycle policy gap (medium)
- Missing retention/archival rules may create storage growth and compliance issues.

## Dependencies and External Systems

- Microsoft 365 tenant (SharePoint Online + OneDrive sync).
- SharePoint document libraries and file request links.
- Optional Microsoft Forms and Power Automate for Phase 1.1/2 enhancements.

## Data Reality Alignment

| Layer | Mode |
| --- | --- |
| Upload interface | real |
| SharePoint storage | real |
| OneDrive sync | real |
| Notifications | optional / real |
| Lead metadata | synthetic -> real (Phase 2) |

## Open Questions

1. Naming and validation
- Do we enforce naming conventions at upload time?

2. Upload constraints
- What are max size and allowed file types by client/project?

3. Approval flow
- Are uploads auto-accepted into Processing or gated by manual approval?

4. Lead routing
- How are lead uploads routed between sales and operations?

5. Retention policy
- What archive/delete rules apply to Incoming, Processing, and Final folders?

6. SLA expectations
- What is the acceptable upload-to-team-visibility delay (for example, <= 5 minutes)?

## Success Criteria

- Clients upload files with minimal friction.
- Internal team gets fast access via mounted OneDrive folders.
- No cross-client file exposure.
- Low operational overhead.
- No incremental storage platform cost beyond existing Microsoft 365.

## Phase 1 Gate

This brief understanding is now aligned to the SharePoint-first architecture and replaces prior S3 assumptions.
Human approval is required before proceeding to execution planning for Slice 1.
