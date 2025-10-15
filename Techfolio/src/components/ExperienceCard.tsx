import React, { useEffect, useState } from "react";
import axios from "axios";

export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  skills: string[];
  logo?: string | null;
};

// Format date as DD-MM-YYYY
function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Use dashes
}

function ExperienceCard({ e }: { e: Experience }) {
  // Split period into start and end for styling
  const [start, end] = e.period.split(" – ");
  const endColor = end === "Present" ? "text-green-400" : "text-red-400";

  // Filter out empty bullets
  const validBullets = e.bullets.filter(Boolean);

  return (
    <article className="border border-white/10 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {e.logo && (
            <img
              src={e.logo}
              alt={e.company}
              className="h-7 w-7 rounded-full object-cover border border-white/10"
            />
          )}
          <span className="text-base font-semibold text-white">{e.company}</span>
        </div>
        <h3 className="text-lg font-medium text-zinc-200">{e.role}</h3>
        <span className="text-sm text-zinc-400">
          <span className="text-zinc-300">{start}</span> –{" "}
          <span className={endColor}>{end}</span>
        </span>
      </div>

      {/* Bullets */}
      {validBullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-zinc-300 leading-7 list-disc pl-5">
          {validBullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {/* Skills */}
      {e.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {e.skills.map((s) => (
            <span
              key={s}
              className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.experiences")
      .then((res) => {
        const data = res.data.message.experience || [];
        const mapped: Experience[] = data.map((e: any) => ({
          role: e.job_role,
          company: e.company_name,
          period: e.is_current_company
            ? `${formatDate(e.date_of_joining)} – Present`
            : `${formatDate(e.date_of_joining)} – ${formatDate(e.leaving_date)}`,
          bullets:
            e.project_description && e.project_description.trim() !== ""
              ? [e.project_description.trim()]
              : [], // Only add if non-empty
          skills: e.key_skill ? e.key_skill.split(",") : [],
          logo: e.company_logo,
        }));
        setExperiences(mapped);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {experiences.map((e, i) => (
        <ExperienceCard key={i} e={e} />
      ))}
    </div>
  );
}
