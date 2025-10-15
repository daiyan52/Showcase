import React, { useEffect, useState } from "react";
import axios from "axios";

type ApiService = {
  service_name: string;
  description?: string;
  logo?: string | null;
  link?: string | null;
};

function ServiceCard({ s }: { s: ApiService }) {
  return (
    <article className="w-full h-[500px] flex flex-col border border-white/10 rounded-2xl overflow-hidden shadow-md bg-[#0b1426]/60 hover:bg-[#0b1426]/80 transition-all duration-300">
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-[#0b1426]">
        {s.logo ? (
          <img
            src={s.logo}
            alt={s.service_name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-white/5 flex items-center justify-center text-zinc-500 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Body (scrollable description) */}
      <div className="px-5 pt-4 pb-5 flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {s.service_name}
        </h3>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto pr-1 text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {s.description || "—"}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.services")
      .then((res) => setServices(res.data?.message?.services || []))
      .catch((e) => setErr(e?.message || "Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  const gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6";

  return (
    <div className="w-full">
      {loading ? (
        <div className={gridClass}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[500px] rounded-2xl border border-white/10 bg-[#0b1426]/60 overflow-hidden"
            >
              <div className="h-40 w-full bg-white/10 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : err ? (
        <p className="py-8 text-center text-red-400">Error: {err}</p>
      ) : services.length === 0 ? (
        <p className="text-center text-zinc-400">No services found.</p>
      ) : (
        <div className={gridClass}>
          {services.map((s, idx) => (
            <ServiceCard key={idx} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}
