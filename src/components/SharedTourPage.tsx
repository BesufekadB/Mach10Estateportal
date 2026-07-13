import { useEffect, useState } from "react";
import { Bath, BedDouble, Building2, CalendarDays, CarFront, Maximize, MapPin, ShieldCheck } from "lucide-react";
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
  const specifications = [
    { label: "Bedrooms", value: project.specs.beds, icon: BedDouble },
    { label: "Bathrooms", value: project.specs.baths, icon: Bath },
    { label: "Living area", value: project.specs.livingArea, icon: Maximize },
    { label: "Built", value: project.specs.builtYear, icon: CalendarDays },
    { label: "Garage", value: project.specs.garage, icon: CarFront },
  ].filter((item) => item.value && item.value !== "N/A" && item.value !== "-" && item.value !== "--");
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
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#ffdea5]">Property overview</p>
            {project.description ? <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">{project.description}</p> : null}
            {project.specs.amenities && project.specs.amenities !== "N/A" ? <div className="mt-6"><p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Features and amenities</p><p className="mt-2 text-sm leading-7 text-white/75">{project.specs.amenities}</p></div> : null}
          </div>
          <aside className="rounded-lg border border-white/15 bg-white/[0.04] p-5 md:p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#ffdea5]">Property details</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {specifications.map(({ label, value, icon: Icon }) => <div key={label} className="border-b border-white/10 pb-3"><Icon className="w-4 h-4 text-[#ffdea5]" /><p className="mt-2 text-[9px] uppercase tracking-widest text-white/45">{label}</p><p className="mt-1 text-sm text-white/90">{value}</p></div>)}
            </div>
            {project.specs.price ? <div className="mt-5 rounded-md bg-[#ffdea5]/10 px-4 py-3"><p className="text-[9px] uppercase tracking-widest text-[#ffdea5]">Asking price</p><p className="mt-1 font-display text-lg text-white">{project.specs.price}</p></div> : null}
          </aside>
        </section>
      </section>
    </main>
  );
}
