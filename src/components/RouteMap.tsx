import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Info, Navigation } from 'lucide-react';
import {
  coordinatesPlaceholder,
  routePoints,
  type RoutePoint,
} from '../config/routeConfig';
import { fullRouteUrl } from '../lib/maps';
import { ActionLink, Card, SectionHeading, StopNumber, iconForPoint } from './ui';

/**
 * Illustrative route map.
 *
 * Google Maps JavaScript API is NOT used: no API key is configured for this
 * deployment. Leaflet + OpenStreetMap renders the indicative corridor, while
 * every navigation action remains a Google Maps deep link.
 *
 * Only points with coordinates are plotted, and all plotted points are
 * approximate. Access-controlled gates and terminal berths are listed beneath
 * the map instead of being drawn at a guessed position.
 */

type Plotted = RoutePoint & { coordinates: NonNullable<RoutePoint['coordinates']> };

const plotted = routePoints.filter((p): p is Plotted => p.coordinates !== null);
const unplotted = routePoints.filter((p) => p.coordinates === null);
const confirmed = plotted.filter((p) => p.coordinates.accuracy === 'confirmed');

const latLngOf = (p: Plotted): [number, number] => [p.coordinates.lat, p.coordinates.lng];

/** Every plotted point, for fitting the viewport. */
const allLatLngs: [number, number][] = plotted.map(latLngOf);

/**
 * A leg is INTERNAL when both of its endpoints sit inside the controlled port
 * area. Those legs are drawn dashed and are never presented as a routed road —
 * movement between them follows SMPA instructions, not a mapping service.
 */
const isPortLocation = (p: Plotted) => p.type === 'gate' || p.type === 'visit';

type Leg = { path: [number, number][]; internal: boolean };

const legs: Leg[] = plotted.slice(0, -1).reduce<Leg[]>((acc, point, index) => {
  const next = plotted[index + 1];
  const from = latLngOf(point);
  const to = latLngOf(next);
  // Garden Reach Road appears twice with identical coordinates; skip the zero-length leg.
  if (from[0] === to[0] && from[1] === to[1]) return acc;

  const internal = isPortLocation(point) && isPortLocation(next);
  const last = acc[acc.length - 1];
  if (last && last.internal === internal) {
    last.path.push(to);
  } else {
    acc.push({ path: [from, to], internal });
  }
  return acc;
}, []);

function markerClass(point: Plotted): string {
  if (point.type === 'road') return 'marker-pin marker-pin--road';
  if (point.type === 'gate') return 'marker-pin marker-pin--gate';
  if (point.type === 'visit') return 'marker-pin marker-pin--visit';
  return `marker-pin marker-pin--${point.type === 'end' ? 'end' : 'start'}`;
}

function popupHtml(point: Plotted): string {
  const number = point.id === null ? '' : `${String(point.id).padStart(2, '0')} — `;
  const escape = (value: string) =>
    value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  return [
    `<p style="margin:0;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#165d82;font-weight:600">${escape(point.label)}</p>`,
    `<p style="margin:2px 0 0;font-size:14px;font-weight:600;color:#0b2942">${escape(number + point.name)}</p>`,
    point.subtitle
      ? `<p style="margin:0;font-size:12px;color:#52616b">${escape(point.subtitle)}</p>`
      : '',
    point.coordinates.accuracy === 'confirmed'
      ? `<p style="margin:4px 0 0;font-size:11px;color:#165d82;font-weight:600">Coordinates confirmed by SMPA</p>`
      : `<p style="margin:4px 0 0;font-size:11px;color:#52616b">Approximate position — indicative only</p>`,
  ].join('');
}

