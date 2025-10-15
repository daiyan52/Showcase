import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.get_techfolio")
      .then((res) => {
        setData(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center text-zinc-400 animate-pulse mt-10">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-400 mt-10">
        Error: {error.message}
      </p>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg bg-gradient-to-b from-[#0b1426] via-[#111c33] to-[#0b1426]">
        {/* Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-indigo-800/40 via-indigo-600/30 to-indigo-800/40" />

        {/* Profile Picture */}
        <div className="-mt-16 flex justify-center">
          <img
            src={
              data?.profile_pic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="h-32 w-32 object-cover rounded-full ring-4 ring-[#0b1426] shadow-lg"
          />
        </div>

        {/* Bio */}
        <div className="px-6 py-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {data?.full_name || "Your Name"}
          </h2>
          <p className="text-sm text-zinc-400 mb-3">
            {data?.designation || "Python Developer"}
          </p>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {data?.bio || "No bio available."}
          </p>
        </div>
      </div>
    </div>
  );
}
