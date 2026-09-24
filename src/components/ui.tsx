import type { ReactNode } from 'react';
import {
  Anchor,
  Building2,
  Container,
  DoorClosed,
  Hotel,
  Route as RouteIcon,
  type LucideIcon,
} from 'lucide-react';
import type { RoutePoint, StopType } from '../config/routeConfig';

/* --------------------------------------------------------------------------
   Iconography — one professional icon per category of location.
   -------------------------------------------------------------------------- */

export function iconForPoint(point: RoutePoint): LucideIcon {
  if (point.key === 'century-ports-kpd-1-west') return Container; // terminal/crane
  switch (point.type) {
    case 'start':
      return Hotel;
    case 'road':
      return RouteIcon;
    case 'gate':
      return DoorClosed;
    case 'visit':
      return Anchor;
    case 'end':
      return Building2;
  }
}

/* --------------------------------------------------------------------------
   Category styling
   -------------------------------------------------------------------------- */

const TYPE_STYLES: Record<StopType, { chip: string; marker: string; rail: string }> = {
  start: {
    chip: 'bg-navy text-white',
    marker: 'bg-navy text-white border-navy',
    rail: 'bg-navy',
  },
  road: {
    chip: 'bg-port-50 text-port border border-port-100',
    marker: 'bg-white text-port border-port',
    rail: 'bg-rule',
  },
  gate: {
    chip: 'bg-amber-50 text-amber-900 border border-amber-200',
    marker: 'bg-amber-700 text-white border-amber-700',
    rail: 'bg-amber-600',
  },
  visit: {
    chip: 'bg-port-50 text-port border border-port-100',
    marker: 'bg-port text-white border-port',
    rail: 'bg-port',
  },
  end: {
    chip: 'bg-navy text-white',
    marker: 'bg-navy text-white border-navy',
    rail: 'bg-navy',
  },
};

export const typeStyles = (type: StopType) => TYPE_STYLES[type];

/* --------------------------------------------------------------------------
   Primitives
   -------------------------------------------------------------------------- */

export function Card({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`card rounded-lg border border-rule bg-white shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="mb-4">
      {eyebrow && <p className="eyebrow text-port mb-1.5">{eyebrow}</p>}
      <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-tight text-navy">
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 text-sm leading-relaxed text-slate-ink">{description}</p>
      )}
    </div>
  );
}

export function StatusLabel({ children, type }: { children: ReactNode; type: StopType }) {
  return (
    <span
      className={`eyebrow inline-flex items-center rounded-sm px-2 py-0.5 ${typeStyles(type).chip}`}
    >
      {children}
    </span>
  );
}

/** Numbered circular route marker. */
export function StopNumber({
  number,
  type,
  size = 'md',
}: {
  number: number | null;
  type: StopType;
  size?: 'sm' | 'md';
}) {
  const dimension = size === 'sm' ? 'h-7 w-7 text-[11px]' : 'h-9 w-9 text-[13px]';
  if (number === null) {
    return (
      <span
        aria-hidden="true"
        className={`flex ${dimension} shrink-0 items-center justify-center rounded-full border-2 border-rule bg-white`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-port" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full border-2 font-semibold tabular-nums ${typeStyles(type).marker}`}
    >
      {String(number).padStart(2, '0')}
    </span>
  );
}

/* --------------------------------------------------------------------------
   Buttons — 44px minimum touch target throughout.
   -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-white border-navy hover:bg-navy-700',
  secondary: 'bg-white text-navy border-rule hover:border-port hover:text-port',
  ghost: 'bg-transparent text-port border-transparent hover:bg-port-50',
};

const BUTTON_BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export function ActionButton({
  children,
  icon: Icon,
  variant = 'secondary',
  className = '',
  ...rest
}: {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${BUTTON_BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ActionLink({
  children,
  icon: Icon,
  variant = 'secondary',
  className = '',
  href,
  ...rest
}: {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className={`${BUTTON_BASE} ${VARIANTS[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
      {children}
    </a>
  );
}

/** Rendered where SMPA must supply a confirmed coordinate. */
export function UnconfirmedCoordinate({ label }: { label: string }) {
  return (
    <p className="eyebrow mt-2 inline-flex items-center gap-1.5 rounded-sm border border-dashed border-slate-ink/40 bg-offwhite px-2 py-1 text-slate-ink">
      {label}
    </p>
  );
}
