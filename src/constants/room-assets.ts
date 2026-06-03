/** Drop `studio.glb` from Blender into `public/room/` to replace procedural boxes. */
export const ROOM_GLB_PATH = "/room/studio.glb" as const;

/** Optional loop — add `ambient.mp3` to `public/room/` (falls back to procedural hum). */
export const ROOM_AMBIENT_PATH = "/room/ambient.mp3" as const;

/** Optional local clip — add `tv.mp4` to `public/room/` to override the stream. */
export const ROOM_TV_LOCAL_PATH = "/room/tv.mp4?v=audio-20260603" as const;

/** Dedicated TV audio track used by the room sound system. */
export const ROOM_TV_AUDIO_PATH = "/room/tv-audio.mp3?v=audio-20260603" as const;

/** Fallback playlist — real short films & promos (public domain / Google sample bucket). */
export const ROOM_TV_STREAM_PLAYLIST = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
] as const;

export const ROOM_GLB_TRANSFORM = {
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 1,
} as const;
