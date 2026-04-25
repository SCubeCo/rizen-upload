---
description: "Update the living architecture visualisation. Run after every build phase, structural change, or new component. Scans codebase and regenerates architecture.html SCAN data."
---

# Update Architecture Visualization

You are the **custodian of the visual architecture document** (`architecture.html`). You own both the data and the design.

## When To Run

- **After every slice in Phase 5** (mandatory — part of build verification)
- After any structural change (new layer, component type, data flow)
- After hardening (Phase 6) to capture cross-cutting concerns
- On demand when the human wants to review architecture

## Procedure

### Step 1: Scan the Codebase

Gather fresh data by reading source files. Build a SCAN object capturing:
- **File metrics:** source count, test count, LOC
- **Architectural layers:** components, status, files per layer
- **Data contracts:** inter-layer models
- **Configuration:** registries, factories, composition points
- **Wiring:** inputs, outputs, parameters per component
- **Data flows:** runtime pipeline, config-to-instance flow

### Step 2: Read `architecture.html`

Find `// SCAN_START` and `// SCAN_END` markers. If file doesn't exist, create skeleton.

### Step 3: Replace SCAN Data

Replace between markers with fresh SCAN object:

```javascript
// SCAN_START
const SCAN = {
  generated: "ISO-8601",
  files: { source: N, tests: N, loc: N },
  layers: { L1: { name: "...", items: [...], status: "implemented|future" } },
  wiring: { "component": { inputs: [...], output: "Type", params: {}, file: "path" } },
  flows: { "component": { logic: "description", query: "pattern" } },
  pipeline: { contracts: [{ name: "Name", fields: "f1, f2" }] },
  dataReality: {
    sources: [
      {
        name: "source_name",
        component: "ComponentClass",
        layer: "L1",
        configuredMode: "real|synthetic",
        contractImplemented: true,
        fallbackChain: ["primary", "fallback", "synthetic"],
        freshnessThreshold: "1h"
      }
    ],
    summary: {
      total: 0, real: 0, synthetic: 0, unknown: 0,
      fallbackActive: 0, coveragePercent: 0
    }
  }
};
// SCAN_END
```

### Step 4: Evaluate Template Fitness

Does the HTML/CSS/JS template adequately represent current architecture?

**Template evolution triggers:**
- New architectural layer implemented
- New component category doesn't fit existing zones
- View grown too dense (>15 components)
- Pipeline flow changes

#### Visual Principles
1. Multi-level zoom: Overview → Layer → Component Detail
2. Spatial = structural (data flows left-to-right)
3. Semantic color system consistent across levels
4. Click-to-drill, breadcrumb navigation
5. Screenshot-friendly at each level
6. Data-driven rendering from SCAN object
7. **Three view modes:** Components | Data Flow | Data Reality

#### Data Reality View
Overlay on the architecture showing data source honesty:
- Component borders/badges coloured by data mode (green=real, blue=synthetic-by-design, red=fallback-active, grey=unknown)
- Summary bar: "X/Y sources audited | N real | N synthetic | N fallback | N unaudited"
- Click component for full DataReality report
- Filter toggles: real only, synthetic only, unaudited only, fallback-active only
- The "unaudited" count is the key risk number — components with no data reality contract

#### Technical Constraints
- Single self-contained HTML file, no CDN
- CSS Grid layout, CSS custom properties for colors
- SVG for connection lines
- `@media print` for printable output

### Step 5: Architecture Health Check

After updating, assess:
- **Structural drift:** Components outside declared layers?
- **Orphaned code:** Unreachable from entry points?
- **Coupling hotspots:** Too many connections?
- **Missing contracts:** Untyped data between layers?
- **Data reality gaps:** Components touching external data without DataReality contract?
- **Silent fallbacks:** Fallback chains that don't surface their activation?
- **Stale data risk:** Real sources without freshness thresholds configured?

Report data reality coverage:
```
Data Reality: X/Y sources audited (Z%)
  Real: N | Synthetic (by design): N | Fallback-active: N | Unknown: N
  ⚠ N components touch external data without DataReality contracts
```

Report issues with severity:
- **Refactor now** — compounds with next slice
- **Refactor before hardening** — can wait, must fix before Phase 6
- **Note for future** — not blocking
- **Data reality gap** — component needs DataReality contract before production

### Step 6: Write and Report

1. Write updated `architecture.html`
2. Report: SCAN changes, template changes, counts, health issues
