# Artwork Table — Art Institute of Chicago

A React + TypeScript data table application that displays artwork data from the [Art Institute of Chicago API](https://api.artic.edu/api/v1/artworks) with server-side pagination and persistent cross-page row selection.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [PrimeReact](https://primereact.org/) | DataTable component |
| [Art Institute of Chicago API](https://api.artic.edu/docs/) | Artwork data source |

---

## Features

- **Data Table** — Displays artwork records with the following fields:
  - Title
  - Place of Origin
  - Artist Display
  - Inscriptions
  - Start Date
  - End Date

- **Server-Side Pagination** — Fetches data from the API on every page change. No bulk pre-loading.

- **Persistent Row Selection** — Selected rows are remembered as you navigate between pages. Returning to a previously visited page restores your selections exactly.

- **Custom Row Selection Overlay** — A chevron button beside the header checkbox opens an overlay panel where you can type a number (e.g. 50) to select that many rows from the top — across pages — without any API prefetching.

- **Select All on Page** — The header checkbox selects or deselects all rows on the current page.

---

## Project Structure

```
src/
├── components/
│   ├── ArtworkTable.tsx        # Main table component + custom paginator
│   ├── ArtworkTable.css        # Table styles
│   ├── SelectionOverlay.tsx    # Chevron overlay for bulk row selection
│   └── SelectionOverlay.css    # Overlay styles
├── hooks/
│   └── useArtwork.ts           # Data fetching hook
├── types/
│   └── artwork.ts              # TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/artwork-table.git
cd artwork-table

# Install dependencies
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Selection Strategy (Key Logic)

This project implements a cross-page selection system **without prefetching other pages**.

Three pieces of state drive selection:

| State | Type | Purpose |
|-------|------|---------|
| `globalSelectCount` | `number` | How many rows from the top (globally) are bulk-selected |
| `selectedRowIds` | `Set<number>` | IDs manually checked by the user (overrides) |
| `deselectedRowIds` | `Set<number>` | IDs manually unchecked by the user (overrides) |

### How a row's selected state is determined:

```
1. If the row's ID is in selectedRowIds → SELECTED
2. If the row's ID is in deselectedRowIds → NOT SELECTED
3. If the row's global index < globalSelectCount → SELECTED
4. Otherwise → NOT SELECTED
```

This means:
- Entering `50` in the overlay marks rows 1–50 as selected (across pages) with zero extra API calls
- Manually unchecking a row within that range adds it to `deselectedRowIds` as an exception
- Manually checking a row outside that range adds it to `selectedRowIds` as an exception
- Navigating away and back to a page restores the exact same selection state

---

## API Reference

**Base URL:** `https://api.artic.edu/api/v1/artworks`

**Query Parameters Used:**

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (1-indexed) |
| `limit` | Records per page (default: 12) |
| `fields` | Comma-separated list of fields to return |

**Example Request:**
```
GET https://api.artic.edu/api/v1/artworks?page=1&limit=12&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end
```

---

## Deployment

### Netlify (Drag & Drop)

```bash
npm run build
# Drag the dist/ folder to https://app.netlify.com/drop
```

### Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Preview

> Table with server-side pagination, persistent checkbox selection, and custom bulk-select overlay.

---

## 📄 License

MIT
