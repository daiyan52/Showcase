import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import NavLink from "./NavLink";
import IconLink from "./IconLink";

type SocialItem = {
  platform: string; // e.g., "linkedin", "github", "email"
  link: string;     // url or email / mailto
  active?: 0 | 1;
};

type TechfolioPayload = {
  full_name?: string;
  role?: string;
  bio?: string;
  profile_pic?: string | null;
  social_media?: SocialItem[];
};

export default function Sidebar() {
  const [data, setData] = useState<TechfolioPayload | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.get_techfolio")
      .then((res) => {
        const payload: TechfolioPayload = res.data?.message || null;
        setData(payload);
        setAvatarSrc(payload?.profile_pic || null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const name = data?.full_name || "—";
  const role = data?.role || "—";

  // Normalize social links into a small, deduped map we can render.
  const socials = useMemo(() => {
    const list = (data?.social_media || []).filter(Boolean);

    // helper to normalize platform keys
    const norm = (s: string) =>
      (s || "").toLowerCase().trim().replace(/\s+/g, "");

    // helper to normalize hrefs (email → mailto)
    const toHref = (platform: string, raw: string) => {
      const url = (raw || "").trim();
      if (!url) return null;

      if (norm(platform) === "email") {
        if (url.startsWith("mailto:")) return url;
        // crude email detection; adjust if you enforce email validation server-side
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) return `mailto:${url}`;
      }
      return url;
    };

    // we’ll keep the first link per known platform; you can change this if you want multiple
    const map = new Map<
      string,
      { label: string; href: string; icon: React.ReactNode }
    >();

    const push = (key: string, href: string) => {
      if (!href || map.has(key)) return;
      const iconFor: Record<
        string,
        { label: string; icon: React.ReactNode }
      > = {
        github: { label: "GitHub", icon: <Github size={18} /> },
        linkedin: { label: "LinkedIn", icon: <Linkedin size={18} /> },
        email: { label: "Email", icon: <Mail size={18} /> },
        twitter: { label: "Twitter", icon: <Twitter size={18} /> },
        x: { label: "Twitter", icon: <Twitter size={18} /> },
        instagram: { label: "Instagram", icon: <Instagram size={18} /> },
        facebook: { label: "Facebook", icon: <Facebook size={18} /> },
        website: { label: "Website", icon: <Globe size={18} /> },
        portfolio: { label: "Website", icon: <Globe size={18} /> },
      };

      const known = iconFor[key] || { label: "Link", icon: <LinkIcon size={18} /> };
      map.set(key, { label: known.label, href, icon: known.icon });
    };

    for (const item of list) {
      const key = norm(item.platform);
      const href = toHref(key, item.link);
      if (!href) continue;

      // map common aliases
      if (["github"].includes(key)) push("github", href);
      else if (["linkedin"].includes(key)) push("linkedin", href);
      else if (["email", "mail"].includes(key)) push("email", href);
      else if (["twitter", "x"].includes(key)) push("twitter", href);
      else if (["instagram", "ig"].includes(key)) push("instagram", href);
      else if (["facebook", "fb"].includes(key)) push("facebook", href);
      else if (["website", "site", "portfolio"].includes(key)) push("website", href);
      else push(key, href); // unknown platform → generic link icon
    }

    return Array.from(map.entries()).map(([key, v]) => ({
      key,
      ...v,
    }));
  }, [data?.social_media]);

  return (
    <aside className="hidden md:flex md:sticky md:top-0 md:h-screen md:col-span-1 border-r border-white/10">
      <div className="flex flex-col justify-between p-8 w-full">
        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 text-center shadow-lg overflow-hidden">
          {/* Image area: edge-to-edge, no side gaps */}
          <div className="w-full h-56">
            {loading ? (
              <div className="h-full w-full bg-white/10 animate-pulse" />
            ) : avatarSrc ? (
              <img
                src={avatarSrc}
                alt={name}
                className="w-full h-full object-cover rounded-t-2xl"
                onError={() => setAvatarSrc("/default-avatar.png")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500 text-sm">
                No Image
              </div>
            )}
          </div>

          {/* Name + Role */}
          <div className="pb-6 px-5">
            <h2 className="mt-4 text-xl font-bold">
              {loading ? "Loading…" : name}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">{loading ? "…" : role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-10 space-y-3 text-sm font-semibold tracking-wider">
          <NavLink href="#about" label="ABOUT" />
          <NavLink href="#experience" label="EXPERIENCE" />
          <NavLink href="#services" label="SERVICES" />
          <NavLink href="#contact" label="CONTACT" />
        </nav>

        {/* Socials (from social_media) */}
        <div className="flex items-center gap-4 text-zinc-300 mt-10">
          {loading ? (
            <>
              <div className="h-5 w-5 rounded-full bg-white/10 animate-pulse" />
              <div className="h-5 w-5 rounded-full bg-white/10 animate-pulse" />
              <div className="h-5 w-5 rounded-full bg-white/10 animate-pulse" />
            </>
          ) : socials.length ? (
            socials.map((s) => (
              <IconLink key={s.key} href={s.href} label={s.label}>
                {s.icon}
              </IconLink>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No social links</span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 text-xs text-red-400 text-center">
            Failed to load profile: {error.message}
          </div>
        )}
      </div>
    </aside>
  );
}

