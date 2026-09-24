import { ChevronRight, Map as MapIcon, Navigation, Share2 } from 'lucide-react';
import { heroJourney, routePoints, site } from '../config/routeConfig';
import { fullRouteUrl } from '../lib/maps';
import { ActionButton, ActionLink, iconForPoint } from './ui';

export function Hero({ onShare }: { onShare: () => void }) {
  return (
    <section
      aria-labelledby="route-guide-title"
      className="screen-only border-b border-rule bg-white px-4 pb-6 pt-7 sm:pt-9"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-port">{site.authority}</p>
        <h1
          id="route-guide-title"
          className="mt-1.5 text-3xl font-semibold tracking-tight text-navy sm:text-4xl"
        >
          {site.title}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-ink">
          {site.summaryLine}
        </p>

        {/* Hero journey — start, dock, terminal, end, readable at a glance. */}
        <ol className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {heroJourney.map((leg, index) => {
            const point = routePoints.find((p) => p.key === leg.pointKey)!;
            const Icon = iconForPoint(point);
            const last = index === heroJourney.length - 1;
            return (
              <li key={leg.pointKey} className="relative flex items-stretch">
                <a
                  href={`#stop-${point.key}`}
                  className="flex min-h-11 w-full flex-col justify-center rounded-md border border-rule bg-offwhite px-3.5 py-3 transition-colors hover:border-port lg:rounded-none lg:border-y lg:border-l lg:border-r-0 lg:bg-white"
                >
                  <span className="flex items-center gap-1.5">
                    <Icon size={13} strokeWidth={2} className="text-port" aria-hidden="true" />
                    <span className="eyebrow text-port">{leg.label}</span>
                  </span>
                  <span className="mt-1 text-[15px] font-semibold leading-snug text-navy">
                    {leg.name}
                  </span>
                  {'detail' in leg && leg.detail && (
                    <span className="text-[13px] leading-snug text-slate-ink">{leg.detail}</span>
                  )}
                </a>
                {!last && (
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white text-slate-ink lg:block"
                  />
                )}
                {last && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 hidden border-r border-rule lg:block"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-5 rounded-md border border-rule bg-offwhite px-3.5 py-3 text-[13px] leading-relaxed text-slate-ink">
          <span className="eyebrow mr-1.5 text-navy">Prescribed Route</span>
          {site.prescribedRouteLine}
        </p>

        <div className="action-bar mt-5 flex flex-wrap gap-2">
          <ActionLink href="#route-map" icon={MapIcon} variant="primary">
            View Route
          </ActionLink>
          <ActionLink href={fullRouteUrl()} icon={Navigation}>
            Open in Google Maps
          </ActionLink>
          <ActionButton onClick={onShare} icon={Share2}>
            Share Route
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
