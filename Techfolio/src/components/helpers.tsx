import React from "react";

export function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 text-slate-500 hover:text-teal-600"
    >
      <span className="h-px w-8 bg-slate-200 group-hover:bg-teal-400 group-hover:w-10 transition-all" />
      {label}
    </a>
  );
}

export function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-lg border border-slate-200 bg-slate-100 hover:bg-teal-100 hover:text-teal-700 transition"
    >
      {children}
    </a>
  );
}
