export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";

export interface AudioEngineCallbacks {
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
  onError: (err: string) => void;
  onStatusChange: (status: PlaybackStatus) => void;
}

export class WebAudioPlayer {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private callbacks: Partial<AudioEngineCallbacks> = {};
  private currentStatus: PlaybackStatus = "idle";
  private previousVolume: number = 0.8;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = "auto";
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener("timeupdate", () => {
      this.callbacks.onTimeUpdate?.(this.audio.currentTime);
    });

    this.audio.addEventListener("loadedmetadata", () => {
      if (this.audio.duration && isFinite(this.audio.duration) && this.audio.duration > 0) {
        this.callbacks.onDurationChange?.(this.audio.duration);
      }
    });

    this.audio.addEventListener("durationchange", () => {
      if (this.audio.duration && isFinite(this.audio.duration) && this.audio.duration > 0) {
        this.callbacks.onDurationChange?.(this.audio.duration);
      }
    });

    this.audio.addEventListener("ended", () => {
      this.setStatus("idle");
      this.callbacks.onEnded?.();
    });

    this.audio.addEventListener("waiting", () => {
      this.setStatus("loading");
    });

    this.audio.addEventListener("playing", () => {
      this.setStatus("playing");
    });

    this.audio.addEventListener("pause", () => {
      if (this.audio.currentTime < this.audio.duration) {
        this.setStatus("paused");
      }
    });

    this.audio.addEventListener("error", () => {
      const err = this.audio.error?.message || "Audio playback error";
      this.setStatus("error");
      this.callbacks.onError?.(err);
    });
  }

  private setStatus(status: PlaybackStatus) {
    this.currentStatus = status;
    this.callbacks.onStatusChange?.(status);
  }

  private initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
      }
    }
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  public setCallbacks(callbacks: Partial<AudioEngineCallbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public async load(src: string): Promise<void> {
    this.setStatus("loading");
    this.audio.src = src;
    this.audio.load();
  }

  public async play(): Promise<void> {
    this.initAudioContext();
    try {
      await this.audio.play();
      this.setStatus("playing");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setStatus("error");
      this.callbacks.onError?.(msg);
      throw err;
    }
  }

  public pause(): void {
    this.audio.pause();
    this.setStatus("paused");
  }

  public seek(seconds: number): void {
    if (isFinite(seconds) && seconds >= 0) {
      this.audio.currentTime = seconds;
      this.callbacks.onTimeUpdate?.(seconds);
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
    if (this.gainNode) {
      this.gainNode.gain.value = clamped;
    }
    if (clamped > 0) {
      this.previousVolume = clamped;
    }
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
    if (muted) {
      if (this.gainNode) this.gainNode.gain.value = 0;
    } else {
      if (this.gainNode) this.gainNode.gain.value = this.audio.volume;
    }
  }

  public toggleMute(): boolean {
    const nextMuted = !this.audio.muted;
    this.setMuted(nextMuted);
    if (!nextMuted && this.audio.volume === 0) {
      this.setVolume(this.previousVolume || 0.8);
    }
    return nextMuted;
  }

  public getDuration(): number {
    return this.audio.duration || 0;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  public getStatus(): PlaybackStatus {
    return this.currentStatus;
  }

  public destroy(): void {
    this.audio.pause();
    this.audio.src = "";
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Global audio engine singleton
export const audioEngine = new WebAudioPlayer();
