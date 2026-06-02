# 3D studio assets

Place optional files here to upgrade the walkable room at `/room`.

| File | Purpose |
|------|---------|
| `studio.glb` | Blender room export (replaces box geometry when present) |
| `ambient.mp3` | Looped ambient audio for the studio radio |

## Blender export checklist

1. Scale: 1 Blender unit ≈ 1 meter; room should fit roughly 9m × 7m floor (see `src/room/room-config.ts`).
2. Origin at floor center; +Z forward or adjust `ROOM_GLB_TRANSFORM` in `src/constants/room-assets.ts`.
3. Export glTF 2.0 binary (`.glb`), include applied transforms, no animations required.
4. Name interactable anchor empties optionally: `monitor`, `projects`, `resume`, `radio`, `contact`, `github`, `exit` (future auto-placement).

After adding `studio.glb`, redeploy or refresh — the app probes for the file and swaps the mesh automatically.

Only **one** room renders at a time: the procedural box room is a fallback when `studio.glb` is missing or fails to load. Do not expect both to appear together.

**Regenerate the blockout GLB** (matches `DeveloperRoom.tsx`):

```bash
npm run export-room
```
