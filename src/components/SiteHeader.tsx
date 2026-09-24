import { Anchor, Printer } from 'lucide-react';
import { site } from '../config/routeConfig';

/** Neutral placeholder. No SMPA or Government emblem is reproduced here. */
function LogoPlaceholder() {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-dashed border-white/40 bg-white/5"
      role="img"
      aria-label="Official logo placeholder — official emblem to be supplied by SMPA"
      title="Official logo to be supplied by SMPA"
    >
      <Anchor size={18} strokeWidth={1.75} className="text-white/70" aria-hidden="true" />
    </span>
  );
}

export function SiteHeader({
  view,
  onViewChange,
}: {
  view: 'standard' | 'driver';
  onViewChange: (v: 'standard' | 'driver') => void;
}) {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-navy-700 bg-navy text-white">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        {site.logoSrc ? (
          <img
            src={site.logoSrc}
            alt={`${site.authority} official emblem`}
            className="h-10 w-10 shrink-0 object-contain"
          />
        ) : (
          <LogoPlaceholder />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight sm:text-sm">
            {site.authority}
          </p>
          <p className="eyebrow truncate text-white/60">{site.descriptor}</p>
        </div>

        <div
          className="view-toggle flex shrink-0 rounded-md border border-white/20 p-0.5"
          role="group"
          aria-label="Display mode"
        >
          <button
            type="button"
            onClick={() => onViewChange('standard')}
            aria-pressed={view === 'standard'}
            className={`min-h-11 rounded-sm px-3 text-xs font-medium transition-colors ${
              view === 'standard' ? 'bg-white text-navy' : 'text-white/75 hover:text-white'
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => onViewChange('driver')}
            aria-pressed={view === 'driver'}
            className={`min-h-11 rounded-sm px-3 text-xs font-medium transition-colors ${
              view === 'driver' ? 'bg-white text-navy' : 'text-white/75 hover:text-white'
            }`}
          >
            Driver
          </button>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          aria-label="Print route sheet"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 text-white/75 transition-colors hover:text-white sm:flex"
        >
          <Printer size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
