# Eraser Canvas — Technical Architecture Diagramming Platform

A production-grade technical diagramming web application inspired by the workflow, canvas aesthetics, and Diagram-as-Code features of [Eraser.io](https://www.eraser.io/).

---

## ✨ Features

- **Interactive Architecture Canvas**:
  - Crisp dot-grid workspace with smooth pan, zoom (10%–200%), and trackpad pinch navigation.
  - Multi-handle connection ports with magnetic snap.
  - Interactive Minimap and quick Fit-to-Screen controls.
- **Custom Technical Architecture Nodes**:
  - Official high-fidelity vector tech icons (AWS, GCP, Azure, Docker, Kubernetes, React, Next.js, Node.js, Python, PostgreSQL, Redis, Kafka, MongoDB, Cloudflare, etc.).
  - Primary title, secondary metadata subtitle (e.g., `"Fargate · 6 tasks"`), and customizable border/fill palettes.
- **Smart Orthogonal Edge Routing**:
  - Clean 90-degree elbow connectors with rounded corners.
  - Interactive centered label pills with solid contrast backgrounds.
  - Directional arrowheads and dashed/solid styles.
- **Group & Subnet Containers**:
  - Boundary boxes for VPCs, subnets, clusters, and microservice groups with customizable headers and dashed outlines.
  - Fully resizable via corner/edge resize handles.
- **Diagram-as-Code (Eraser DSL)**:
  - Text-to-diagram compilation supporting Eraser's syntax:
    ```
    direction right
    Client [icon: react, label: "React Frontend"]
    API [icon: nodejs, label: "Node.js REST API"]
    Database [icon: postgresql, label: "PostgreSQL DB"]

    Client > API: "HTTPS GET/POST"
    API > Database: "SQL Queries"
    ```
  - Hierarchical auto-layout powered by Dagre (`@dagrejs/dagre`).
- **Offline-First Persistence (IndexedDB)**:
  - Real-time debounced autosave (500ms) with explicit visual states (`Saving...`, `Saved to browser`).
  - Stores all documents locally in browser IndexedDB—survives page refreshes and browser restarts without requiring an external login.
  - Public shareable URLs (`/d/[id]`) with cryptographically secure random IDs.
- **High-Resolution Export**:
  - **PNG Image**: 2x Retina scale with full bounding box crop and background options.
  - **SVG Vector**: Clean vector paths preserving all tech icons and fonts.
  - **JSON Document**: Canonical diagram source export & validated import.
- **Full History & Shortcuts**:
  - Transactional Undo/Redo (`Cmd+Z`, `Cmd+Shift+Z`).
  - Duplicate (`Cmd+D`), Delete (`Backspace` / `Del`), Deselect (`Escape`).

---

## 🛠️ Tech Stack & Licenses

- **Framework**: [Next.js](https://nextjs.org/) (App Router) — MIT
- **UI Engine**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) — MIT
- **Canvas Engine**: [`@xyflow/react`](https://reactflow.dev/) (React Flow 12) — MIT
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) — MIT
- **Icons**: [Lucide React](https://lucide.dev/) + Curated Vector Tech Logos — ISC / MIT
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) — MIT
- **Local Persistence**: [idb](https://github.com/jakearchibald/idb) (IndexedDB) — ISC / MIT
- **Graph Layout**: [`@dagrejs/dagre`](https://github.com/dagrejs/dagre) — MIT
- **Image Generation**: [`html-to-image`](https://github.com/bubkoo/html-to-image) — MIT

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

### 4. Running Tests
```bash
npm test
```

---

## 📁 Project Structure

```
eraser-canvas/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML shell
│   │   ├── page.tsx                # Main diagram studio
│   │   ├── d/[id]/page.tsx         # Shareable diagram route by ID
│   │   └── globals.css             # Tailwind v4 & React Flow CSS
│   ├── components/
│   │   ├── editor/
│   │   │   ├── Canvas.tsx          # React Flow canvas container
│   │   │   ├── EditorHeader.tsx    # Brand, title, autosave pill, export/share
│   │   │   ├── ToolRail.tsx        # Floating left toolbar
│   │   │   ├── ContextToolbar.tsx  # Quick color & style property bar
│   │   │   ├── IconLibraryModal.tsx# Searchable categorized tech icons
│   │   │   ├── ExportModal.tsx     # PNG/SVG/JSON export & import
│   │   │   ├── ShareModal.tsx      # Share link generator
│   │   │   └── RecentDiagramsModal.tsx # Saved diagrams browser
│   │   ├── nodes/
│   │   │   ├── ArchitectureNode.tsx# Tech node renderer with icons & badges
│   │   │   ├── ShapeNode.tsx       # Basic shapes (box, diamond, cylinder, etc.)
│   │   │   ├── GroupNode.tsx       # Subnet/VPC container node
│   │   │   └── TextNode.tsx        # Text annotation node
│   │   ├── edges/
│   │   │   └── OrthogonalEdge.tsx  # Elbow router with centered label pills
│   │   └── dsl/
│   │       ├── DslPanel.tsx        # Diagram-as-code editor slide-over
│   │       ├── eraserDslParser.ts  # DSL parser into AST
│   │       └── dslLayout.ts        # Dagre hierarchical auto-layout
│   ├── lib/
│   │   ├── icons/techIcons.tsx     # Curated SVG tech icons registry
│   │   ├── storage/idbStorage.ts   # IndexedDB persistence engine
│   │   └── store/diagramStore.ts   # Zustand state and history stack
│   └── types/
│       └── diagram.ts              # Canonical document data model
├── tests/
│   └── diagram.test.mjs            # Unit tests for parser, IDs, and schema
├── PROJECT_PLAN.md                 # Detailed project roadmap & milestones
├── ARCHITECTURE.md                 # Technical architecture & engine comparison
└── FEATURE_STATUS.md               # Feature matrix & verification records
```
