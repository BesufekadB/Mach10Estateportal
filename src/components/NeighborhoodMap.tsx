import { useEffect, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { useI18n } from "../lib/i18n";

interface NeighborhoodMapProps {
  location: string;
  projectName: string;
}

interface Coordinates {
  lng: number;
  lat: number;
}

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function NeighborhoodMap({ location, projectName }: NeighborhoodMapProps) {
  const { t } = useI18n();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(Boolean(mapboxToken));
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const geocode = async () => {
      if (!mapboxToken) {
        setLoading(false);
        return;
      }

      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?limit=1&access_token=${mapboxToken}`;
        const response = await fetch(endpoint);
        const payload = await response.json();
        const center = payload?.features?.[0]?.center;

        if (!cancelled && Array.isArray(center) && center.length === 2) {
          setCoordinates({ lng: center[0], lat: center[1] });
        }
      } catch {
        // Fall back to the generic map below when geocoding is unavailable.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void geocode();

    return () => {
      cancelled = true;
    };
  }, [location]);

  const staticMapUrl = coordinates && mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/${isDarkMode ? "dark-v11" : "light-v11"}/static/pin-s+775a19(${coordinates.lng},${coordinates.lat})/${coordinates.lng},${coordinates.lat},12,0/1200x640?access_token=${mapboxToken}`
    : null;

  const mapboxOpenUrl = coordinates
    ? `https://www.mapbox.com/maps/?zoom=12&center=${coordinates.lng},${coordinates.lat}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div className="bg-white/92 dark:bg-[#10151a] border border-outline-lucid/60 dark:border-outline-lucid/75 p-6 rounded-[var(--radius-ui)] space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <h4 className="font-display text-xs uppercase tracking-widest text-onyx font-bold">{t("projectPage.neighborhoodContext")}</h4>
      </div>

      {staticMapUrl ? (
        <div className="rounded-[var(--radius-ui-sm)] overflow-hidden border border-outline-lucid/20 bg-stone-50 dark:bg-[#12181f]">
          <img
            src={staticMapUrl}
            alt={`${projectName} neighborhood map`}
            className="h-64 w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <div className="rounded-[var(--radius-ui-sm)] overflow-hidden border border-outline-lucid/20 bg-stone-50 dark:bg-[#12181f]">
          <iframe
            title={`${projectName} map`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <p className="text-[11px] text-neutral-stone leading-relaxed">
        {loading
          ? t("projectPage.preparingMap")
          : t("projectPage.mapLead", { location })}
      </p>

      <a
        href={mapboxOpenUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary"
      >
        {t("common.openMap")}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
