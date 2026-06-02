import { ROOM_AMBIENT_PATH } from "@/constants/room-assets";

type AmbientListener = () => void;

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let noiseSource: AudioBufferSourceNode | null = null;
let humOscillator: OscillatorNode | null = null;
let fileAudio: HTMLAudioElement | null = null;
let isPlaying = false;
let volume = 0.35;
const listeners = new Set<AmbientListener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeRoomAmbient = (listener: AmbientListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getRoomAmbientPlaying = () => isPlaying;

export const getRoomAmbientVolume = () => volume;

export const setRoomAmbientVolume = (nextVolume: number) => {
  volume = Math.min(1, Math.max(0, nextVolume));
  if (fileAudio) fileAudio.volume = volume;
  if (masterGain) masterGain.gain.value = volume * 0.32;
  notify();
};

const stopProceduralNodes = () => {
  try {
    noiseSource?.stop();
  } catch {
    /* already stopped */
  }
  try {
    humOscillator?.stop();
  } catch {
    /* already stopped */
  }
  noiseSource = null;
  humOscillator = null;
};

const startProceduralAmbient = async () => {
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 2;
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const channel = buffer.getChannelData(0);
  let lastOut = 0;

  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    channel[i] = lastOut * 3.2;
  }

  masterGain = audioContext.createGain();
  masterGain.gain.value = volume * 0.32;

  const lowPass = audioContext.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.value = 380;

  noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;
  noiseSource.connect(lowPass);
  lowPass.connect(masterGain);

  humOscillator = audioContext.createOscillator();
  humOscillator.type = "sine";
  humOscillator.frequency.value = 58;
  const humGain = audioContext.createGain();
  humGain.gain.value = 0.018;
  humOscillator.connect(humGain);
  humGain.connect(masterGain);

  masterGain.connect(audioContext.destination);
  noiseSource.start();
  humOscillator.start();
};

const ambientFileExists = async () => {
  try {
    const response = await fetch(ROOM_AMBIENT_PATH, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

const startFileAmbient = async () => {
  if (!(await ambientFileExists())) {
    throw new Error("Ambient file missing");
  }

  fileAudio ??= new Audio(ROOM_AMBIENT_PATH);
  fileAudio.loop = true;
  fileAudio.volume = volume;
  await fileAudio.play();
};

export const stopRoomAmbient = () => {
  if (fileAudio) {
    fileAudio.pause();
    fileAudio.currentTime = 0;
  }

  stopProceduralNodes();

  if (masterGain) {
    try {
      masterGain.disconnect();
    } catch {
      /* already disconnected */
    }
    masterGain = null;
  }

  if (audioContext && audioContext.state !== "closed") {
    void audioContext.close().catch(() => undefined);
  }
  audioContext = null;

  isPlaying = false;
  notify();
};

/** Start studio ambience (requires a recent user gesture in most browsers). */
export const startRoomAmbient = async () => {
  if (isPlaying) return;

  try {
    await startFileAmbient();
  } catch {
    await startProceduralAmbient();
  }

  isPlaying = true;
  notify();
};

export const toggleRoomAmbient = () => {
  if (isPlaying) {
    stopRoomAmbient();
    return;
  }
  void startRoomAmbient();
};
