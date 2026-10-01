import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { site } from "../../config/site";
import { paths } from "../../data/routes";
import { mailLink, telLink, mapsLink } from "../../lib/contact";
import { Logo } from "../brand/Logo";
import { Button } from "../ui/Button";

const YEAR = new Date().getFullYear();

function Col({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-1 text-sm font-bold text-white">{title}</h2>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link
              to={l.to}
              className="text-sm text-on-dark transition-colors hover:text-brand-300"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const tel = telLink();
  const mail = mailLink();
  const maps = mapsLink();
  // The homepage ends with its own requirement CTA, so the footer band is skipped there.
  const { pathname } = useLocation();
  const showCta = pathname !== "/";
  return (
    <footer className="on-dark relative isolate overflow-hidden bg-navy-950 text-on-dark">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/70 to-transparent"
        aria-hidden
      />
      <div
        className="absolute -top-40 left-1/4 -z-10 size-[480px] rounded-full bg-brand-600/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-0 -z-10 size-[380px] rounded-full bg-cyan-accent/10 blur-[120px]"
        aria-hidden
      />
      {showCta && (
        <div className="container-x pt-14">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-xl font-bold text-white">
                Planning a rollout, a boardroom or a licence renewal?
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Tell us what you need and we will come back with options and an
                itemised quotation.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <Button to={paths.quote} iconRight={<ArrowRight size={17} />}>
                Request a Quote
              </Button>
              <Button to={paths.contact} variant="ghost-dark">
                Talk to an IT Expert
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-4 lg:grid-cols-[1.35fr_repeat(4,1fr)] lg:gap-10 lg:py-20">
        <div className="col-span-2 flex flex-col gap-5 md:col-span-4 lg:col-span-1">
          <Link
            to="/"
            aria-label={`${site.shortName} — home`}
            className="self-start rounded-lg"
          >
            <Logo dark tagline />
          </Link>
          <div>
            <p className="text-[15px] font-extrabold tracking-[0.08em] text-white">{site.companyName}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-cyan-accent">{site.tagline}</p>
            <p className="mt-3 text-sm leading-7 text-on-dark">
              IT hardware, networking, cybersecurity, headsets, meeting rooms, cloud and support for organisations across India.
            </p>
          </div>
          <address className="flex flex-col gap-2.5 text-sm not-italic">
            {tel && (
              <a href={tel} className="group flex items-center gap-3 text-slate-200 transition-colors hover:text-cyan-accent">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-cyan-accent transition-all group-hover:border-cyan-accent/50 group-hover:bg-cyan-accent/10">
                  <Phone size={15} aria-hidden />
                </span>
                <span className="transition-transform group-hover:translate-x-0.5">{site.contact.phoneDisplay}</span>
              </a>
            )}
            {mail && (
              <a href={mail} className="group flex items-center gap-3 text-slate-200 transition-colors hover:text-cyan-accent">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-cyan-accent transition-all group-hover:border-cyan-accent/50 group-hover:bg-cyan-accent/10">
                  <Mail size={15} aria-hidden />
                </span>
                <span className="break-all transition-transform group-hover:translate-x-0.5">{site.contact.email}</span>
              </a>
            )}
            {site.contact.addressFull && (
              <a
                href={maps ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 text-slate-200 transition-colors hover:text-cyan-accent"
                aria-label={`${site.contact.addressFull} — open in Google Maps (new tab)`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-cyan-accent transition-all group-hover:border-cyan-accent/50 group-hover:bg-cyan-accent/10">
                  <MapPin size={15} aria-hidden />
                </span>
                <span className="pt-1 leading-relaxed transition-transform group-hover:translate-x-0.5">{site.contact.addressFull}</span>
              </a>
            )}
          </address>
        </div>
        <Col
          title="Products"
          links={[
            { label: "Laptops", to: paths.category("new-laptops") },
            { label: "Desktops", to: paths.category("desktops-workstations") },
            { label: "Mac", to: paths.category("apple-products") },
            { label: "Accessories", to: paths.category("it-accessories") },
            {
              label: "Headsets",
              to: paths.category("headsets-audio-solutions"),
            },
            { label: "Printers", to: paths.category("printers-scanners") },
            { label: "Networking", to: paths.category("networking") },
            {
              label: "Refurbished IT",
              to: paths.category("refurbished-laptops"),
            },
          ]}
        />
        <Col
          title="Solutions"
          links={[
            { label: "IT Infrastructure", to: paths.service("network-setup") },
            { label: "Cybersecurity", to: paths.service("cybersecurity-dlp") },
            { label: "Cloud & Microsoft 365", to: paths.microsoft },
            { label: "Workplace Technology", to: `${paths.av}?cat=signage` },
            { label: "Meeting Rooms", to: paths.av },
            {
              label: "Call Centre",
              to: `${paths.category("headsets-audio-solutions")}?subcategory=Call%20Centre%20Headsets`,
            },
            {
              label: "CCTV & Surveillance",
              to: paths.service("cctv-surveillance"),
            },
          ]}
        />
        <Col
          title="Services"
          links={[
            {
              label: "IT Support",
              to: paths.service("desktop-laptop-support"),
            },
            { label: "AMC", to: paths.service("it-amc") },
            { label: "Procurement", to: paths.corporate },
            {
              label: "Deployment",
              to: paths.service("installation-configuration"),
            },
            { label: "Asset Management", to: paths.service("it-amc") },
            { label: "Onsite Support", to: paths.service("computer-repair") },
          ]}
        />
        <Col
          title="Company"
          links={[
            { label: "About Us", to: paths.about },
            { label: "Contact", to: paths.contact },
            { label: "Request a Quote", to: paths.quote },
            { label: "Vendor Registration", to: paths.vendor },
            { label: "Privacy Policy", to: paths.privacy },
            { label: "Terms", to: paths.terms },
            { label: "Shipping & Delivery", to: paths.shipping },
            { label: "Returns & Refunds", to: paths.returns },
            { label: "Warranty Policy", to: paths.warranty },
          ]}
        />
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-subtle md:flex-row md:items-center md:justify-between">
          <span>
            © {YEAR} {site.companyName}. All rights reserved.
          </span>
          {Object.values(site.social).some(Boolean) && (
            <ul className="flex gap-4" aria-label="Social media">
              {(Object.entries(site.social) as [string, string | null][])
                .filter(([, url]) => url)
                .map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capitalize hover:text-brand-300"
                    >
                      {name === "linkedin" ? "LinkedIn" : name}
                    </a>
                  </li>
                ))}
            </ul>
          )}
          <span>
            Brand names are trademarks of their respective owners and do not
            imply authorised-reseller status.
          </span>
        </div>
      </div>
    </footer>
  );
}
