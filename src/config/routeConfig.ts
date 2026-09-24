/**
 * ============================================================================
 * CENTRAL ROUTE CONFIGURATION
 * Syama Prasad Mookerjee Port, Kolkata (SMPA / SMPK) — Digital Route Guide
 * ============================================================================
 *
 * The entire interface is generated from this file. To reuse this site for a
 * future visit, edit ONLY this file — no component changes are required.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT: Verify exact gate coordinates with SMPA before deployment.
 * ---------------------------------------------------------------------------
 *
 * COORDINATE POLICY
 * -----------------
 * No coordinate in this file has been surveyed or confirmed by SMPA.
 *
 *   accuracy: 'approximate'  A publicly known landmark or public road. The
 *                            point is good enough to draw an indicative
 *                            corridor on the illustrative map. It is NOT used
 *                            for turn-by-turn navigation.
 *   accuracy: 'unconfirmed'  Coordinates deliberately left as `null`. These are
 *                            access-controlled port gates and terminal
 *                            locations that MUST NOT be guessed. The interface
 *                            renders "COORDINATES TO BE CONFIRMED BY SMPA".
 *
 * Navigation deep links are built from PLACE-NAME QUERIES, not from the
 * coordinates below, so Google Maps resolves them against its own database
 * rather than against an approximate point in this file. A stop without a
 * `mapsQuery` shows no navigation button at all — by design.
 *
 * The guide remains fully usable while every coordinate below is unconfirmed.
 */

export type StopType = 'start' | 'road' | 'gate' | 'visit' | 'end';
export type PhaseId = 'arrival' | 'port-visit' | 'departure';
export type Accuracy = 'approximate' | 'unconfirmed';

export interface Coordinates {
  lat: number;
  lng: number;
  /** Never 'verified' until SMPA confirms. See COORDINATE POLICY above. */
  accuracy: Accuracy;
}

export interface RoutePoint {
  /** Sequence number shown in the numbered marker. `null` for road segments. */
  id: number | null;
  /** Stable key used for anchors, map markers and React keys. */
  key: string;
  name: string;
  /** Secondary line, e.g. "KPD-I (West)". */
  subtitle?: string;
  type: StopType;
  phase: PhaseId;
  /** Small uppercase status label, e.g. "STARTING POINT". */
  label: string;
  /** Postal address. Omitted where no address has been supplied by SMPA. */
  address?: string;
  /** Movement instruction shown in the timeline. */
  instruction?: string;
  /** Extra advisory shown as an inset note. */
  note?: string;
  /**
   * Google Maps search query. Omit for any location that cannot be reliably
   * resolved by Google Maps (internal port gates, terminal berths).
   */
  mapsQuery?: string;
  /** See COORDINATE POLICY. `null` = COORDINATES TO BE CONFIRMED BY SMPA. */
  coordinates: Coordinates | null;
  /** Short form used in the Driver View. */
  driver: { action: string; primary: string; secondary?: string };
}

export interface Phase {
  id: PhaseId;
  number: number;
  title: string;
  summary: string;
  /** Who governs movement during this phase. */
  authority: 'public-road' | 'smpa-controlled';
  authorityNote: string;
}

export interface VisitDetails {
  /** Any field left as an empty string is not rendered. */
  date: string;
  reportingTime: string;
  vehicleNo: string;
  coordinator: string;
  contact: string;
}

/* ==========================================================================
   SITE
   ========================================================================== */

/** Replace after the first deployment. Used for the QR code and share links. */
export const SITE_URL: string = 'ADD_DEPLOYED_URL_HERE';

export const site = {
  authority: 'Syama Prasad Mookerjee Port, Kolkata',
  authorityShort: 'SMPA',
  authorityAlt: 'SMPK',
  title: 'Route Guide',
  descriptor: 'Kolkata Dock Visit',
  summaryLine:
    'ITC Royal Bengal → Netaji Subhas Dock → Century Ports Ltd. → SMPA Head Office',
  prescribedRouteLine:
    'Maa Flyover → Kidderpore Road → C.G.R. Road → NSD → KPD → Hastings → Strand Road',
  /**
   * Official emblem. Place a file in /public and set the path here, e.g.
   * '/smpa-logo.png'. Leave empty to render the neutral placeholder.
   * Do not substitute an unofficial or reconstructed emblem.
   */
  logoSrc: '',
  documentVersion: 'v1.0',
  documentDate: '', // e.g. '24 September 2026' — leave empty to hide
  shareText:
    'Route Guide: ITC Royal Bengal → Netaji Subhas Dock → Century Ports Ltd. → SMPA Head Office',
} as const;

/* ==========================================================================
   VISIT INFORMATION  (optional — empty fields are not displayed)
   ========================================================================== */

export const visitDetails: VisitDetails = {
  date: '',
  reportingTime: '',
  vehicleNo: '',
  coordinator: '',
  contact: '',
};

/* ==========================================================================
   PHASES
   ========================================================================== */

