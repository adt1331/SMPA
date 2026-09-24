import { site } from '../config/routeConfig';

export function SiteFooter() {
  return (
    <footer className="screen-only mt-10 border-t border-navy-700 bg-navy px-4 py-7 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-[15px] font-semibold tracking-tight">{site.authority}</p>
        <p className="eyebrow mt-1 text-white/60">
          {site.title} · {site.descriptor}
        </p>
        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/70">
          This guide reproduces the prescribed movement sequence for the visit. It is a movement
          aid, not a substitute for instructions issued by SMPA officials or port security
          personnel.
        </p>
        <p className="eyebrow mt-4 text-white/45">
          Route document {site.documentVersion}
          {site.documentDate ? ` · ${site.documentDate}` : ''}
        </p>
      </div>
    </footer>
  );
}
