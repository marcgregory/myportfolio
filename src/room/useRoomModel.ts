import { ROOM_GLB_PATH } from "@/constants/room-assets";
import { useEffect, useState } from "react";

/** glTF binary magic: ASCII "glTF" as little-endian uint32 */
const GLB_MAGIC = 0x46546c67;

const hasGlbMagic = (buffer: ArrayBuffer) => {
  if (buffer.byteLength < 4) return false;
  return new DataView(buffer).getUint32(0, true) === GLB_MAGIC;
};

/**
 * Probes whether a real GLB exists at `public/room/studio.glb`.
 * HEAD/200 alone is unreliable — SPA hosts return index.html for missing assets.
 */
export const probeRoomGlbAvailable = async (): Promise<boolean> => {
  try {
    const ranged = await fetch(ROOM_GLB_PATH, {
      headers: { Range: "bytes=0-11" },
    });

    if (ranged.status === 206) {
      return hasGlbMagic(await ranged.arrayBuffer());
    }

    if (!ranged.ok) return false;

    const contentType = ranged.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) return false;

    const buffer = await ranged.arrayBuffer();
    if (buffer.byteLength > 64 * 1024 && !hasGlbMagic(buffer.slice(0, 12))) {
      return false;
    }

    return hasGlbMagic(buffer.byteLength > 12 ? buffer.slice(0, 12) : buffer);
  } catch {
    return false;
  }
};

/** `null` while checking, then whether `public/room/studio.glb` is a real GLB. */
export const useRoomModelAvailable = () => {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    void probeRoomGlbAvailable().then((exists) => {
      if (!cancelled) setAvailable(exists);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return available;
};
