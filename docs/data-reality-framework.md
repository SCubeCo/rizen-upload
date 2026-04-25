# Data Reality Framework

> How the factory ensures every data source is honest about its operating mode,
> and how the architecture visualisation makes the current state visible at a glance.

## The Problem

Systems built with the factory often use synthetic data during development (by design —
building with mocks is faster and safer). The danger is the transition: components that
*look* like they're running on real data but are actually on synthetic, fallback, or stale
data. This creates false confidence — green dashboards, passing tests, healthy metrics —
all built on data that has no signal.

**Silent fallbacks are the worst offender.** A cascade like DB → API → synthetic is great
for developer experience but dangerous in production. If the DB goes down and the system
silently falls back to synthetic candles, your backtest looks fine but means nothing.

## Core Principle: Declare and Verify

Every component that touches external data MUST:

1. **Declare** its configured data mode
2. **Report** its actual runtime data mode
3. **Surface** any discrepancy between configured and actual

The configured mode is intent. The actual mode is reality. The gap between them is risk.

## Data Mode Vocabulary

| Mode | Meaning | Colour |
|------|---------|--------|
| `real` | Connected to production data source, verified fresh | Green |
| `real-stale` | Connected to real source but data older than freshness threshold | Amber |
| `synthetic` | Using generated/mock data by design | Blue |
| `fallback-active` | Configured for real but fallen back to synthetic/cached | Red |
| `degraded` | Partial real data — some fields real, some falling back | Orange |
| `unknown` | No data reality contract implemented | Grey |

## The Data Reality Contract

Every data-touching component implements a simple interface:

```python
# Python example — adapt to your stack
class DataRealityAware:
    @property
    def data_reality(self) -> DataReality:
        return DataReality(
            source_name="fear_greed_api",
            configured_mode="real",          # what the config says
            actual_mode="real",              # what's actually happening right now
            last_verified=datetime.utcnow(), # when we last confirmed the mode
            freshness_threshold=timedelta(hours=1),  # how stale before it's a problem
            last_data_timestamp=datetime(...),        # when the actual data was produced
            fallback_chain=["api", "cache", "synthetic"],  # what happens if real fails
            metadata={}                      # component-specific context
        )
```

```typescript
// TypeScript example
interface DataReality {
  sourceName: string;
  configuredMode: 'real' | 'synthetic' | 'fallback-active' | 'degraded' | 'unknown';
  actualMode: 'real' | 'real-stale' | 'synthetic' | 'fallback-active' | 'degraded' | 'unknown';
  lastVerified: Date;
  freshnessThreshold: number; // milliseconds
  lastDataTimestamp: Date;
  fallbackChain: string[];
  metadata: Record<string, unknown>;
}
```

The contract is intentionally simple. The power is in making it universal — every data
touchpoint reports in the same vocabulary.

## Architecture Visualisation: Data Reality View

The `/update-architecture` command already scans the codebase and produces `architecture.html`
with component views and data flow views. Data Reality adds a third view mode.

### SCAN Extension

```javascript
// Inside the SCAN object
dataReality: {
  sources: [
    {
      name: "fear_greed_api",
      component: "FearGreedIndicator",
      layer: "L1",
      configuredMode: "real",
      contractImplemented: true,    // does this component implement DataRealityAware?
      fallbackChain: ["api", "cache", "synthetic"],
      freshnessThreshold: "1h"
    },
    {
      name: "binance_websocket",
      component: "CandleWSCollector",
      layer: "data",
      configuredMode: "real",
      contractImplemented: true,
      fallbackChain: ["websocket", "rest_api", "last_known"],
      freshnessThreshold: "5m"
    },
    {
      name: "user_database",
      component: "UserRepository",
      layer: "data",
      configuredMode: "synthetic",  // intentionally mock during dev
      contractImplemented: false,   // hasn't been wired up yet
      fallbackChain: ["db", "in_memory"],
      freshnessThreshold: null
    }
  ],
  summary: {
    total: 12,
    real: 5,
    synthetic: 4,
    unknown: 3,        // no contract implemented — these are the dangerous ones
    coveragePercent: 75 // % of data sources with contracts
  }
}
```

### Visual Representation

The Data Reality view overlays the existing architecture:

- **Component boxes** get a coloured border/badge showing their data mode
- **Connection lines** between components show data flow with mode colour
- **Summary bar** at top: "9/12 sources audited | 5 real | 3 synthetic (by design) | 1 fallback-active | 3 unaudited"
- **Click any component** to see its full DataReality report
- **Filter toggles**: show only real, only synthetic, only unaudited, only fallback-active

The "unaudited" (grey/unknown) count is the key number. That's your risk surface — components
where you don't know what mode they're in because the contract hasn't been implemented.

## Factory Integration

### During Build (Phase 5)

When building components that touch external data:
- Implement the DataReality contract as part of functional correctness
- This is NOT a hardening concern — it's core to the component working correctly
- The component must know its own data mode to function properly

Add to `.claude/rules/design-patterns.md`:
```
All components that fetch, read, or receive external data MUST implement
the DataReality contract. This is a build concern, not a hardening concern.
```

### During Architecture Review (after Phase 5)

`/update-architecture` scans for DataReality implementations:
- Which components implement the contract?
- Which don't? (these are "unknown" — flag them)
- What's the overall coverage percentage?

Report coverage gaps to human as part of architecture health check.

### During Hardening (Phase 6)

**Observability Agent** wires up data reality monitoring:
- Log mode transitions (real → fallback-active)
- Alert on unexpected mode changes
- Dashboard panel showing current data reality state

**Resilience Agent** reviews fallback chains:
- Are fallbacks actually working?
- What's the cascade behaviour?
- Is there graceful degradation or silent failure?

**Data Integration Hardener** (8th agent) uses data reality contracts:
- Step 1 audit is richer: not just "is there a mock?" but "what's the DataReality contract say?"
- Migration plan can be more precise: "these 3 sources are synthetic-by-design, these 2 are
  fallback-active (meaning something is wrong), these 4 have no contract (unknown risk)"

**Test Agent** adds data reality verification tests:
- Test that each component correctly reports its mode
- Test that fallback chains work as declared
- Test that freshness thresholds trigger appropriate alerts

### During Ship (Phase 7)

Deployment checklist includes:
- [ ] Data reality coverage ≥ 90% (configurable threshold)
- [ ] No "unknown" data sources in production-critical paths
- [ ] All "fallback-active" sources have been investigated
- [ ] Monitoring dashboards include data reality panel

## FACTORY_CONFIG Addition

```
DATA_REALITY_COVERAGE_THRESHOLD: 0.90
DATA_REALITY_BLOCK_ON_UNKNOWN: true
DATA_REALITY_FRESHNESS_CHECK: true
```

## Why This Matters

The factory principle is "agents do translation work, humans do judgment work." Deciding
which data sources should be real vs synthetic is judgment work. But knowing which ones
ARE real vs synthetic — that's translation work the system should do automatically and
surface honestly. You should never have to discover the hard way that something you
thought was real has been running on synthetic data.
