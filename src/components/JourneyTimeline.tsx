import { Lock, MapPin, Navigation, ShieldAlert } from 'lucide-react';
import {
  coordinatesPlaceholder,
  phases,
  pointsByPhase,
  type Phase,
  type RoutePoint,
} from '../config/routeConfig';
import { arrivalLegUrl, departureLegUrl, isNavigable, placeUrl } from '../lib/maps';
import {
  ActionLink,
  Card,
  SectionHeading,
  StatusLabel,
  StopNumber,
  iconForPoint,
  typeStyles,
} from './ui';

function PhaseHeader({ phase }: { phase: Phase }) {
  const controlled = phase.authority === 'smpa-controlled';
  const legUrl =
    phase.id === 'arrival' ? arrivalLegUrl() : phase.id === 'departure' ? departureLegUrl() : null;

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="eyebrow text-port">Phase {phase.number}</span>
        <h3 className="text-lg font-semibold tracking-tight text-navy">{phase.title}</h3>
      </div>
      <p className="mt-0.5 text-[13px] text-slate-ink">{phase.summary}</p>

      <p
        className={`mt-2.5 flex items-start gap-2 rounded-md border px-3 py-2 text-[13px] leading-relaxed ${
          controlled
            ? 'border-amber-200 bg-amber-50 text-amber-900'
            : 'border-rule bg-offwhite text-slate-ink'
        }`}
      >
        {controlled ? (
          <Lock size={14} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
        ) : (
          <Navigation size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-port" aria-hidden="true" />
        )}
        <span>{phase.authorityNote}</span>
      </p>

      {legUrl && (
        <div className="action-bar mt-2.5">
          <ActionLink href={legUrl} icon={Navigation}>
            Navigate Phase {phase.number}
          </ActionLink>
        </div>
      )}
    </div>
  );
}

function RoadStep({ point }: { point: RoutePoint }) {
  return (
    <li className="relative flex gap-3 sm:gap-4">
      <div className="flex w-9 shrink-0 flex-col items-center">
        <StopNumber number={null} type="road" />
        <span aria-hidden="true" className="w-px flex-1 bg-rule" />
      </div>
      <div className="min-w-0 flex-1 pb-4 pt-1">
        <p className="text-[15px] font-medium text-slate-ink">{point.name}</p>
        {point.instruction && (
          <p className="mt-0.5 text-[13px] leading-relaxed text-slate-ink/85">
            {point.instruction}
          </p>
        )}
      </div>
    </li>
  );
}

function StopStep({ point, last }: { point: RoutePoint; last: boolean }) {
  const Icon = iconForPoint(point);
  const navigable = isNavigable(point);

  return (
    <li id={`stop-${point.key}`} className="relative flex scroll-mt-20 gap-3 sm:gap-4">
      <div className="flex w-9 shrink-0 flex-col items-center">
        <StopNumber number={point.id} type={point.type} />
        {!last && <span aria-hidden="true" className={`w-px flex-1 ${typeStyles(point.type).rail} opacity-30`} />}
      </div>

      <Card className="mb-4 min-w-0 flex-1 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusLabel type={point.type}>{point.label}</StatusLabel>
        </div>

        <h4 className="mt-2 flex items-start gap-2 text-[17px] font-semibold leading-snug tracking-tight text-navy">
          <Icon size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-port" aria-hidden="true" />
          <span>
            {point.name}
            {point.subtitle && (
              <span className="block text-[14px] font-medium text-slate-ink">{point.subtitle}</span>
            )}
          </span>
        </h4>

        {point.address && (
          <p className="mt-2 flex items-start gap-1.5 text-[14px] leading-relaxed text-slate-ink">
            <MapPin size={14} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{point.address}</span>
          </p>
        )}

        {point.instruction && (
          <p className="mt-2.5 text-[14px] leading-relaxed text-navy/85">{point.instruction}</p>
        )}

        {point.note && (
          <p className="mt-2.5 flex items-start gap-2 rounded-md border border-rule bg-offwhite px-3 py-2 text-[13px] leading-relaxed text-slate-ink">
            <ShieldAlert size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-port" aria-hidden="true" />
            <span>{point.note}</span>
          </p>
        )}

        {navigable ? (
          <div className="action-bar mt-3 flex flex-wrap gap-2">
            <ActionLink href={placeUrl(point.mapsQuery)} icon={Navigation}>
              Open in Google Maps
            </ActionLink>
          </div>
        ) : (
          <p className="eyebrow mt-3 inline-flex items-center gap-1.5 rounded-sm border border-dashed border-slate-ink/40 bg-offwhite px-2 py-1.5 text-slate-ink">
            {coordinatesPlaceholder}
          </p>
        )}
      </Card>
    </li>
  );
}

export function JourneyTimeline() {
  return (
    <section id="stops" aria-labelledby="journey-title" className="scroll-mt-20">
      <SectionHeading
        id="journey-title"
        eyebrow="Movement Plan"
        title="Your Journey"
        description="Three phases. Public-road navigation applies to Phases 1 and 3; movement inside the port area follows SMPA instructions."
      />

      <div className="space-y-8">
        {phases.map((phase) => {
          const points = pointsByPhase(phase.id);
          return (
            <div key={phase.id}>
              <PhaseHeader phase={phase} />
              <ol className="mt-4">
                {points.map((point, index) =>
                  point.type === 'road' ? (
                    <RoadStep key={point.key} point={point} />
                  ) : (
                    <StopStep
                      key={point.key}
                      point={point}
                      last={phase.id === 'departure' && index === points.length - 1}
                    />
                  ),
                )}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
