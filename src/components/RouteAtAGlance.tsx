import { routeAtAGlance } from '../config/routeConfig';
import { Card, SectionHeading, typeStyles } from './ui';

/**
 * A compact, screenshot-friendly summary. Deliberately plain: this block is
 * what gets photographed and forwarded on WhatsApp.
 */
export function RouteAtAGlance() {
  return (
    <section id="route" aria-labelledby="glance-title" className="scroll-mt-20">
      <SectionHeading
        id="glance-title"
        eyebrow="Summary"
        title="Route at a Glance"
        description="The prescribed sequence, in order. Screenshot-friendly."
      />
      <Card className="px-4 py-4 sm:px-6 sm:py-5">
        <ol className="space-y-0">
          {routeAtAGlance.map((step, index) => {
            const last = index === routeAtAGlance.length - 1;
            return (
              <li key={`${step.text}-${index}`} className="flex gap-3">
                <div className="flex w-3 shrink-0 flex-col items-center pt-2">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      step.type === 'road' ? 'bg-rule ring-1 ring-port/40' : typeStyles(step.type).rail
                    }`}
                  />
                  {!last && <span aria-hidden="true" className="w-px flex-1 bg-rule" />}
                </div>
                <p
                  className={`py-1 text-[15px] leading-snug ${
                    step.type === 'road'
                      ? 'text-slate-ink'
                      : 'font-semibold text-navy'
                  }`}
                >
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </Card>
    </section>
  );
}
