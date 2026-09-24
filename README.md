# Digital Route Guide — Syama Prasad Mookerjee Port, Kolkata

An official movement guide for a Kolkata dock visit, built to be circulated by
WhatsApp, email and QR code and opened on a phone.

**Prescribed route**

```
ITC Royal Bengal
  → Maa Flyover
  → Kidderpore Road
  → C.G.R. Road
  → Gate No. 7, Netaji Subhas Dock
  → Netaji Subhas Dock Visit
  → Gate No. 3, Netaji Subhas Dock
  → 2 KPD Gate
  → Century Ports Ltd. — KPD-I (West)
  → C.G.R. Road
  → Hastings
  → SMPA Head Office, 15 Strand Road
```

This sequence is authoritative. It is held in one array in
`src/config/routeConfig.ts` and every part of the interface is generated from
it. Navigation links pass each intermediate road as an explicit waypoint so
Google Maps routes *through* the prescribed corridor rather than substituting a
faster alternative.

---

## ⚠ Before deployment — required confirmations

| Item | Status | Where |
|---|---|---|
| Gate No. 7, Netaji Subhas Dock — coordinates | ✅ **Confirmed by SMPA** `22.538664, 88.302729` | `routeConfig.ts` → `nsd-gate-7` |
| Century Ports Ltd., KPD-I (West) — coordinates | ✅ **Confirmed by SMPA** `22.544800, 88.314659` | `routeConfig.ts` → `century-ports-kpd-1-west` |
| Within-dock movement sequence | ✅ **Supplied by SMPA**, reproduced verbatim | `routeConfig.ts` → `netaji-subhas-dock.internalMovement` |
| Netaji Subhas Dock — visit point coordinates | ⬜ To be confirmed by SMPA | `routeConfig.ts` → `netaji-subhas-dock` |
| Gate No. 3, Netaji Subhas Dock — coordinates | ⬜ To be confirmed by SMPA | `routeConfig.ts` → `nsd-gate-3` |
| 2 KPD Gate — coordinates | ⬜ To be confirmed by SMPA | `routeConfig.ts` → `kpd-gate-2` |
| Official SMPA emblem | ⬜ Placeholder rendered | `routeConfig.ts` → `site.logoSrc` |
| Deployed URL (QR code + share link) | ⬜ `ADD_DEPLOYED_URL_HERE` | `routeConfig.ts` → `SITE_URL` |
| Visit date, reporting time, vehicle, coordinator, contact | ⬜ Intentionally empty — section hidden | `routeConfig.ts` → `visitDetails` |

### Open question for SMPA

The supplied within-dock movement sequence reads:

> Gate No. 7 NSD → Berth No. 7 (JSW) → Past Gate No. 4 → Past Gate No. 3 → to
> Berth No. 2 (200 T crane) **or** to Clock Tower & NSD Lock → Out from Gate
> No. 3 → along Garden Reach Road → Dock-I (West) KPD

It does **not** mention **2 KPD Gate**, which the prescribed route places between
Gate No. 3 and Century Ports Ltd. Both are currently shown: the numbered route
retains 2 KPD Gate as stop 05, and the movement sequence is reproduced exactly
as supplied. Confirm with SMPA whether the vehicle passes 2 KPD Gate on that
leg, and reconcile the two.

The remaining blanks are deliberate gaps, not omissions. **No coordinate for an
access-controlled gate or terminal has been invented.** Where one is absent the
interface prints `COORDINATES TO BE CONFIRMED BY SMPA` and suppresses the
navigation button rather than sending a driver to a guessed position.

The guide is fully usable in this state.

### Coordinate accuracy policy

Every coordinate in `routeConfig.ts` is marked with an `accuracy` field:

- `'confirmed'` — supplied by SMPA for this visit. Used for navigation: the deep
  link is built from the coordinate itself, which is more reliable than a place
  name for a gate Google may not index. Currently Gate No. 7 and Century Ports
  Ltd., KPD-I (West).
- `'approximate'` — a public landmark or public road, not surveyed. Good enough
  to draw an indicative corridor on the map. **Not** used for navigation —
  those links use place-name queries so Google resolves them against its own
  database.
- `coordinates: null` — access-controlled locations that must not be guessed.

When SMPA supplies further surveyed positions, set `coordinates` with
`accuracy: 'confirmed'` and add the `lat,lng` string as `mapsQuery`. The
interface picks up the navigation button, the map marker and the corridor leg
automatically.

Note: `C.G.R. Road` was repositioned to stay geometrically consistent with the
confirmed Gate No. 7 coordinate, which lies west of the original estimate. It
remains an approximation.

---

## Configuring the guide for a future visit

Edit **`src/config/routeConfig.ts`** only. No component changes are needed.

```ts
export const SITE_URL: string = 'https://route.example.gov.in';   // 1. after first deploy

export const site = {
  logoSrc: '/smpa-logo.png',        // 2. place the file in /public
  documentDate: '24 September 2026',
  ...
};

export const visitDetails = {       // 3. blank fields are not rendered
  date: '24 September 2026',
  reportingTime: '09:30 hrs',
  vehicleNo: 'WB 00 XX 0000',
  coordinator: 'Name, Designation',
  contact: '+91 00000 00000',
};

export const routePoints = [ ... ]; // 4. the prescribed sequence, in order
```

Each entry in `routePoints` carries:

