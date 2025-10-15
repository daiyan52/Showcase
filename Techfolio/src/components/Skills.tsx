import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.skills")
      .then((res) => {
        setSkills(res.data?.message?.skills || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h2 className="text-lg font-bold text-center mb-3">Expertise</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 bg-gray-200 rounded mb-1 animate-pulse" />
              <div className="w-12 h-2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 py-4 text-xs">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <h2 className="text-lg font-bold text-center mb-3"></h2>

      {skills.length === 0 ? (
        <p className="text-center text-slate-500 text-[10px]">
          No active skills found.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {skills.map((skill: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center"
            >
              {skill.logo ? (
                <img
                  src={skill.logo}
                  alt={skill.skill_name}
                  className="w-14 h-14 object-contain mb-1 rounded-xl"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-[8px] text-gray-500 mb-1">
                  No Logo
                </div>
              )}
              <h3 className="text-[11px] font-medium text-slate-100 text-center">
                {skill.skill_name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
