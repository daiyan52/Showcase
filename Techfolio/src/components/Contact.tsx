// Contact.tsx — single background color version
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ContactForm from "./ContactForm";

const IconButton = ({
  label, onClick, children, active = false, disabled = false,
}: {
  label: string; onClick?: () => void; children: React.ReactNode;
  active?: boolean; disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={[
      "inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
      // no translucent bg; keep it flat on same background
      "border-white/10 text-zinc-300",
      active ? "bg-indigo-500/20 text-white" : "hover:bg-white/10 hover:text-white",
      disabled ? "opacity-40 cursor-not-allowed" : "",
    ].join(" ")}
  >
    {children}
  </button>
);

type ContactInfo = { phone?: string; email?: string };

function Modal({
  open, onClose, title = "Contact", children,
}: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
        // solid panel, no glassy layer
        className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-[#0b1426] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [active, setActive] = useState<null | "phone" | "email">(null);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.contact")
      .then((res) => {
        const raw = res.data?.message || res.data || {};
        setContact({ phone: raw.phone || raw.mobile, email: raw.email });
      })
      .catch((e) => setErr(e?.message || "Failed to load contact info"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center text-zinc-400 animate-pulse">Loading contact info...</div>;
  if (err) return <p className="py-8 text-center text-red-400">Error: {err}</p>;
  if (!contact) return <p className="text-center text-zinc-400">No contact information found.</p>;

  const hasPhone = !!contact.phone;
  const hasEmail = !!contact.email;

  return (
    <>
      {/* flat section: no gradient, no glassy bg */}
      <section className="relative max-w-2xl mx-auto rounded-2xl border border-white/10 bg-[#0b1426] shadow-md p-8 space-y-6">
        {/* Icons row */}
        <div className="flex items-center justify-center gap-4">
          {hasPhone && (
            <IconButton
              label="Phone"
              onClick={() => setActive((a) => (a === "phone" ? null : "phone"))}
              active={active === "phone"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.3.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C10.07 22 2 13.93 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.28.2 2.47.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
              </svg>
            </IconButton>
          )}

          {hasEmail && (
            <IconButton
              label="Email"
              onClick={() => setActive((a) => (a === "email" ? null : "email"))}
              active={active === "email"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4a2 2 0 00-2 2v.4l10 6 10-6V6a2 2 0 00-2-2zm0 4.8l-8.7 5.22a1 1 0 01-1.06 0L1.5 8.8V18a2 2 0 002 2h16a2 2 0 002-2V8.8z" />
              </svg>
            </IconButton>
          )}

          <IconButton label="Send a Message" onClick={() => setShowForm(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21l20-9L2.01 3 2 10l15 2-15 2z" />
            </svg>
          </IconButton>
        </div>

        {/* Reveal details */}
        {active && (
          <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-[#0b1426] p-4 text-zinc-200">
            {active === "phone" && contact.phone && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-zinc-400 text-sm">Phone</span>
                <a href={`tel:${contact.phone}`} className="text-lg text-indigo-400 hover:text-white transition-colors">
                  {contact.phone}
                </a>
              </div>
            )}
            {active === "email" && contact.email && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-zinc-400 text-sm">Email</span>
                <a href={`mailto:${contact.email}`} className="text-lg text-indigo-400 hover:text-white transition-colors break-all">
                  {contact.email}
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Send a Message">
        {/* ContactForm already uses flat bg in your latest version; if not, make it bg-[#0b1426] */}
        <ContactForm />
      </Modal>
    </>
  );
}