export const phases: Phase[] = [
  {
    id: 'arrival',
    number: 1,
    title: 'Arrival',
    summary: 'ITC Royal Bengal to Gate No. 7, Netaji Subhas Dock',
    authority: 'public-road',
    authorityNote:
      'Public roads. Google Maps navigation may be used along the prescribed route.',
  },
  {
    id: 'port-visit',
    number: 2,
    title: 'Port Visit',
    summary: 'Netaji Subhas Dock and Century Ports Ltd., KPD-I (West)',
    authority: 'smpa-controlled',
    authorityNote:
      'Access-controlled port area. Follow SMPA-designated internal movement instructions. Google Maps navigation does not apply.',
  },
  {
    id: 'departure',
    number: 3,
    title: 'Departure',
    summary: 'Century Ports Ltd. to SMPA Head Office, 15 Strand Road',
    authority: 'public-road',
    authorityNote:
      'Public roads. Google Maps navigation may be used along the prescribed route.',
  },
];

/* ==========================================================================
   PRESCRIBED ROUTE — AUTHORITATIVE SEQUENCE
   --------------------------------------------------------------------------
   The order of this array IS the prescribed route. Do not reorder it to suit
   a faster alternative suggested by any mapping service.
   ========================================================================== */

export const routePoints: RoutePoint[] = [
  {
    id: 1,
    key: 'itc-royal-bengal',
    name: 'ITC Royal Bengal',
    type: 'start',
    phase: 'arrival',
    label: 'Starting Point',
    address: '1 JBS Haldane Avenue, Kolkata',
    instruction: 'Depart from ITC Royal Bengal and proceed towards Maa Flyover.',
    mapsQuery: 'ITC Royal Bengal, 1 JBS Haldane Avenue, Kolkata',
    coordinates: { lat: 22.5397, lng: 88.3936, accuracy: 'approximate' },
    driver: { action: 'Start', primary: 'ITC Royal Bengal' },
  },
  {
    id: null,
    key: 'maa-flyover',
    name: 'Maa Flyover',
    type: 'road',
    phase: 'arrival',
    label: 'Prescribed Road',
    instruction: 'Take Maa Flyover westbound.',
    mapsQuery: 'Maa Flyover, Kolkata',
    coordinates: { lat: 22.5366, lng: 88.3712, accuracy: 'approximate' },
    driver: { action: 'Take', primary: 'Maa Flyover' },
  },
  {
    id: null,
    key: 'kidderpore-road',
    name: 'Kidderpore Road',
    type: 'road',
    phase: 'arrival',
    label: 'Prescribed Road',
    instruction: 'Continue along Kidderpore Road.',
    mapsQuery: 'Kidderpore Road, Kolkata',
    coordinates: { lat: 22.5446, lng: 88.3316, accuracy: 'approximate' },
    driver: { action: 'Continue', primary: 'Kidderpore Road' },
  },
  {
    id: null,
    key: 'cgr-road-inbound',
    name: 'C.G.R. Road',
    type: 'road',
    phase: 'arrival',
    label: 'Prescribed Road',
    instruction: 'Proceed along C.G.R. Road towards Gate No. 7.',
    mapsQuery: 'Circular Garden Reach Road, Kolkata',
    coordinates: { lat: 22.5379, lng: 88.3223, accuracy: 'approximate' },
    driver: { action: 'Continue', primary: 'C.G.R. Road' },
  },
  {
    id: 2,
    key: 'nsd-gate-7',
    name: 'Gate No. 7, Netaji Subhas Dock',
    type: 'gate',
    phase: 'arrival',
    label: 'Entry',
    instruction: 'Enter Netaji Subhas Dock through Gate No. 7.',
    note: 'Present visit authorisation at the gate as instructed by SMPA security personnel.',
    // No mapsQuery: access-controlled gate, not reliably resolvable.
    coordinates: null,
    driver: { action: 'Enter', primary: 'NSD Gate No. 7' },
  },
  {
    id: 3,
    key: 'netaji-subhas-dock',
    name: 'Netaji Subhas Dock',
    type: 'visit',
    phase: 'port-visit',
    label: 'Dock Visit',
    instruction:
      'Proceed with the scheduled dock visit as per the designated internal route.',
    note: 'Follow SMPA-designated internal movement instructions. Internal dock roads are not taken from Google Maps.',
    coordinates: null,
    driver: { action: 'Dock Visit', primary: 'Netaji Subhas Dock' },
  },
  {
    id: 4,
    key: 'nsd-gate-3',
    name: 'Gate No. 3, Netaji Subhas Dock',
    type: 'gate',
    phase: 'port-visit',
    label: 'Exit',
    instruction: 'Exit Netaji Subhas Dock through Gate No. 3.',
    coordinates: null,
    driver: { action: 'Exit', primary: 'NSD Gate No. 3' },
  },
  {
    id: 5,
    key: 'kpd-gate-2',
    name: '2 KPD Gate',
    type: 'gate',
    phase: 'port-visit',
    label: 'Entry',
    instruction: 'Proceed through 2 KPD Gate towards KPD-I (West).',
    coordinates: null,
    driver: { action: 'Enter', primary: '2 KPD Gate' },
  },
  {
    id: 6,
    key: 'century-ports-kpd-1-west',
    name: 'Century Ports Ltd.',
    subtitle: 'KPD-I (West)',
    type: 'visit',
    phase: 'port-visit',
    label: 'Terminal Visit',
    instruction: 'Proceed to Century Ports Ltd. terminal at KPD-I (West).',
    note: 'Navigation link will be enabled once SMPA confirms a reliable destination for this terminal.',
    coordinates: null,
    driver: { action: 'Stop', primary: 'Century Ports Ltd.', secondary: 'KPD-I (West)' },
  },
  {
    id: null,
    key: 'cgr-road-outbound',
    name: 'C.G.R. Road',
    type: 'road',
    phase: 'departure',
    label: 'Prescribed Road',
    instruction: 'On exiting the port area, rejoin C.G.R. Road.',
    mapsQuery: 'Circular Garden Reach Road, Kolkata',
    coordinates: { lat: 22.5379, lng: 88.3223, accuracy: 'approximate' },
    driver: { action: 'Continue', primary: 'C.G.R. Road' },
  },
  {
    id: null,
    key: 'hastings',
    name: 'Hastings',
    type: 'road',
    phase: 'departure',
    label: 'Prescribed Road',
    instruction: 'Continue through Hastings towards Strand Road.',
    mapsQuery: 'Hastings, Kolkata',
    coordinates: { lat: 22.5536, lng: 88.3336, accuracy: 'approximate' },
    driver: { action: 'Continue', primary: 'Hastings' },
  },
  {
    id: 7,
    key: 'smpa-head-office',
    name: 'SMPA Head Office',
    type: 'end',
    phase: 'departure',
    label: 'Final Destination',
    address: '15 Strand Road, Kolkata – 700001',
    instruction: 'Arrive at SMPA Head Office, 15 Strand Road.',
    mapsQuery: 'Syama Prasad Mookerjee Port Kolkata, 15 Strand Road, Kolkata 700001',
    coordinates: { lat: 22.5646, lng: 88.3412, accuracy: 'approximate' },
    driver: { action: 'Final Stop', primary: 'SMPA Head Office', secondary: '15 Strand Road' },
  },
];

