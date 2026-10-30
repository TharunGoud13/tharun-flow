# Architecture Decision & Technical Specification

## 1. Canvas Engine Evaluation & License Rationale

We performed an architectural and legal evaluation of canvas libraries for technical diagramming:

1. **`@xyflow/react` (React Flow 12)**:
   - **License**: MIT License. Highly permissive for both personal and commercial use without restrictive copyleft.
   - **Architecture Fit**: Designed specifically for node-based graphs, ports/handles, nested containers, and orthogonal routing. Excellent custom node/edge support via standard React components.
   - **Auto-layout Compatibility**: Direct integration with Dagre and Elkjs for graph layout, ideal for Diagram-as-Code.
   - **Conclusion**: Selected as the primary canvas engine.

2. **`tldraw` v2**:
   - **License**: Proprietary tldraw SDK license requiring visible watermarks and licensing fees for commercial distribution.
   - **Architecture Fit**: Primarily geared towards freeform whiteboard sketching, drawing, and sticky notes rather than structured software architecture graphs and connector routing.
   - **Conclusion**: Rejected due to licensing restrictions and architectural misalignment.

3. **Custom Canvas (HTML5 Canvas / Konva)**:
   - **Conclusion**: Excessive reinventing of graph interactions (pan/zoom virtualization, connector collision detection, node resizing) that diverts time from product fidelity.

---

## 2. Technology Stack & Licensing

| Package | Purpose | License |
|---|---|---|
| `next` (16.x) | Web framework & App Router | MIT |
| `react` & `react-dom` (19.x) | Core UI library | MIT |
| `@xyflow/react` | Node-and-edge diagramming engine | MIT |
| `tailwindcss` (v4) | Utility-first CSS styling | MIT |
| `lucide-react` | General UI icons | ISC / MIT |
| `zustand` | Client-side reactive editor state | MIT |
| `idb` / Dexie | IndexedDB promise-based persistence | MIT / Apache-2.0 |
| `@dagrejs/dagre` | Hierarchical graph auto-layout for DSL | MIT |
| `html-to-image` | High-resolution canvas PNG rendering | MIT |
| `clsx` & `tailwind-merge` | Conditional Tailwind class composition | MIT |

---

## 3. Storage Architecture: IndexedDB Offline-First Persistence

Per user instructions, diagrams are stored persistently in **IndexedDB**:
- **Zero Latency**: Local writes complete in milliseconds without requiring network calls or user authentication.
- **Offline Resilient**: Continues functioning without internet; diagrams persist across browser restarts, page refreshes, and crashes.
- **Database Schema (`eraser_db`, version 1)**:
  - Object store `diagrams`: key path `id` (string), indexes on `updatedAt`, `title`.
  - Object store `preferences`: key path `key` (canvas theme, grid settings, recent diagram ID).
- **Public URL Mapping**:
  - The URL `/d/[id]` extracts the diagram ID and queries IndexedDB.
  - If found, it hydrates the canvas and synchronizes the URL.
  - If a new ID is requested or none exists, a fresh diagram is initialized with a cryptographically secure random public ID.

---

## 4. Canonical Document Data Model

The document model is completely decoupled from `@xyflow/react` internal state:

```typescript
export interface DiagramDocument {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  elements: DiagramElement[];
  connections: DiagramConnection[];
  groups: DiagramGroup[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  metadata: {
    theme: 'light' | 'dark' | 'system';
    gridType: 'dots' | 'lines' | 'none';
  };
}
```

---

## 5. Diagram-as-Code (Eraser DSL) Pipeline

The DSL pipeline operates in three steps:
1. **Lexical Analysis & Parsing**: Parses statements like `api [icon: nodejs] > db [icon: postgres]: "SQL"` and `group VPC { ... }` into abstract node and edge definitions.
2. **Auto-Layout (Dagre)**: Computes hierarchical coordinates (X, Y) respecting node dimensions, margins, and directional orientation (`direction right | down`).
3. **Canvas Synchronization**: Converts calculated coordinates into `DiagramElement` and `DiagramConnection` entries and renders them onto the canvas with smooth animation.

