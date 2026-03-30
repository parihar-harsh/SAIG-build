# SAIG OSINT Conflict Monitoring System

> A real-time open-source intelligence dashboard tracking the Iran-US/Israel conflict. Built as part of the SAIG Build Test — March 2026.

---

##Live Link
>https://saig-build.onrender.com/

## What This Is

A full-stack intelligence dashboard that ingests live public data from 8 sources across 3 source categories, normalises everything into a structured 15-field schema, and presents it through four analyst-facing views: executive summary, live event feed, trend chart, and geospatial map.

Built to be usable by an analyst under time pressure. Every design decision was made with that constraint in mind.

---

## Demo

```
Frontend  →  http://localhost:5173
Backend   →  http://localhost:5001
```

---

## Architecture

```
Live RSS / APIs (8 sources)
        ↓
   seed.js  ← scrape, NLP extract, filter, normalise
        ↓
   MongoDB  ← upsert on source_url (deduplication)
        ↓
   Express API  ← GET /api/events  |  POST /api/sync
        ↓
   React Dashboard  ← filter, search, visualise
```

All data flows in one direction. No circular dependencies.

---

## Features

**Data Pipeline**
- Scrapes 8 live public sources across Official, NGO, and News categories
- NLP entity extraction (actors, locations) via compromise.js — no API key required
- Iran-relevance keyword filter applied post-fetch, pre-storage
- Upsert deduplication on `source_url` — pipeline is idempotent

**Dashboard Views**
- **Executive Summary** — 4 interactive KPI cards (Total Events, High Severity, Active Sources, Top Actor). Each card is a one-click filter
- **Live Event Feed** — scrollable, real-time feed with collapsible detail drawers. Fact and inference visually separated
- **Trend View** — stacked bar chart grouped by hour, colour-coded by severity
- **Map View** — Leaflet map with geocoded markers. Red = high severity

**Controls**
- Keyword search across all fields
- Source type filter (Official / NGO / News)
- Sort by newest, oldest, or highest severity
- Verified Only toggle (confidence ≥ 9 = NGO + Official sources only)
- CSV export of currently visible events
- Manual sync (triggers live scrape)
- Auto-sync (polls DB every 30 seconds, shows LIVE badge)
- Dark / light mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Scraping | rss-parser + axios |
| NLP | compromise.js |
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Maps | React-Leaflet + Leaflet 1.9 |

---

## Project Structure

```
├── backend/
│   ├── db.js          # MongoDB connection + Mongoose schema (15-field event model)
│   ├── seed.js        # Data pipeline: fetch → NLP → filter → upsert
│   ├── server.js      # Express API: GET /api/events, POST /api/sync
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                          # Wiring layer — no logic, no state
│   │   ├── hooks/
│   │   │   ├── useTheme.js                  # Dark mode, document class toggle
│   │   │   ├── useEventsFetch.js            # Fetch, manual sync, auto-sync
│   │   │   ├── useEventsFilter.js           # Three-tier filter pipeline
│   │   │   └── useDashboardData.js          # Master hook — composes all three
│   │   └── components/
│   │       ├── Header.jsx                   # Dark mode, auto-sync, manual sync
│   │       ├── ExecutiveSummary.jsx         # KPI cards with click-to-filter
│   │       ├── SummaryCard.jsx              # Reusable card with tooltip
│   │       ├── CommandBar.jsx               # Search, filters, export
│   │       ├── EventFeed.jsx                # Collapsible event cards, LIVE badge
│   │       ├── ViewSwitcher.jsx             # Trend / Location tab toggle
│   │       ├── TrendView.jsx                # Recharts stacked bar chart
│   │       └── LocationView.jsx             # Leaflet map with geocoded markers
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.19.0
- MongoDB instance (local or Atlas)
- npm

### 1. Clone

```bash
git clone https://github.com/your-username/saig-osint-dashboard.git
cd saig-osint-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/saig_osint
PORT=5001
```

### 3. Seed the Database

Run this once to do an initial scrape and populate the database:

```bash
node seed.js
```

You will see output like:

```
MongoDB Connected successfully
Fetching OSINT data from 8 sources and extracting actors via NLP...
Pipeline complete. Scraped 142 total events. Retained 38 relevant events.
Inserted 38 new dynamically parsed events into DB.
```

### 4. Start the Backend

```bash
npm start
# Server running on port 5001
```

### 5. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

### 6. Open the Dashboard

Navigate to `http://localhost:5173` in your browser.

