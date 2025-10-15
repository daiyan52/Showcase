import React from "react";
export default function Header() {
    return (
        <header className="md:hidden sticky top-0 z-20 backdrop-blur bg-[#0b1426]/80 border-b border-white/10">
            <div className="px-5 py-3 flex items-center justify-between">
                <div className="font-semibold">Daiyan Alam</div>
                <nav className="flex items-center gap-5 text-sm text-zinc-300">
                    <a href="#about" className="hover:text-white">About</a>
                    <a href="#experience" className="hover:text-white">Experience</a>
                    <a href="#services" className="hover:text-white">Services</a>
                    <a href="#contact" className="hover:text-white">Contact</a>
                </nav>
            </div>
        </header>
    );
}