export function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || mapRef.current) return;

    let map: L.Map;
    try {
      map = L.map(node, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      className: 'route-map-tiles',
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Prescribed corridor. Solid on public roads; dashed inside the port area,
    // where no routed path is claimed.
    legs.forEach((leg) => {
      L.polyline(leg.path, {
        color: '#ffffff',
        weight: 7,
        opacity: 0.9,
        lineJoin: 'round',
      }).addTo(map);
      L.polyline(leg.path, {
        color: leg.internal ? '#8a5a00' : '#165d82',
        weight: 3,
        opacity: 1,
        lineJoin: 'round',
        dashArray: leg.internal ? '5 6' : undefined,
      }).addTo(map);
    });

    plotted.forEach((point) => {
      const size = point.type === 'road' ? 12 : 30;
      const icon = L.divIcon({
        className: '',
        html: `<span class="${markerClass(point)}">${
          point.id === null ? '' : String(point.id).padStart(2, '0')
        }</span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      L.marker([point.coordinates.lat, point.coordinates.lng], {
        icon,
        alt: `${point.label}: ${point.name}`,
        keyboard: true,
      })
        .addTo(map)
        .bindPopup(popupHtml(point), { closeButton: true });
    });

    map.fitBounds(L.latLngBounds(allLatLngs), { padding: [36, 36] });

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(node);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section id="map" aria-labelledby="map-title" className="scroll-mt-20">
      <SectionHeading
        id="map-title"
        eyebrow="Orientation"
        title="Interactive Route Map"
        description="Indicative corridor for orientation. Use the Google Maps links for turn-by-turn navigation on public roads."
      />

      <Card className="overflow-hidden">
        {failed ? (
          <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-slate-ink">
            The map could not be loaded. The written route below remains complete and usable.
          </div>
        ) : (
          <div
            ref={containerRef}
            role="application"
            aria-label="Map showing the prescribed route corridor from ITC Royal Bengal to SMPA Head Office"
            className="h-[320px] w-full sm:h-[440px] lg:h-[500px]"
          />
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule px-4 py-3">
          {[
            { label: 'Start', dot: 'bg-navy' },
            { label: 'Road', dot: 'bg-white ring-2 ring-port' },
            { label: 'Gate', dot: 'bg-amber-700' },
            { label: 'Visit', dot: 'bg-port' },
            { label: 'End', dot: 'bg-navy' },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
              <span className="eyebrow text-slate-ink">{item.label}</span>
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-5 bg-port" />
            <span className="eyebrow text-slate-ink">Public road</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-0 w-5 border-t-2 border-dashed border-amber-700"
            />
            <span className="eyebrow text-slate-ink">Inside port — per SMPA</span>
          </span>
        </div>
      </Card>

      {/* Provenance: what SMPA has confirmed, and what is still outstanding. */}
      <Card className="mt-3 px-4 py-4 sm:px-5">
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-ink">
          <Info size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-port" aria-hidden="true" />
          <span>
            The dashed leg inside the port area is drawn only to connect the two confirmed points.
            It is not a routed road — movement inside the dock follows the SMPA-designated
            sequence set out under stop 03.
          </span>
        </p>

        {confirmed.length > 0 && (
          <>
            <p className="eyebrow mt-4 text-port">Coordinates confirmed by SMPA</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {confirmed.map((point) => {
                const Icon = iconForPoint(point);
                return (
                  <li
                    key={point.key}
                    className="flex items-center gap-2.5 rounded-md border border-port-100 bg-port-50 px-3 py-2.5"
                  >
                    <StopNumber number={point.id} type={point.type} size="sm" />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <Icon size={12} strokeWidth={2} className="text-port" aria-hidden="true" />
                        <span className="truncate text-[14px] font-medium text-navy">
                          {point.name}
                        </span>
                      </span>
                      <span className="block font-mono text-[11px] tabular-nums text-slate-ink">
                        {point.coordinates!.lat.toFixed(6)}, {point.coordinates!.lng.toFixed(6)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {unplotted.length > 0 && (
          <>
            <p className="eyebrow mt-4 text-slate-ink">Not plotted — awaiting SMPA</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {unplotted.map((point) => {
                const Icon = iconForPoint(point);
                return (
                  <li
                    key={point.key}
                    className="flex items-center gap-2.5 rounded-md border border-dashed border-rule bg-offwhite px-3 py-2.5"
                  >
                    <StopNumber number={point.id} type={point.type} size="sm" />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <Icon size={12} strokeWidth={2} className="text-slate-ink" aria-hidden="true" />
                        <span className="truncate text-[14px] font-medium text-navy">
                          {point.name}
                        </span>
                      </span>
                      <span className="eyebrow block text-slate-ink">{coordinatesPlaceholder}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>

      <div className="action-bar mt-3">
        <ActionLink href={fullRouteUrl()} icon={Navigation} variant="primary">
          Open prescribed route in Google Maps
        </ActionLink>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-ink">
          Routes over public roads only, through the two SMPA-confirmed points. It does not
          reproduce movement inside the dock — follow the sequence given at stop 03.
        </p>
      </div>
    </section>
  );
}
