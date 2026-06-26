/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { Compass, Fullscreen, Maximize2, Minimize2, ChevronLeft, ChevronRight, Sparkles, Move, Info } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { TourScene } from "../types";

interface TourViewer360Props {
  scene: TourScene;
  scenes: TourScene[];
  onSelectScene: (scene: TourScene) => void;
}

export default function TourViewer360({ scene, scenes, onSelectScene }: TourViewer360Props) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState(50); // percentage (0 - 100) representing view center
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startPanOffsetRef = useRef(0);

  // Trigger loading state on scene modify
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, [scene]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Exit fullscreen error:", err));
    }
  };

  // Monitor domestic fullscreen change (like ESC key)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Pan interaction handlers (Mouse and Touch)
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startPanOffsetRef.current = panOffset;
    setShowHelp(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // Calculate speed factor
    const speed = 0.08;
    let newOffset = startPanOffsetRef.current - deltaX * speed;
    
    // Wrap around 360 (0 - 100)
    if (newOffset > 100) newOffset -= 100;
    if (newOffset < 0) newOffset += 100;
    
    setPanOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch triggers
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startXRef.current = e.touches[0].clientX;
      startPanOffsetRef.current = panOffset;
      setShowHelp(false);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const speed = 0.12;
    let newOffset = startPanOffsetRef.current - deltaX * speed;
    
    if (newOffset > 100) newOffset -= 100;
    if (newOffset < 0) newOffset += 100;
    
    setPanOffset(newOffset);
  };

  // Simple step movements
  const stepPan = (direction: "left" | "right") => {
    let step = direction === "left" ? -15 : 15;
    let newOffset = panOffset + step;
    if (newOffset > 100) newOffset -= 100;
    if (newOffset < 0) newOffset += 100;
    setPanOffset(newOffset);
  };

  // Determine angle of the compass based on panOffset percentage (0 - 100% -> 0 - 360 deg)
  const compassRotation = (panOffset * 3.6).toFixed(1);

  // We place hotspots based on specific horizontal angles.
  // Scene 1: Grand Atelier (offset 50), Scene 2: Infinity Pool (offset 25), Scene 3: Reserve Vault (offset 75)
  // Let's map active hotspots to other scenes in projects so users can dynamically click to teleport around!
  const mockHotspots = [
    { targetId: "scene-pool", name: t("projectPage.hotspotInfinityPool"), angle: 25, label: t("projectPage.hotspotPortalPool") },
    { targetId: "scene-vault", name: t("projectPage.hotspotReserveVault"), angle: 75, label: t("projectPage.hotspotPortalVault") },
    { targetId: "scene-spa", name: t("projectPage.hotspotWellnessSpa"), angle: 10, label: t("projectPage.hotspotPortalSpa") },
    { targetId: "scene-atelier", name: t("projectPage.hotspotAtelier"), angle: 50, label: t("projectPage.hotspotPortalAtelier") }
  ].filter(h => h.targetId !== scene.id);

  return (
    <div
      id="tour-canvas-container"
      ref={containerRef}
        className={`relative w-full overflow-hidden bg-stone-100 dark:bg-black transition-all duration-500 rounded-lg ${
        isFullscreen ? "h-screen w-screen" : "aspect-video shadow-2xl"
      }`}
    >
      {/* 360 Panoramic Canvas Simulator */}
      <div
        className="absolute top-0 left-0 h-full w-[300%] select-none transition-transform duration-75 ease-out"
        style={{
          transform: `translateX(-${panOffset * 0.64}%)`,
          cursor: isDragging ? "grabbing" : "grab"
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <img
          src={scene.imageUrl}
          alt={scene.name}
          className="h-full w-full object-cover select-none pointer-events-none filter brightness-95 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />

        {/* Hotspots simulated at fixed horizontal angles within the 300% width map */}
        <div className="absolute inset-0 pointer-events-none">
          {mockHotspots.map((hotspot, idx) => {
            const sceneTarget = scenes.find(s => s.id === hotspot.targetId);
            if (!sceneTarget) return null;

            // Map standard coordinates across the 300% canvas map
            const xPercent = (hotspot.angle * 2.8) + 5; 
            return (
              <div
                key={idx}
                className="absolute pointer-events-auto group cursor-pointer"
                style={{ left: `${xPercent}%`, top: "52%" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScene(sceneTarget);
                }}
              >
                {/* Visual pulse ring */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-white opacity-40"></span>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Sparkles className="w-4 h-4 text-white hover:text-primary transition-colors" />
                  </div>
                  {/* Hover tooltip */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/92 dark:bg-black/85 backdrop-blur-md border border-outline-lucid/30 dark:border-outline-lucid/30 py-2 px-3 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-max pointer-events-none">
                    <p className="font-label-sm text-[10px] text-primary-fixed uppercase tracking-wider">{sceneTarget.category}</p>
                    <p className="font-display text-xs text-onyx dark:text-white uppercase tracking-widest">{sceneTarget.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-40 transition-opacity duration-500">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-primary opacity-50"></span>
            <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin"></div>
          </div>
          <p className="font-display text-xs text-white tracking-[0.3em] uppercase">{t("adminPage.reticulatingViews")}</p>
          <p className="text-[10px] text-neutral-stone uppercase tracking-wider mt-1">{t("adminPage.calibratingLight")}</p>
        </div>
      )}

      {/* HUD - Top Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        {/* Info label */}
          <div className="bg-white/78 dark:bg-black/40 backdrop-blur-xl border border-outline-lucid/40 dark:border-white/10 px-4 py-2 pointer-events-auto flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#775a19] animate-pulse"></span>
            <div className="text-left">
              <p className="font-label-sm text-[9px] text-neutral-stone dark:text-white/60 uppercase tracking-widest leading-none">{t("adminPage.currentSpace")}</p>
              <p className="font-display text-xs font-medium text-onyx dark:text-white uppercase tracking-wider">{scene.name}</p>
            </div>
          </div>

        {/* Action triggers */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Compass with Rotation value calculated based on current translation offset */}
          <div className="bg-white/78 dark:bg-black/40 backdrop-blur-xl border border-outline-lucid/40 dark:border-white/10 p-2 text-onyx dark:text-white flex items-center gap-2" title={t("projectPage.compassBearing")}>
            <Compass
              className="w-4 h-4 text-[#ffdea5] transition-transform duration-700"
              style={{ transform: `rotate(${compassRotation}deg)` }}
            />
            <span className="font-mono text-[10px] tracking-wider text-onyx dark:text-white">
              {Math.round(panOffset * 3.6)}° N
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/78 dark:bg-black/40 hover:bg-white dark:hover:bg-white/10 backdrop-blur-xl border border-outline-lucid/40 dark:border-white/10 text-onyx dark:text-white rounded transition-all shadow-lg"
            title={isFullscreen ? t("adminPage.exitFullscreen") : t("adminPage.enterFullscreen")}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Help overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/30 pointer-events-none flex items-center justify-center z-10 transition-opacity duration-1000">
          <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md border border-outline-lucid/40 dark:border-white/20 p-6 rounded text-center text-onyx dark:text-white max-w-sm flex flex-col items-center">
            <Move className="w-8 h-8 text-[#ffdea5] mb-3 animate-bounce" />
            <h4 className="font-display text-xs uppercase tracking-widest mb-1">{t("adminPage.interactivePanorama")}</h4>
            <p className="text-[11px] text-stone-variant dark:text-white/80 leading-relaxed mb-1">
              {t("adminPage.dragToPan")}
            </p>
            <p className="text-[10px] text-[#ffdea5] uppercase font-semibold tracking-wider">
              {t("adminPage.clickHotspots")}
            </p>
          </div>
        </div>
      )}

      {/* Manual Pan control rails (for users with disabled drags or trackpads) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-none">
        <button
          onClick={() => stepPan("left")}
          className="p-3 bg-white/78 dark:bg-black/55 hover:bg-primary border border-outline-lucid/40 dark:border-white/10 text-onyx dark:text-white shadow-2xl transition-all pointer-events-auto rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-none">
        <button
          onClick={() => stepPan("right")}
          className="p-3 bg-white/78 dark:bg-black/55 hover:bg-primary border border-outline-lucid/40 dark:border-white/10 text-onyx dark:text-white shadow-2xl transition-all pointer-events-auto rounded-full"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* HUD - Bottom Description and scene counts */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-30 pointer-events-none">
        {/* Short info */}
        <div className="bg-white/88 dark:bg-black/55 backdrop-blur-xl border border-outline-lucid/40 dark:border-white/10 p-5 rounded max-w-md pointer-events-auto text-left">
          <span className="font-label-sm text-[9px] text-[#ffdea5] uppercase tracking-widest">{scene.category}</span>
          <p className="text-stone-variant dark:text-white/90 text-xs mt-1 leading-relaxed">{scene.description}</p>
        </div>

        {/* Scene Selection List (Minimal floating capsules) */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-white/68 dark:bg-black/30 backdrop-blur-md p-2 rounded border border-outline-lucid/30 dark:border-white/5 max-w-lg justify-end">
          {scenes.map((s, idx) => {
            const isActive = s.id === scene.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScene(s)}
                className={`px-3 py-1.5 rounded transition-all text-[10px] uppercase font-label-sm tracking-wider ${
                  isActive
                    ? "bg-primary text-white font-semibold"
                    : "bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 text-stone-variant dark:text-white/80 hover:text-onyx dark:hover:text-white"
                }`}
              >
                {idx + 1}. {s.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
