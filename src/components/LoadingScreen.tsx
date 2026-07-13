import { useEffect } from "react";
import loadingVideo from "../../assets/loading.mp4";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onComplete, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#12110f]">
      <video
        className="absolute inset-0 block h-screen w-screen max-w-none object-cover"
        src={loadingVideo}
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        onError={onComplete}
      />
      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.24em] text-white/65 hover:text-white"
      >
        Skip intro
      </button>
    </div>
  );
}
