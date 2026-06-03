import { startRoomAmbient } from "./useRoomAmbient";

type TvAudioListener = () => void;

let tvVideo: HTMLVideoElement | null = null;
let tvAudio: HTMLAudioElement | null = null;
let volume = 0.85;
let isPlaying = false;
let audioEnabled = false;
let playRequested = false;
let playbackCompleted = false;
let audioStatus = "TV audio disabled";
const listeners = new Set<TvAudioListener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const removeTvAudio = () => {
  document
    .querySelectorAll<HTMLAudioElement>(
      'audio[src*="/room/tv-audio"], audio[src*="/room/tv.mp4"]'
    )
    .forEach((audio) => {
      audio.pause();
      audio.remove();
    });

  if (tvAudio) {
    tvAudio.pause();
    tvAudio.remove();
    tvAudio = null;
  }
};

const playRegisteredVideo = async () => {
  removeTvAudio();
  playRequested = false;
  playbackCompleted = false;
  audioEnabled = false;
  isPlaying = false;
  audioStatus = "TV audio disabled";
  notify();
};

export const playRoomTvIfRequested = () => {
  if (!playRequested || playbackCompleted) return;
  void playRegisteredVideo();
};

export const subscribeRoomTvAudio = (listener: TvAudioListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getRoomTvPlaying = () => isPlaying;

export const getRoomTvVolume = () => volume;

export const getRoomTvAudioEnabled = () => audioEnabled;

export const getRoomTvAudioStatus = () => audioStatus;

export const getRoomTvPlaybackCompleted = () => playbackCompleted;

export const registerRoomTvVideo = (video: HTMLVideoElement | null) => {
  tvVideo = video;
  if (tvVideo) {
    tvVideo.loop = false;
    tvVideo.volume = volume;
    tvVideo.defaultMuted = true;
    tvVideo.muted = true;
    if (playbackCompleted && Number.isFinite(tvVideo.duration) && tvVideo.duration > 0) {
      tvVideo.currentTime = Math.max(0, tvVideo.duration - 0.05);
    }
    if (playRequested && !playbackCompleted) {
      void playRegisteredVideo();
    }
  }
  notify();
};

export const setRoomTvVolume = (nextVolume: number) => {
  volume = Math.min(1, Math.max(0, nextVolume));
  if (tvVideo) tvVideo.volume = volume;
  if (tvAudio) tvAudio.volume = volume;
  notify();
};

export const syncRoomTvMediaClock = () => {
  if (!tvVideo) return;
  tvVideo.defaultMuted = true;
  tvVideo.muted = true;
};

export const finishRoomTvPlayback = () => {
  if (tvVideo) {
    tvVideo.pause();
    tvVideo.playbackRate = 1;
    if (Number.isFinite(tvVideo.duration) && tvVideo.duration > 0) {
      tvVideo.currentTime = Math.max(0, tvVideo.duration - 0.05);
    }
  }
  removeTvAudio();

  playbackCompleted = true;
  playRequested = false;
  audioEnabled = false;
  isPlaying = false;
  notify();
  void startRoomAmbient().catch(() => undefined);
};

export const startRoomTvAudio = async () => {
  await playRegisteredVideo();
};

export const stopRoomTvAudio = () => {
  playRequested = false;
  if (tvVideo) {
    tvVideo.currentTime = 0;
    tvVideo.defaultMuted = true;
    tvVideo.muted = true;
    tvVideo.playbackRate = 1;
  }
  removeTvAudio();
  playbackCompleted = false;
  audioEnabled = false;
  isPlaying = false;
  audioStatus = "TV audio disabled";
  notify();
};

export const toggleRoomTvAudio = () => {
  stopRoomTvAudio();
};

export const syncRoomTvPlaying = (playing: boolean) => {
  if (playbackCompleted) return;
  if (isPlaying === playing) return;
  isPlaying = playing;
  if (!playing && playRequested) audioEnabled = false;
  notify();
};
