# MODULO

A dark, premium personal productivity and everyday-utilities app.
**Phase 1: frontend foundation** — React + Vite + JavaScript + CSS + Lucide icons. No backend yet; data is saved in `localStorage`.

## Hosting (GitHub Pages)

The repository root already contains the compiled site (`index.html`, `assets/`), so
**Settings → Pages → Deploy from a branch → `main` → `/ (root)`** works with no build step.

## Developing

Source lives in `source/` (Node.js 20.19+):

```bash
cd source
npm install
npm run dev          # http://localhost:5173
npm run build        # rebuilds index.html + assets/ into the repo root
```

After rebuilding, commit the changed `index.html` and `assets/` and push.

## Features

- **App shell** — collapsible sidebar (remembered), mobile drawer, top bar with universal search, `Ctrl/⌘ K` hint, notifications, profile and date.
- **Dashboard** — live date/time, quick access, recently used tools, customisable workspace with Clock, Calculator, Quick Notes, To-do, Timer and Stopwatch widgets. Add/remove, drag-and-drop (plus up/down buttons), saved layout, reset.
- **Tools library** — six categories; 14 working tools, unbuilt ones marked *Coming soon*.
- **Notes** and **Bookmarks** — full create/edit/delete/search, saved locally.
- **Command palette** — `Ctrl+K` / `Cmd+K`, keyboard navigation.
- **Settings** — accent colour, appearance, sidebar, dashboard reset, local data reset with confirmation.

## Structure (`source/src`)

`app/` router · `components/` ui, layout, search · `config/` navigation, tools and widget registries · `context/` · `hooks/` · `lib/` · `pages/` · `services/storage.js` (single persistence layer — swap for an API later) · `store/` · `styles/` · `tools/` · `widgets/`
