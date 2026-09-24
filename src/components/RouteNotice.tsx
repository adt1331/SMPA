import { Info } from 'lucide-react';
import { routeNotice } from '../config/routeConfig';

export function RouteNotice() {
  return (
    <section aria-labelledby="route-note-title">
      <div className="rounded-lg border-l-4 border-l-port border-y border-r border-rule bg-white px-4 py-4 sm:px-5">
        <h2
          id="route-note-title"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-navy"
        >
          <Info size={16} strokeWidth={2} className="text-port" aria-hidden="true" />
          {routeNotice.title}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-ink">{routeNotice.body}</p>
      </div>
    </section>
  );
}
