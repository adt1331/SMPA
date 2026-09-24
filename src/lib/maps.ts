/**
 * Google Maps deep links.
 *
 * Built with the official Google Maps URLs API
 * (https://developers.google.com/maps/documentation/urls/get-started) rather
 * than copied search-result URLs, so the links are stable and portable.
 *
 * Links are built from PLACE-NAME QUERIES, never from the approximate
 * coordinates held in routeConfig — Google resolves them against its own
 * database. Locations without a `mapsQuery` (port gates, terminal berths)
 * intentionally produce no link.
 */

import { routePoints, type RoutePoint } from '../config/routeConfig';

const MAPS_BASE = 'https://www.google.com/maps';

/** Open a single place in Google Maps. */
export function placeUrl(query: string): string {
  return `${MAPS_BASE}/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Directions along an explicit corridor.
 *
 * Every intermediate road is passed as a waypoint so Google Maps routes
 * THROUGH the prescribed corridor instead of substituting a faster
 * alternative. The consumer Maps URL API accepts up to 9 waypoints.
 */
export function directionsUrl(
  origin: string,
  destination: string,
  waypoints: string[] = [],
  opts: { navigate?: boolean } = {},
): string {
  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'driving',
  });
  if (waypoints.length > 0) {
    params.set('waypoints', waypoints.slice(0, 9).join('|'));
  }
  if (opts.navigate) {
    params.set('dir_action', 'navigate');
  }
  // `|` is a legal waypoint separator and is clearer left unencoded.
  return `${MAPS_BASE}/dir/?${params.toString().replace(/%7C/g, '|')}`;
}

/** A point is navigable only when a reliable Google Maps query is configured. */
export function isNavigable(point: RoutePoint): point is RoutePoint & { mapsQuery: string } {
  return typeof point.mapsQuery === 'string' && point.mapsQuery.length > 0;
}

function queryFor(key: string): string | undefined {
  return routePoints.find((p) => p.key === key)?.mapsQuery;
}

function corridor(keys: string[]): string[] {
  return keys.map(queryFor).filter((q): q is string => Boolean(q));
}

/**
 * The full prescribed public-road corridor, start to finish.
 *
 * Internal port gates and berths are deliberately absent — they are not
 * publicly routable and are governed by SMPA instructions, not by Google Maps.
 */
export function fullRouteUrl(opts: { navigate?: boolean } = {}): string {
  const stops = corridor([
    'itc-royal-bengal',
    'maa-flyover',
    'kidderpore-road',
    'cgr-road-inbound',
    'hastings',
    'smpa-head-office',
  ]);
  const origin = stops[0];
  const destination = stops[stops.length - 1];
  return directionsUrl(origin, destination, stops.slice(1, -1), opts);
}

/** Phase 1 — arrival leg, up to the public-road approach to Gate No. 7. */
export function arrivalLegUrl(opts: { navigate?: boolean } = {}): string {
  const stops = corridor([
    'itc-royal-bengal',
    'maa-flyover',
    'kidderpore-road',
    'cgr-road-inbound',
  ]);
  return directionsUrl(stops[0], stops[stops.length - 1], stops.slice(1, -1), opts);
}

/** Phase 3 — departure leg, from the public road back to Strand Road. */
export function departureLegUrl(opts: { navigate?: boolean } = {}): string {
  const stops = corridor(['cgr-road-outbound', 'hastings', 'smpa-head-office']);
  return directionsUrl(stops[0], stops[stops.length - 1], stops.slice(1, -1), opts);
}
