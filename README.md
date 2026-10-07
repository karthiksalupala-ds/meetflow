# MeetFlow

**MeetFlow is an AI-powered event planner for designing, optimizing, and
exporting 2D event layouts.**

It is a browser-first React application built on a proven canvas, geometry,
solver, undo/redo, proposal, export, and WebMCP architecture. The
user-facing product is now event-focused: participants, teams, event
resources, constraints, conflicts, and optimized layouts.

## What MeetFlow supports

- Event setup for Wedding, Hackathon, Seminar/Workshop, Corporate Meeting,
  College/E-Cell Event, and Custom Event.
- Wedding-specific controls (family groups, dance floor, band, cake, gifts, and
  wedding seating constraints) appear only when Wedding is selected.
- Non-wedding events use participant-oriented resources and event-specific
  layouts instead of wedding amenities.
- Participant and team planning.
- 2D floor-plan resources including:
  - team tables
  - mentor zones
  - judge tables
  - registration
  - food areas
  - presentation stages
  - entrances and exits
- Resource-specific floor-plan artwork rather than generic labelled boxes.
- Pointer and keyboard movement for event resources, with room-bound clamping.
- Tables, participants, constraints, conflict detection, optimization,
  undo/redo, proposals, and print/export workflows.
- A primary College Hackathon sample with 100 participants, 20 team tables,
  5 mentor zones, 3 judge tables, registration, food, stage, entrance, and
  exit

## Run locally

Requirements:

- Node.js 18 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally
`http://localhost:5173/` or `http://localhost:5174/` when the default port is
already occupied.

Useful commands:

```bash
npm test -- --run
npm run build
npm run preview
```

## First-run setup

On an empty workspace, MeetFlow opens the event setup dialog. Choose an event
type, venue dimensions, attendee count, and planning priorities, then select
**Generate AI event plan**.

For the hackathon demonstration, choose **College Hackathon**. The generated
layout contains the full event resource plan and uses the same 2D canvas
interaction model as manually created layouts.

Choose **Wedding** to use the original wedding seating workflow, including
family-group constraints and wedding venue amenities. Choose Seminar/Workshop,
Corporate Meeting, College/E-Cell Event, or Custom Event for non-wedding
resource sets; wedding-only controls are not advertised in those modes.

MeetFlow persists workspace state in browser local storage. To start the
first-run setup again, clear the site data for the local development origin or
run this in the browser console:

```js
localStorage.clear()
location.reload()
```

## WebMCP and external AI agents

MeetFlow does not contain an internal LLM, backend, or required API key.
External AI agents connect through WebMCP when the browser exposes
`document.modelContext` or `navigator.modelContext`.

The page registers event-planning tools dynamically as the workspace changes.
Important tools include:

| Tool | Purpose |
| --- | --- |
| `plan_event` | Create or update an event plan from structured requirements |
| `add_participant` | Add a participant to the event |
| `add_resource` | Add an event resource to the layout |
| `optimize_event_layout` | Arrange tables and resources using the solver |
| `detect_conflicts` | Report overlaps, out-of-bounds items, and event constraints |
| `propose_event_plan` | Preview a plan for human approval or rejection |
| `export_event_plan` | Open the event-plan export workflow |

When WebMCP is unavailable, the same tool surface is available from the
browser console:

```js
meetflow.tools()
await meetflow.call('optimize_event_layout', { mode: 'full' })
```

The original `window.aisle` console alias remains as a compatibility bridge for
existing integrations, but new integrations should use `window.meetflow`.

## Architecture

```text
User or external AI agent
          ↓
React UI and 2D Canvas
          ↓
Zustand event state
          ↓
WebMCP adapter and event tools
          ↓
Solver, constraints, geometry, and conflict detection
          ↓
Tables, participants, and event-resource floor plan
```

Important source areas:

- `src/App.tsx` — application shell and first-run event setup.
- `src/components/EventSetupDialog.tsx` — event type and planning setup.
- `src/components/Canvas.tsx` — interactive floor-plan canvas.
- `src/components/FloorArt.tsx` — reusable 2D event-resource visuals.
- `src/components/Sidebar.tsx` — event, venue, resource, participant, and
  constraint controls.
- `src/store.ts` — Zustand state, persistence, undo/redo, and mutations.
- `src/types.ts` — event metadata, participants, tables, resources, and
  compatibility types.
- `src/sample.ts` — hackathon fixture and event-specific sample generation.
- `src/geometry.ts` — room geometry, footprints, bounds, snapping, and
  conflict detection.
- `src/constraints.ts` and `src/solver.ts` — constraint evaluation and layout
  optimization.
- `src/webmcp/adapter.ts` — WebMCP API compatibility layer.
- `src/webmcp/tools.ts` — MeetFlow WebMCP tool definitions and registration.
- `src/export/` — print-ready event plan, Markdown, and CSV export.

## Design and domain migration

MeetFlow presents an event-planning product domain with event-oriented
terminology:

- event instead of wedding
- participant instead of guest
- event resource instead of amenity
- event layout instead of seating chart
- event constraint instead of house rule
- conflict instead of seating violation
- optimize event layout instead of auto-arrange seating

Some internal legacy compatibility identifiers remain in the source and persisted
storage keys so existing browser data and legacy integrations are not silently
broken. They are implementation details and are not part of the MeetFlow
user-facing experience.
## License

MIT. See [LICENSE](LICENSE).
