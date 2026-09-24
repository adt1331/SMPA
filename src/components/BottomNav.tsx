import { List, Map as MapIcon, Route as RouteIcon, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '#route', label: 'Route', icon: RouteIcon },
  { href: '#map', label: 'Map', icon: MapIcon },
  { href: '#stops', label: 'Stops', icon: List },
];

export function BottomNav({ onDriverView }: { onDriverView: () => void }) {
  return (
    <nav
      aria-label="Route sections"
      className="bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-white/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-5xl grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-slate-ink transition-colors hover:text-port"
            >
              <item.icon size={19} strokeWidth={2} aria-hidden="true" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={onDriverView}
            className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 text-slate-ink transition-colors hover:text-port"
          >
            <Truck size={19} strokeWidth={2} aria-hidden="true" />
            <span className="text-[11px] font-medium">Driver View</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
