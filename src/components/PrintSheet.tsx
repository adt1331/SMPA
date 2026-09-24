import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  coordinatesPlaceholder,
  routeAtAGlance,
  routeNotice,
  routePoints,
  site,
  visitDetails,
} from '../config/routeConfig';
import { isNavigable } from '../lib/maps';
import { useShareUrl } from './ShareAndQR';

/**
 * The printed route sheet is authored separately from the screen layout.
 * Printing the web page verbatim runs to four pages; this composes the same
 * configuration into a two-page A4 document. Screen sections carry
 * `.screen-only` and are suppressed by the print stylesheet.
 */

/** Masthead + route summary + the glance list. Prints above the map. */
export function PrintSheetTop() {
  const { url, configured } = useShareUrl();
  const fields = [
    ['Date', visitDetails.date],
    ['Reporting Time', visitDetails.reportingTime],
    ['Vehicle No.', visitDetails.vehicleNo],
    ['Coordinator', visitDetails.coordinator],
    ['Contact', visitDetails.contact],
  ].filter(([, value]) => value.trim().length > 0);

  return (
    <div className="print-only print-top">
      <div className="flex items-start justify-between gap-4 border-b-2 border-navy pb-2">
        <div>
          <p className="eyebrow">{site.authority}</p>
          <p className="text-[19px] font-semibold leading-tight tracking-tight">
            {site.title} — {site.descriptor}
          </p>
          <p className="mt-0.5 text-[11px]">{site.summaryLine}</p>
        </div>
        <p className="eyebrow shrink-0 text-right leading-relaxed">
          {site.documentVersion}
          {site.documentDate ? <><br />{site.documentDate}</> : null}
        </p>
      </div>

      {fields.length > 0 && (
        <table className="mt-2 w-full border-collapse text-[10.5px]">
          <tbody>
            <tr>
              {fields.map(([label, value]) => (
                <td key={label} className="border border-rule px-2 py-1 align-top">
                  <span className="eyebrow block">{label}</span>
                  <span className="font-medium">{value}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <p className="eyebrow border-b border-navy pb-1">Route at a Glance</p>
        <ol className="mt-1.5 columns-2 gap-6 text-[11px] leading-[1.5]">
          {routeAtAGlance.map((step, index) => (
            <li key={`${step.text}-${index}`} className="break-inside-avoid">
              <span className="inline-block w-5 tabular-nums text-[10px] text-slate-ink">
                {index + 1}.
              </span>
              <span className={step.type === 'road' ? '' : 'font-semibold'}>{step.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {!configured && (
        <p className="mt-2 text-[9px] text-slate-ink">Published at: {url}</p>
      )}
    </div>
  );
}

/** Numbered stops, gate instructions, route note and QR. Prints below the map. */
export function PrintSheetBottom() {
  const { url } = useShareUrl();
  const [qr, setQr] = useState('');

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    QRCode.toDataURL(url, { margin: 0, width: 240, color: { dark: '#000000', light: '#ffffff' } })
      .then((d) => !cancelled && setQr(d))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [url]);

  const stops = routePoints.filter((p) => p.type !== 'road');

  return (
    <div className="print-only print-bottom">
      <p className="eyebrow mt-3 border-b border-navy pb-1">Numbered Stops &amp; Gate Instructions</p>
      <table className="mt-1.5 w-full border-collapse text-left text-[10px] leading-snug">
        <thead>
          <tr>
            <th scope="col" className="w-8 border-b border-navy py-1 pr-1 font-semibold">No.</th>
            <th scope="col" className="w-20 border-b border-navy py-1 pr-2 font-semibold">Status</th>
            <th scope="col" className="w-48 border-b border-navy py-1 pr-2 font-semibold">Location</th>
            <th scope="col" className="border-b border-navy py-1 font-semibold">Instruction</th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop) => (
            <tr key={stop.key} className="break-inside-avoid">
              <td className="border-b border-rule py-1 pr-1 align-top tabular-nums font-semibold">
                {stop.id === null ? '' : String(stop.id).padStart(2, '0')}
              </td>
              <td className="border-b border-rule py-1 pr-2 align-top uppercase tracking-wider">
                {stop.label}
              </td>
              <td className="border-b border-rule py-1 pr-2 align-top font-semibold">
                {stop.name}
                {stop.subtitle ? `, ${stop.subtitle}` : ''}
                {stop.address ? <span className="block font-normal">{stop.address}</span> : null}
                {!isNavigable(stop) && (
                  <span className="block font-normal italic">{coordinatesPlaceholder}</span>
                )}
              </td>
              <td className="border-b border-rule py-1 align-top">
                {stop.instruction}
                {stop.note ? ` ${stop.note}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex items-start gap-4 break-inside-avoid">
        <div className="flex-1 border border-navy p-2">
          <p className="eyebrow">{routeNotice.title}</p>
          <p className="mt-1 text-[10px] leading-snug">{routeNotice.body}</p>
          <p className="mt-1.5 text-[10px] leading-snug">
            Prescribed route: {site.prescribedRouteLine}
          </p>
        </div>
        {qr && (
          <div className="w-[26mm] shrink-0 text-center">
            <img src={qr} alt={`QR code for ${url}`} className="w-full" />
            <p className="mt-1 text-[8px] leading-tight">Scan to open route on mobile</p>
          </div>
        )}
      </div>

      <p className="mt-2 text-[8.5px] text-slate-ink">
        {site.authority} · {site.title} {site.documentVersion}
        {site.documentDate ? ` · ${site.documentDate}` : ''} · This sheet is a movement aid and does
        not replace instructions issued by SMPA officials or port security personnel.
      </p>
    </div>
  );
}
