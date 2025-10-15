import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Section from "./Section";
import ExperienceCard from "./ExperienceCard";
import Skills from "./Skills";
import Services from "./Services";
import Contact from "./Contact"
import SocialLinks from "./SocialLinks";
// import { projects } from "./projects"; // not used; remove to avoid lint warnings

export default function Portfolio() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/method/techfolio.api.api.get_techfolio")
      .then((res) => {
        setData(res.data?.message || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const bio = data?.bio || "Python Developer";

  return (
    <div className="min-h-screen text-white bg-[#0b1426] relative scroll-smooth">
      {/* soft radial gradient for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_20%,rgba(56,88,214,0.25),transparent_60%)]" />

      <div className="mx-auto max-w-6xl md:grid md:grid-cols-3">
        {/* Mobile top header */}
        <Header />

        {/* Sidebar (desktop) */}
        <Sidebar />

        {/* Main content */}
        <main className="md:col-span-2 px-6 sm:px-10 py-10 space-y-24">
          {/* About */}
          <Section id="about" title="About">
            {loading ? (
              <div className="space-y-3">
                <span className="block h-4 w-3/4 bg-white/10 animate-pulse rounded" />
                <span className="block h-4 w-2/3 bg-white/10 animate-pulse rounded" />
                <span className="block h-4 w-1/2 bg-white/10 animate-pulse rounded" />
              </div>
            ) : (
              <p className="text-zinc-300 leading-8 text-base sm:text-[1.05rem] whitespace-pre-line">
                {bio}
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm text-red-300">
                Failed to load bio: {error.message}
              </p>
            )}
            <Skills />
          </Section>

          {/* Experience */}
          <Section id="experience" title="Experience">
            <ExperienceCard />
          </Section>


          <Section id="services" title="Services">
            <Services />
          </Section>

          <Section id="contact" title="Let’s Connect">
            <Contact />
          </Section>

          <Section title="Join My Network">
            <SocialLinks className="justify-center" />
          </Section>


          <footer className="pt-4 text-xs text-zinc-500">
            © {new Date().getFullYear()} {data?.full_name || "Your Name"}
          </footer>
        </main>
      </div>
    </div>
  );
}

