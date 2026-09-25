import { useEffect, useRef, useState } from "react";
import { bi } from "./i18n";
import "pannellum/build/pannellum.css";
export type AuthorizedPanorama = {
  room: string;
  url: string;
  authorized: true;
  source: string;
  rights: string;
  reviewedAt: string;
  caption: { en: string; ar: string };
};
type Viewer = {
  destroy(): void;
  setYaw(v: number): void;
  setPitch(v: number): void;
  setHfov(v: number): void;
};
export default function Panorama({ media }: { media: AuthorizedPanorama }) {
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("pannellum")
      .then(() => {
        if (cancelled || !container.current) return;
        viewer.current = window.pannellum.viewer(container.current, {
          type: "equirectangular",
          panorama: media.url,
          autoLoad: true,
          autoRotate: false,
          showControls: true,
          showFullscreenCtrl: false,
          keyboardZoom: false,
          mouseZoom: "fullscreen",
          hfov: 100,
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      viewer.current?.destroy();
      viewer.current = null;
    };
  }, [media.url]);
  return (
    <section>
      {failed ? (
        <p role="alert">
          {bi(
            "The photograph could not be opened. Use the illustrated room and its description.",
            "تعذّر فتح الصورة. يمكنك استخدام الغرفة التوضيحية ووصفها.",
          )}
        </p>
      ) : (
        <div
          ref={container}
          className="panorama-viewer"
          role="img"
          aria-label={bi(media.caption.en, media.caption.ar)}
        />
      )}
      <p>{bi(media.caption.en, media.caption.ar)}</p>
      <button
        className="button"
        onClick={() => {
          viewer.current?.setYaw(0);
          viewer.current?.setPitch(0);
          viewer.current?.setHfov(100);
        }}
      >
        {bi("Reset view", "إعادة ضبط العرض")}
      </button>
    </section>
  );
}
declare global {
  interface Window {
    pannellum: {
      viewer(container: HTMLElement, config: Record<string, unknown>): Viewer;
    };
  }
}
