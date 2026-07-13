import { useEffect, useState } from "react";
import { Building2, MapPin, ShieldCheck } from "lucide-react";
import { loadSharedTour } from "../lib/portalData";
import { normalizeTourEmbedUrl } from "../lib/portalData";
import type { Project } from "../types";
import TourViewer360 from "./TourViewer360";

export default function SharedTourPage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    let active = true;
    void loadSharedTour(projectId)
      .then(({ project: sharedProject }) => active && setProject(sharedProject))
      .catch((loadError) => active && setError(loadError instanceof Error ? loadError.message : "This tour is unavailable."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#12110f] text-white text-xs uppercase tracking-[0.25em]">Loading tour</div>;
  }
  if (!project || error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#12110f] p-6 text-center text-white"><div><Building2 className="w-9 h-9 mx-auto mb-4 text-[#ffdea5]" /><h1 className="font-display text-xl uppercase tracking-wider">Tour unavailable</h1><p className="mt-3 text-sm text-white/65">{error || "This shared tour link is no longer available."}</p></div></div>;
  }

  const embedUrl = normalizeTourEmbedUrl(project.tourEmbedUrl ?? "");
  return (
    <main className="min-h-screen bg-[#12110f] text-white">
      <header className="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold"><Building2 className="w-5 h-5 text-[#ffdea5]" /> Estate Portal</div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/55"><ShieldCheck className="w-4 h-4 text-[#ffdea5]" /> Secure shared viewing</div>
      </header>
      <section className="max-w-7xl mx-auto px-5 py-10 md:py-14">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#ffdea5]">Private property tour</p>
        <h1 className="mt-3 font-display text-3xl md:text-5xl uppercase tracking-wider">{project.name}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-white/65"><MapPin className="w-4 h-4 text-[#ffdea5]" />{project.location}</p>
        <div className="mt-8 overflow-hidden rounded-lg border border-white/15 bg-black aspect-video shadow-2xl">
          {embedUrl ? <iframe src={embedUrl} title={`${project.name} virtual tour`} className="h-full w-full" allow="fullscreen; autoplay; xr-spatial-tracking" allowFullScreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation" /> : project.scenes.length ? <TourViewer360 scene={project.scenes[activeSceneIndex]} scenes={project.scenes} onSelectScene={(scene) => setActiveSceneIndex(project.scenes.findIndex((item) => item.id === scene.id))} /> : <div className="h-full flex items-center justify-center text-center p-6 text-sm text-white/60">The interactive tour is being prepared. Please check back shortly.</div>}
        </div>
        {project.description ? <p className="max-w-3xl mt-7 text-sm leading-7 text-white/70">{project.description}</p> : null}
      </section>
    </main>
  );
}