/* ==========================================================================
   ROUTE NOTICE
   ========================================================================== */

export const routeNotice = {
  title: 'Route Note',
  body: 'Within the dock area, visitors/drivers should follow the designated route and instructions provided by SMPA officials/security personnel. Google Maps navigation may not accurately reflect internal dock roads or access-controlled gates.',
} as const;

export const coordinatesPlaceholder = 'COORDINATES TO BE CONFIRMED BY SMPA';

/* ==========================================================================
   DERIVED HELPERS
   ========================================================================== */

/** Numbered stops only (road segments excluded). */
export const numberedStops = routePoints.filter(
  (p): p is RoutePoint & { id: number } => p.id !== null,
);

export const pointsByPhase = (phase: PhaseId) =>
  routePoints.filter((p) => p.phase === phase);

/** Hero journey: the four moments a reader must grasp within five seconds. */
export const heroJourney = [
  { label: 'Start', name: 'ITC Royal Bengal', pointKey: 'itc-royal-bengal' },
  { label: 'Dock Visit', name: 'Netaji Subhas Dock', pointKey: 'netaji-subhas-dock' },
  {
    label: 'Terminal Visit',
    name: 'Century Ports Ltd.',
    detail: 'KPD-I (West)',
    pointKey: 'century-ports-kpd-1-west',
  },
  {
    label: 'End',
    name: 'SMPA Head Office',
    detail: '15 Strand Road',
    pointKey: 'smpa-head-office',
  },
] as const;

/** Compact, screenshot-friendly sequence for "Route at a Glance". */
export const routeAtAGlance = [
  { text: 'ITC Royal Bengal', type: 'start' as StopType },
  { text: 'Maa Flyover', type: 'road' as StopType },
  { text: 'Kidderpore Road', type: 'road' as StopType },
  { text: 'C.G.R. Road', type: 'road' as StopType },
  { text: 'Gate 7 — Enter NSD', type: 'gate' as StopType },
  { text: 'Netaji Subhas Dock Visit', type: 'visit' as StopType },
  { text: 'Gate 3 — Exit NSD', type: 'gate' as StopType },
  { text: '2 KPD Gate', type: 'gate' as StopType },
  { text: 'Century Ports — KPD-I (West)', type: 'visit' as StopType },
  { text: 'C.G.R. Road', type: 'road' as StopType },
  { text: 'Hastings', type: 'road' as StopType },
  { text: 'SMPA Head Office', type: 'end' as StopType },
];
