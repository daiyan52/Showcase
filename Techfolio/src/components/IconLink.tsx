import React from "react";


export default function IconLink({
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
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
            {children}
        </a>
    );
}