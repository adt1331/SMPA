import { CalendarDays, ChevronDown, Clock, Car, User, Phone } from 'lucide-react';
import { visitDetails } from '../config/routeConfig';
import { SectionHeading } from './ui';

const FIELDS = [
  { key: 'date', label: 'Date', icon: CalendarDays },
  { key: 'reportingTime', label: 'Reporting Time', icon: Clock },
  { key: 'vehicleNo', label: 'Vehicle No.', icon: Car },
  { key: 'coordinator', label: 'Coordinator', icon: User },
  { key: 'contact', label: 'Contact', icon: Phone },
] as const;

/** Renders nothing at all when no visit details have been configured. */
export function VisitInformation() {
  const populated = FIELDS.filter(({ key }) => visitDetails[key].trim().length > 0);
  if (populated.length === 0) return null;

  return (
    <section aria-labelledby="visit-info-title">
      <SectionHeading id="visit-info-title" eyebrow="Reference" title="Visit Information" />
      <details className="card group rounded-lg border border-rule bg-white shadow-card" open>
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium text-navy sm:px-5">
          Visit details
          <ChevronDown
            size={17}
            strokeWidth={2}
            aria-hidden="true"
            className="shrink-0 text-slate-ink transition-transform group-open:rotate-180"
          />
        </summary>
        <dl className="grid gap-px border-t border-rule bg-rule sm:grid-cols-2">
          {populated.map(({ key, label, icon: Icon }) => (
            <div key={key} className="bg-white px-4 py-3 sm:px-5">
              <dt className="eyebrow flex items-center gap-1.5 text-slate-ink">
                <Icon size={12} strokeWidth={2} aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-navy">{visitDetails[key]}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
