import { ArrowDown, Navigation, X } from 'lucide-react';
import { routePoints, site } from '../config/routeConfig';
import { fullRouteUrl } from '../lib/maps';
import { ActionLink } from './ui';

/**
 * Driver View — one job: be readable at arm's length, held up to a driver.
 * Very large type, maximum contrast, no decoration, no navigation chrome.
 */
export function DriverView({ onExit }: { onExit: () => void }) {
  return (
    <div className="min-h-dvh bg-white">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b-2 border-navy bg-navy px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="eyebrow text-white/70">Driver View</p>
          <p className="truncate text-sm font-semibold">{site.authority}</p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-white/30 px-3 text-sm font-medium"
        >
          <X size={16} strokeWidth={2.5} aria-hidden="true" />
          Exit
        </button>
      </div>

      <ol className="mx-auto max-w-2xl px-4 py-5">
        {routePoints.map((point, index) => {
          const last = index === routePoints.length - 1;
          const emphasis = point.type !== 'road';
          return (
            <li key={point.key}>
              <div
                className={
                  emphasis
                    ? 'rounded-lg border-2 border-navy px-4 py-4'
                    : 'rounded-lg border-2 border-rule px-4 py-3'
                }
              >
                <p
                  className={`text-sm font-bold uppercase tracking-[0.14em] ${
                    emphasis ? 'text-port' : 'text-slate-ink'
                  }`}
                >
                  {point.driver.action}
                </p>
                <p
                  className={`mt-1 font-bold leading-[1.15] tracking-tight text-navy ${
                    emphasis ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
                  }`}
                >
                  {point.driver.primary}
                </p>
                {point.driver.secondary && (
                  <p className="mt-1 text-xl font-semibold leading-tight text-slate-ink sm:text-2xl">
                    {point.driver.secondary}
                  </p>
                )}
                {point.internalMovement && (
                  <div className="mt-3 border-t-2 border-rule pt-3">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-800">
                      {point.internalMovement.title} — follow SMPA
                    </p>
                    <ol className="mt-2 space-y-1.5">
                      {point.internalMovement.steps.map((step, stepIndex) => (
                        <li key={step} className="flex gap-2.5 text-lg font-semibold leading-snug text-navy sm:text-xl">
                          <span aria-hidden="true" className="w-6 shrink-0 tabular-nums text-slate-ink">
                            {stepIndex + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
              {!last && (
                <div className="flex justify-center py-1.5" aria-hidden="true">
                  <ArrowDown size={26} strokeWidth={2.5} className="text-navy/40" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mx-auto max-w-2xl px-4 pb-10">
        <p className="rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3 text-base font-semibold leading-snug text-amber-900">
          Inside the dock area, follow SMPA officials and security personnel. Do not follow Google
          Maps inside the port.
        </p>
        <ActionLink
          href={fullRouteUrl({ navigate: true })}
          icon={Navigation}
          variant="primary"
          className="mt-3 w-full text-base"
        >
          Start Navigation
        </ActionLink>
      </div>
    </div>
  );
}
