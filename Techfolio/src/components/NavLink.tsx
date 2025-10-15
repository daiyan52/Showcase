import React from "react";


export default function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white"
        >
            <span className="h-px w-8 bg-white/15 group-hover:w-10 transition-all" />
            {label}
        </a>
    );
}