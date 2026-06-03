import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  ROOM_TV_LOCAL_PATH,
  ROOM_TV_STREAM_PLAYLIST,
} from "@/constants/room-assets";
import {
  finishRoomTvPlayback,
  registerRoomTvVideo,
  syncRoomTvMediaClock,
  stopRoomTvAudio,
  syncRoomTvPlaying,
} from "./room-tv-audio";

type TvVideoScreenProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  emissive?: string;
  emissiveIntensity?: number;
};

type TvSource = "local" | "remote";

const coverDrawRect = (
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) => {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const width = sourceHeight * targetRatio;
    return {
      sx: (sourceWidth - width) / 2,
      sy: 0,
      sw: width,
      sh: sourceHeight,
    };
  }

  const height = sourceWidth / targetRatio;
  return {
    sx: 0,
    sy: (sourceHeight - height) / 2,
    sw: sourceWidth,
    sh: height,
  };
};

const drawTvOverlay = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  channel: number,
  localClip: boolean
) => {
  ctx.clearRect(0, 0, w, h);

  const pad = Math.floor(w * 0.025);
  ctx.fillStyle = "rgba(220, 38, 38, 0.92)";
  ctx.fillRect(pad, pad, Math.floor(w * 0.1), Math.floor(h * 0.08));
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${Math.floor(h * 0.045)}px Segoe UI, sans-serif`;
  ctx.fillText("LIVE", pad + 8, pad + Math.floor(h * 0.055));

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(w - pad - Math.floor(w * 0.14), pad, Math.floor(w * 0.14), Math.floor(h * 0.08));
  ctx.fillStyle = "#f8fafc";
  ctx.font = `600 ${Math.floor(h * 0.05)}px Segoe UI, sans-serif`;
  ctx.fillText(`CH ${channel}`, w - pad - Math.floor(w * 0.12), pad + Math.floor(h * 0.055));

  const tickerY = h - Math.floor(h * 0.1);
  ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
  ctx.fillRect(0, tickerY, w, Math.floor(h * 0.1));
  ctx.fillStyle = "#fbbf24";
  ctx.font = `600 ${Math.floor(h * 0.038)}px Segoe UI, sans-serif`;
  ctx.fillText("BREAKING", pad, tickerY + Math.floor(h * 0.045));
  ctx.fillStyle = "#e2e8f0";
  ctx.font = `500 ${Math.floor(h * 0.038)}px Segoe UI, sans-serif`;
  const headline = localClip
    ? "Studio TV — playing tv.mp4 · "
    : "Studio TV — now playing open-source shorts & classic demo reels · ";
  const scroll = (t * 48) % (headline.length * 12);
  ctx.fillText(headline + headline, pad + Math.floor(w * 0.12) - scroll, tickerY + Math.floor(h * 0.045));

  ctx.fillStyle = "rgba(255,255,255,0.035)";
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }
};

const TvVideoScreen = ({
  position,
  rotation = [0, 0, 0],
  size,
  emissive = "#ffffff",
  emissiveIntensity = 0.35,
}: TvVideoScreenProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clipIndex, setClipIndex] = useState(0);
  const [source, setSource] = useState<TvSource>("local");
  const channel = (clipIndex % 12) + 3;

  const video = useMemo(() => {
    const el = document.createElement("video");
    el.playsInline = true;
    el.preload = "auto";
    el.loop = false;
    videoRef.current = el;
    return el;
  }, []);

  const overlayTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    overlayCanvasRef.current = canvas;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const compositeTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    compositeCanvasRef.current = compositeTexture.image as HTMLCanvasElement;
  }, [compositeTexture]);

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.src) return;
    if (source === "local") {
      return;
    }
    el.muted = true;
    void el.play().catch(() => undefined);
  }, [source]);

  useEffect(() => {
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;
    Object.assign(video.style, {
      height: "1px",
      left: "-9999px",
      opacity: "0",
      pointerEvents: "none",
      position: "fixed",
      top: "0",
      width: "1px",
    });
    document.body.appendChild(video);
    registerRoomTvVideo(video);
    return () => {
      registerRoomTvVideo(null);
      video.remove();
    };
  }, [video]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (source === "local") {
      el.removeAttribute("crossorigin");
      el.loop = false;
      el.defaultMuted = true;
      el.muted = true;
      el.src = ROOM_TV_LOCAL_PATH;
    } else {
      el.crossOrigin = "anonymous";
      el.loop = false;
      el.defaultMuted = true;
      el.muted = true;
      el.src =
        ROOM_TV_STREAM_PLAYLIST[clipIndex % ROOM_TV_STREAM_PLAYLIST.length];
    }

    el.load();
    el.defaultMuted = true;
    el.muted = true;
    void el.play().catch(() => undefined);
  }, [clipIndex, source]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onLocalError = () => {
      setSource("remote");
    };

    const onPlay = () => syncRoomTvPlaying(true);
    const onPause = () => syncRoomTvPlaying(false);

    const onEnded = () => {
      if (source === "local") {
        finishRoomTvPlayback();
        return;
      }
      setClipIndex((current) => current + 1);
    };

    if (source === "local") {
      el.addEventListener("error", onLocalError);
    }
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("error", onLocalError);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [source]);

  useEffect(() => {
    const onPointerDown = () => tryPlay();
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [tryPlay]);

  useEffect(
    () => () => {
      stopRoomTvAudio();
      video.removeAttribute("src");
      overlayTexture.dispose();
      compositeTexture.dispose();
    },
    [compositeTexture, overlayTexture, video]
  );

  useFrame(({ clock }) => {
    syncRoomTvMediaClock();

    const composite = compositeCanvasRef.current;
    const overlay = overlayCanvasRef.current;
    const el = videoRef.current;
    if (!composite || !overlay) return;

    const ctx = composite.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, composite.width, composite.height);

    if (el && el.readyState >= 2 && el.videoWidth > 0 && el.videoHeight > 0) {
      const rect = coverDrawRect(
        el.videoWidth,
        el.videoHeight,
        composite.width,
        composite.height
      );
      ctx.drawImage(
        el,
        rect.sx,
        rect.sy,
        rect.sw,
        rect.sh,
        0,
        0,
        composite.width,
        composite.height
      );
    }

    drawTvOverlay(
      overlayCtx,
      overlay.width,
      overlay.height,
      clock.elapsedTime,
      channel,
      source === "local"
    );
    ctx.drawImage(overlay, 0, 0);

    compositeTexture.needsUpdate = true;
  });

  return (
    <mesh position={position} rotation={rotation} renderOrder={20}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={compositeTexture}
        emissiveMap={compositeTexture}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.32}
        metalness={0.04}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
        toneMapped={false}
      />
    </mesh>
  );
};

export default TvVideoScreen;
