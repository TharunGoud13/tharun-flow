<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="tharun-flow" />
</p>

<h1 align="center">tharun-flow</h1>

<p align="center">
  A precise, fast canvas for architecture diagrams, flows and ideas.
  <br />
  Hand-drawn when you want it, pixel-clean when you don't.
</p>

---

## Highlights

- **A calm, premium editor** — Apple system palette, typography and surfaces in
  both light and dark mode.
- **A real workspace** — every diagram is saved to Firebase and available on
  every device.
- **History that feels instant** — a slide-out workspace panel with search,
  rename, duplicate and delete.
- **Architecture-aware** — a built-in icon picker with cloud, devops, database
  and architecture symbols, plus a curated libraries marketplace.
- **Explicit saving** — save on `⌘S` / `Ctrl+S`, or use the top-bar save button.
  Unsaved changes are surfaced, never hidden.
- **Collaboration, export and sharing** — live collaboration, shareable scenes,
  PNG/SVG export and the full command palette.
- **Private by default** — no ads, no telemetry, no external social links.

## Design system

tharun-flow uses Apple's system language rather than decorative accents:

| Token | Light | Dark |
| --- | --- | --- |
| Accent | `#0071E3` | `#0A84FF` |
| Surface | `#FFFFFF` / `#F5F5F7` | `#1C1C1E` / `#000000` |
| Text | `#1D1D1F` | `#F5F5F7` |
| Secondary text | `#6E6E73` | `#98989D` |
| Separator | `#E3E3E8` | `#38383A` |

The editor chrome is intentionally restrained: a single blue action, neutral
surfaces, 1px separators, soft depth, and no gradients.

## Stack

- React 19 + TypeScript
- Vite
- Firebase Firestore (diagrams & libraries)
- Lucide icons
- The open-source Excalidraw canvas engine

## Getting started

```bash
# 1. Install dependencies
yarn install

# 2. Configure the environment
cp .env.example .env.local
# add your Firebase web app config to VITE_APP_FIREBASE_CONFIG

# 3. Start the app
yarn start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `VITE_APP_FIREBASE_CONFIG` | Firebase web app config, values are public |
| `VITE_APP_BACKEND_V2_GET_URL` / `POST_URL` | Share-link backend |
| `VITE_APP_LIBRARY_URL` / `LIBRARY_BACKEND` | Library catalogue |
| `VITE_APP_WS_SERVER_URL` | Collaboration server |
| `VITE_APP_AI_BACKEND` | Optional AI backend |

Firestore rules should scope the `scenes` collection to the signed-in user.
Never commit `.env.local`.

## Scripts

```bash
yarn start            # dev server
yarn build            # production build
yarn test:typecheck   # TypeScript
yarn test:update      # unit tests
yarn fix              # lint + format
```

## Project layout

```
excalidraw-app/            app shell, top bar, workspace panel, Firebase
  components/              AppTopBar, DiagramHistorySidebar, modals, toasts
  data/                    Firestore persistence + local cache
packages/excalidraw/       canvas engine, UI primitives, themes
packages/element/          element model, bindings, transforms
public/                    brand icons, fonts, libraries, OG image
```

## License

MIT. The canvas engine is built on
[Excalidraw](https://github.com/excalidraw/excalidraw) and retains its original
MIT license and attribution. The tharun-flow name, interface, palette and
product layer are original to this project.
