# Project Plan: Eraser.io-Inspired Diagramming Platform

## Overview
A high-performance technical diagramming platform inspired by Eraser.io. Built with Next.js App Router, React 19, TypeScript, Tailwind CSS, `@xyflow/react` (MIT), IndexedDB for resilient offline-first persistence, Lucide icons, curated tech logos, Dagre layout engine for Diagram-as-Code, and high-fidelity PNG/SVG/JSON export.

---

## Phased Execution Roadmap

### Phase 0: Discovery, Architecture & Specifications (Complete)
- [x] Inspect environment & verify available tools.
- [x] Research observable features and interaction models from Eraser.io (layout, floating bars, orthogonal connections, DSL syntax, tech nodes).
- [x] Compare diagram engines (`@xyflow/react` vs `tldraw`) and confirm MIT licensing.
- [x] Define canonical document model decoupled from rendering engine.
- [x] Initialize Next.js project with App Router, TypeScript strict mode, and Tailwind CSS.
- [x] Create `PROJECT_PLAN.md`, `ARCHITECTURE.md`, and `FEATURE_STATUS.md`.

### Phase 1: Core Diagram Engine & Application Shell (Complete)
- [x] Install core dependencies: `@xyflow/react`, `lucide-react`, `zustand`, `clsx`, `tailwind-merge`.
- [x] Configure global styles, fonts, and dark/light technical canvas theme.
- [x] Build Application Header: editable diagram title, save status badge, undo/redo buttons, zoom level indicator, fit-to-screen, export/share buttons.
- [x] Build Floating Tool Rail: selection mode, shape picker, connector mode, text tool, tech icon picker, container/group tool.
- [x] Implement custom React Flow node renderers:
  - `ArchitectureNode`: Tech badge, custom icon, primary label, secondary subtitle, 4 directional handles.
  - `ShapeNode`: Rectangle, ellipse, diamond, cylinder/database, pill, cloud.
  - `GroupNode`: Subnet / VPC / container with header title, resizer, and children bounds.
  - `TextNode`: Markdown / rich text label with inline editing.
- [x] Implement custom edge renderer:
  - `SmartOrthogonalEdge`: Manhattan / elbow routing with smooth corner rounding and interactive label badges.
- [x] Viewport navigation: Smooth pan/zoom, trackpad pinch, Space+drag, Fit View.
- [x] History Management: Transactional undo/redo stack avoiding drag jitter.
- [x] Keyboard shortcuts: Delete, Backspace, Cmd+Z, Cmd+Shift+Z, Cmd+D, Escape.

### Phase 2: Architecture Icon System & Component Palette (Complete)
- [x] Curated vector tech icons registry across categories:
  - Cloud Providers (AWS, GCP, Azure)
  - Databases & Storage (PostgreSQL, MySQL, Redis, MongoDB, Elasticsearch, Kafka)
  - Backend & Languages (Node.js, Python, Go, Rust, Java, TypeScript, Docker, Kubernetes)
  - Frontend & Web (React, Next.js, Vue, GraphQL, Tailwind)
  - Networking & Security (Cloudflare, Nginx, Auth0, Datadog)
- [x] Searchable `IconPaletteModal`: Fast fuzzy search, category filtering, click/drag onto canvas.
- [x] Contextual node configuration: Change icon, update subtitle, customize colors.

### Phase 3: Persistent Storage & Shareable URLs (IndexedDB & Local State) (Complete)
- [x] IndexedDB persistence layer (`idbStorage.ts`) with schema versioning.
- [x] Diagram metadata: ID, title, element collection, connection collection, groups, viewport, timestamps.
- [x] Debounced autosave (500ms) with explicit visual states: "Saving...", "Saved to browser", "Save failed".
- [x] Shareable URL route `/d/[id]` loading diagram by public ID from IndexedDB.
- [x] Diagram lifecycle actions: Create new, Duplicate, Rename, Delete with confirmation, List recent diagrams modal.
- [x] Concurrency and revision tracking to prevent stale write overrides.

### Phase 4: High-Fidelity Export & Import (Complete)
- [x] PNG Export: Full diagram bounding box calculation, retina 2x scale, transparent or white background.
- [x] SVG Export: Clean vector export preserving text, paths, and icons.
- [x] JSON Source Export: Canonical diagram document format download.
- [x] JSON Import: File upload with schema validation, migration checks, and error toasts.

### Phase 5: Diagram-as-Code (Eraser DSL) & Floating Properties Bar (Complete)
- [x] Diagram-as-Code parser supporting Eraser DSL:
  - Group syntax (`VPC { api [icon: nodejs] > db [icon: postgres] }`)
  - Connection arrows (`>`, `<`, `<>`, `-`, `--`, `-->`)
  - Connection labels (`api > db: "SQL Query"`)
  - Node properties (`[icon: ..., color: ..., label: ...]`)
- [x] Hierarchical auto-layout using `@dagrejs/dagre` for compiling DSL directly to canvas.
- [x] Split view: Side-by-side DSL code editor and real-time visual canvas.
- [x] Floating contextual properties bar: Appears near active selection with color palette, border styles, text options.

### Phase 6: Polish, Verification, Build & Testing (Complete)
- [x] Automated unit tests (`node --test tests/diagram.test.mjs`) passing with 100% success.
- [x] Production build verification (`npm run build`) passing with zero errors.
- [x] End-to-end browser automation tests (`node e2e-test.js`) executed with headless Chrome.
- [x] Captured visual proof across canvas, DSL compilation, icon palette, and modals.
- [x] Complete user documentation in `README.md`.
