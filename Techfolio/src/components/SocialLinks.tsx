import React, { useEffect, useState } from "react";
import axios from "axios";

type SocialRow = {
  social_media: string;
  link: string;
  is_active: 1 | 0;
};

type ApiResponse =
  | { social_media: SocialRow[] }
  | { message: { social_media: SocialRow[] } }
  | any;

const ICONS: Record<string, JSX.Element> = {
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 107.5 6 2.5 2.5 0 004.98 3.5zM3 8.98h4v12H3zM14.5 9a4.5 4.5 0 00-3.5 1.64V9h-4v12h4v-6.4a2.4 2.4 0 014.8.02V21h4v-6.86C19.8 10.92 17.7 9 14.5 9z" />
    </svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 00.5 12.2c0 5.2 3.4 9.6 8.1 11.1.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.7-1 .7-1 .8-1.3 2.1-.9 2.6-.7.1-.6.4-1 .7-1.2-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.6 1.2-3.5-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.3a11.4 11.4 0 016.2 0c2.4-1.6 3.4-1.3 3.4-1.3.6 1.6.2 2.9.1 3.2.8.9 1.2 2.1 1.2 3.5 0 4.8-2.9 5.9-5.6 6.2.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.6 11.6 0 0023.5 12 11.5 11.5 0 0012 .5z" />
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.07A10 10 0 1010.25 22v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.63-1.3 1.27V12h2.3l-.37 3h-1.93v7A10 10 0 0022 12.07z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A5.5 5.5 0 1111.999 18.5 5.5 5.5 0 0112 7.5zm0 2a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0012 9.5zM18 6.8a1 1 0 11-1 1 1 1 0 011-1z" />
    </svg>
  ),
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm7.9 9h-3.2a15 15 0 00-1.2-5 8 8 0 014.4 5zM12 4a13 13 0 011.6 7H10.4A13 13 0 0112 4zM4.6 16a8 8 0 010-8h3.5a15.5 15.5 0 000 8zm3.5 2H4.6a8 8 0 004.4 5 15.5 15.5 0 00-1.9-5zm2.3 0H13a13 13 0 01-1 6 13 13 0 01-1.6-6zm6.2 0h3.2a8 8 0 01-4.4 5 15 15 0 001.2-5zM10.4 11h3.2a13 13 0 01-1.6 7 13 13 0 01-1.6-7z" />
    </svg>
  ),
};

const getIcon = (key: string) => ICONS[key?.toLowerCase()] ?? ICONS.default;

const toSafeUrl = (url: string) => {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) ? url : "#";
  } catch {
    return "#";
  }
};

export default function SocialLinks({ className = "" }: { className?: string }) {
  const [links, setLinks] = useState<SocialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ApiResponse>("/api/method/techfolio.api.api.social_media")
      .then((res) => {
        const list: SocialRow[] =
          res.data?.message?.social_media ??
          res.data?.social_media ??
          [];
        const clean = list
          .filter((r) => r?.is_active === 1 && r?.link)
          .map((r) => ({ ...r, link: toSafeUrl(r.link) }));
        setLinks(clean);
      })
      .catch((e) => setErr(e?.message || "Failed to load social links"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={`text-zinc-400 animate-pulse ${className}`}>Loading…</div>;
  if (err) return <div className={`text-red-400 ${className}`}>Error: {err}</div>;
  if (!links.length) return <div className={`text-zinc-400 ${className}`}>No social links.</div>;

  return (
    <nav className={`flex items-center gap-3 ${className}`} aria-label="Social profiles">
      {links.map((row, i) => {
        const key = row.social_media?.toLowerCase() || "profile";
        const icon = getIcon(key);
        return (
          <a
            key={`${key}-${i}`}
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0b1426] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            {icon}
          </a>
        );
      })}
    </nav>
  );
}