| Field | Purpose |
|---|---|
| `id` | Marker number. `null` for an intermediate road segment. |
| `type` | `start` \| `road` \| `gate` \| `visit` \| `end` — drives colour, icon and map marker. |
| `phase` | `arrival` \| `port-visit` \| `departure`. |
| `label` | Small uppercase status label, e.g. `Entry`. |
| `address` | Optional. Omit rather than invent. |
| `instruction` | Movement instruction shown in the timeline. |
| `note` | Optional advisory shown in an inset. |
| `mapsQuery` | **Omit** for anything Google Maps cannot reliably resolve. No query → no navigation button. |
| `coordinates` | `null` for unconfirmed locations. |
| `driver` | Short action/primary/secondary strings for Driver View. |

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

Requires Node 18+.

## Deployment

### Vercel (preferred)

```bash
npm i -g vercel
vercel            # first run, link the project
vercel --prod
```

Framework preset **Vite**; build command `npm run build`; output directory
`dist`. `vercel.json` is included with long-lived caching for hashed assets.

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

`netlify.toml` is included (build `npm run build`, publish `dist`).

### GitHub Pages

`.github/workflows/deploy-pages.yml` builds and publishes on every push to the
default branch. Enable **Settings → Pages → Source: GitHub Actions**. The
workflow sets `BASE_PATH=/<repository-name>/` so asset paths resolve on a
project site.

### After the first deployment

Set `SITE_URL` in `routeConfig.ts` to the live URL and redeploy. Until then the
QR code and share link fall back to the address the page is served from, and a
notice says the URL has not yet been configured — no deployment URL is
fabricated in the source.

---

## What the site does

| Feature | Notes |
|---|---|
| **Route at a Glance** | Compact, screenshot-friendly sequence for forwarding on WhatsApp. |
| **Interactive map** | Leaflet + OpenStreetMap. Public-road legs are drawn solid; the leg between the two SMPA-confirmed port points is dashed and explicitly not presented as a routed road. Unconfirmed locations are listed beneath the map, not drawn. |
| **Within-dock movement** | The SMPA-designated sequence is reproduced verbatim at stop 03, in the Driver View and on the print sheet. It is never drawn as a routed path. |
| **Three-phase journey** | Phases 1 and 3 are public roads with Google Maps navigation. Phase 2 is the access-controlled port area and is explicitly marked as governed by SMPA instructions. |
| **Driver View** | `#driver` — very large high-contrast type, designed to be held up to a driver. Linkable directly. |
| **Share** | Web Share API, falling back to clipboard with a "Route link copied" confirmation, falling back to a prompt. |
| **QR code** | Generated at runtime from `SITE_URL`. |
| **Print** | A purpose-built single-page A4 route sheet — masthead, glance list, map, numbered stops with gate instructions, route note, QR and version. Site chrome is suppressed. |

### Why Leaflet rather than the Google Maps JavaScript API

No Google Maps API key is configured for this deployment, so the map renders
with Leaflet + OpenStreetMap while **every navigation action remains a Google
Maps deep link**. This keeps the site key-free, free to host and immune to
billing lapses.

To switch to the Google Maps JavaScript API later, replace
`src/components/RouteMap.tsx` only — `src/lib/maps.ts` and `routeConfig.ts` are
unchanged. Note the constraint that motivated the current design: the Directions
API will re-route between waypoints, so the prescribed sequence must still be
enforced by passing each road as an explicit waypoint, and internal dock roads
must never be drawn as if Google-verified.

---

## Project structure

```
src/
  config/routeConfig.ts      ← single source of truth; edit this
  lib/maps.ts                ← Google Maps URL API deep links
  components/
    SiteHeader.tsx           header, logo placeholder, Standard/Driver toggle
    Hero.tsx                 title, four-step hero journey, primary actions
    RouteAtAGlance.tsx       compact sequence card
    RouteMap.tsx             Leaflet map, legend, unplotted-locations list
    JourneyTimeline.tsx      three phases, numbered vertical timeline
    DriverView.tsx           large-type driver screen
    ShareAndQR.tsx           Web Share API, clipboard fallback, QR code
    VisitInformation.tsx     collapsible; hidden when no fields are set
    RouteNotice.tsx          dock-area advisory
    PrintSheet.tsx           the printed A4 route sheet
    BottomNav.tsx            sticky mobile navigation
    ui.tsx                   cards, buttons, markers, icon mapping
```

## Stack

React 18 · TypeScript (strict) · Tailwind CSS v4 · Vite · Leaflet · Lucide
icons · `qrcode`. No authentication, no database, no analytics, no tracking.

## Verified

Checked in a headless Chromium build at 390 / 430 / 768 / 1024 / 1440 px:

- no horizontal scrolling at any width
- all interactive targets ≥ 44 px
- no console or page errors from application code
- Driver View renders the full sequence at 30 px+ type
- print media resolves to a single A4 page with site chrome hidden
- QR code generates; share falls back to clipboard where the Web Share API is absent

**Not verified in this environment:** live Google Maps link resolution and
OpenStreetMap tile rendering — both hosts are blocked by the build container's
network policy. The deep links conform to the documented
[Google Maps URLs API](https://developers.google.com/maps/documentation/urls/get-started);
open each one once from a phone before circulating the guide.

## Accessibility

Semantic landmarks, a skip link, labelled sections, `aria-pressed` on the view
toggle, `aria-live` on the share confirmation, visible focus rings, and
`prefers-reduced-motion` support. Colour contrast meets WCAG AA at the sizes
used.

---

*This guide is a movement aid. It does not replace instructions issued by SMPA
officials or port security personnel.*
