import React from "react";
export default function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
            <div className="mt-5">{children}</div>
        </section>
    );
}