Click **Sync Live Data** in the header to trigger a fresh scrape at any time.

---

## Data Sources

| Source | Category | Method |
|---|---|---|
| UN News — Middle East | Official | RSS |
| ReliefWeb | NGO | REST API |
| Al Jazeera | News | RSS |
| BBC News — Middle East | News | RSS |
| The Guardian — Middle East | News | RSS |
| New York Times — Middle East | News | RSS |
| France 24 — Middle East | News | RSS |
| Times of Israel | News | RSS |

All sources are publicly accessible. No authentication, paywalls, or proprietary data used.

---

## Data Schema

Every event stored in MongoDB follows this 15-field schema:

| Field | Type | Description |
|---|---|---|
| `event_datetime_utc` | Date | Publication timestamp (UTC) |
| `source_name` | String | e.g. BBC News, UN News |
| `source_url` | String (unique) | Deduplication key |
| `source_type` | String | Official \| NGO \| News |
| `claim_text` | String | Raw headline — stored as fact, never modified |
| `country` | String | Middle East |
| `location_text` | String | NLP-extracted place name |
| `actor_1` | String | NLP-extracted primary actor |
| `actor_2` | String | NLP-extracted secondary actor |
| `event_type` | String | News Report \| Statement \| Humanitarian Update |
| `domain` | String | General \| Diplomatic \| Geopolitics |
| `severity_score` | Number 1–10 | Heuristic: attack/strike/dead keywords = 8, else 4 |
| `confidence_score` | Number 1–10 | Source credibility proxy: Official=10, NGO=9, News=8 |
| `tags` | String[] | Source category tag |
| `last_updated_at` | Date | Auto-set on insert/update |

---

## API Reference

### `GET /api/events`

Returns all events sorted by `event_datetime_utc` descending.

**Response:**
```json
[
  {
    "_id": "...",
    "event_datetime_utc": "2026-03-29T10:30:00.000Z",
    "source_name": "BBC News",
    "source_url": "https://...",
    "source_type": "News",
    "claim_text": "Iran warns of response following...",
    "country": "Middle East",
    "location_text": "Tehran",
    "actor_1": "Iran",
    "actor_2": "Israel",
    "event_type": "News Report",
    "domain": "General",
    "severity_score": 8,
    "confidence_score": 8,
    "tags": ["News"],
    "last_updated_at": "2026-03-29T10:31:00.000Z"
  }
]
```

### `POST /api/sync`

Triggers the seed pipeline. Scrapes all 8 sources, filters for Iran-relevant events, and upserts to the database.

**Response:**
```json
{ "message": "OSINT feeds synchronized successfully" }
```

---

## Key Design Decisions

**Why upsert on `source_url`?**
RSS feeds republish articles. Upsert means the pipeline can run multiple times safely — no duplicates accumulate, no crashes on constraint violations.

**Why three filter tiers (`baseEvents` → `searchedEvents` → `displayedEvents`)?**
Different UI components need different data. The "Total Events" KPI should not change when the user types in the search box. The event feed should. Three tiers let each component get exactly the right slice.

**Why `compromise.js` for NLP?**
Runs entirely server-side with no API key, no rate limits, no external dependency at runtime. For a known conflict-domain use case, entity extraction from headlines is accurate enough for analyst triage.

**Why poll the DB in auto-sync rather than re-scraping?**
Re-scraping external RSS feeds every 30 seconds would risk rate limiting. Auto-sync reads the local database silently — only the manual Sync button triggers an external scrape.

**Why separate hooks for logic and components for UI?**
Every piece of state and business logic lives in hooks. Components are pure rendering functions. This makes every piece of logic independently testable and keeps `App.jsx` as a clean wiring layer.

---

## Known Limitations

- **Severity scoring is heuristic** — keyword-based, not ML. Transparent and auditable, but not nuanced.
- **Geocoding uses a static dictionary** — ~20 conflict-zone locations. Events with unlisted locations do not appear on the map.
- **Auto-sync polls the DB, not live feeds** — fresh data requires a manual sync or a server-side cron (not implemented).
- **Confidence score is a source-type proxy** — not claim verification. An Official source score of 10 means the institution is credible, not that the specific claim is verified.
- **`exec('node seed.js')` in server.js** — assumes the server is started from the `backend/` directory. Use an absolute path (`__dirname`) in production.

---

By Harsh
---

## License

MIT — see [LICENSE](./LICENSE)
