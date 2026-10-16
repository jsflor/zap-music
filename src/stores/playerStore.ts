import { create } from "zustand";
import { Track, RepeatMode } from "../types/music";
import { audioEngine, PlaybackStatus } from "../services/audioEngine";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackStatus: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;

  // Queue & History
  queue: Track[];
  queueIndex: number;
  history: Track[];

  // UI state
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isMiniPlayer: boolean;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;

  // Queue manipulation
  reorderQueue: (startIndex: number, endIndex: number) => void;
  removeFromQueue: (index: number) => void;
  addToQueue: (tracks: Track[]) => void;
  playNext: (track: Track) => void;
  clearQueue: () => void;

  // UI toggles
  toggleLyrics: () => void;
  toggleQueue: () => void;
  toggleMiniPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Bind audio engine callbacks
  audioEngine.setCallbacks({
    onTimeUpdate: (currentTime) => set({ currentTime }),
    onDurationChange: (duration) => set({ duration }),
    onStatusChange: (playbackStatus) =>
      set({
        playbackStatus,
        isPlaying: playbackStatus === "playing",
      }),
    onEnded: () => {
      const { repeatMode, nextTrack, currentTrack } = get();
      if (repeatMode === "one" && currentTrack) {
        audioEngine.seek(0);
        audioEngine.play();
      } else {
        nextTrack();
      }
    },
    onError: (err) => {
      console.error("Audio Engine Error:", err);
      set({ isPlaying: false, playbackStatus: "error" });
    },
  });

  return {
    currentTrack: null,
    isPlaying: false,
    playbackStatus: "idle",
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    repeatMode: "off",
    isShuffled: false,

    queue: [],
    queueIndex: -1,
    history: [],

    isLyricsOpen: false,
    isQueueOpen: false,
    isMiniPlayer: false,

    playTrack: async (track: Track, newQueue?: Track[]) => {
      const state = get();
      const nextQueue = newQueue || (state.queue.length > 0 ? state.queue : [track]);
      let index = nextQueue.findIndex((t) => t.id === track.id);
      if (index === -1) {
        nextQueue.push(track);
        index = nextQueue.length - 1;
      }

      const nextHistory = state.currentTrack
        ? [state.currentTrack, ...state.history.slice(0, 49)]
        : state.history;

      set({
        currentTrack: track,
        queue: nextQueue,
        queueIndex: index,
        history: nextHistory,
        currentTime: 0,
        duration: track.duration || 0,
      });

      await audioEngine.load(track.streamUrl);
      await audioEngine.play();

      // Update MediaSession if supported
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: track.album,
          artwork: track.artworkUrl
            ? [{ src: track.artworkUrl, sizes: "512x512", type: "image/png" }]
            : [],
        });
      }
    },

    togglePlay: () => {
      const { isPlaying, currentTrack, resume, pause } = get();
      if (!currentTrack) return;
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    },

    pause: () => {
      audioEngine.pause();
      set({ isPlaying: false, playbackStatus: "paused" });
    },

    resume: () => {
      audioEngine.play().catch(console.error);
      set({ isPlaying: true, playbackStatus: "playing" });
    },

    nextTrack: () => {
      const { queue, queueIndex, repeatMode, isShuffled } = get();
      if (queue.length === 0) return;

      let nextIndex = queueIndex + 1;
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          audioEngine.pause();
          set({ isPlaying: false, playbackStatus: "idle", currentTime: 0 });
          return;
        }
      }

      const nextTrackItem = queue[nextIndex];
      if (nextTrackItem) {
        get().playTrack(nextTrackItem, queue);
      }
    },

    prevTrack: () => {
      const { queue, queueIndex, currentTime } = get();
      if (currentTime > 3) {
        audioEngine.seek(0);
        set({ currentTime: 0 });
        return;
      }

      if (queue.length === 0) return;
      const prevIndex = queueIndex - 1;
      if (prevIndex >= 0) {
        const prevTrackItem = queue[prevIndex];
        get().playTrack(prevTrackItem, queue);
      } else {
        audioEngine.seek(0);
      }
    },

    seek: (seconds: number) => {
      audioEngine.seek(seconds);
      set({ currentTime: seconds });
    },

    setVolume: (volume: number) => {
      audioEngine.setVolume(volume);
      set({ volume, isMuted: volume === 0 });
    },

    toggleMute: () => {
      const isMuted = audioEngine.toggleMute();
      set({ isMuted });
    },

    toggleRepeat: () => {
      const { repeatMode } = get();
      const modes: RepeatMode[] = ["off", "all", "one"];
      const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
      set({ repeatMode: next });
    },

    toggleShuffle: () => {
      set((state) => ({ isShuffled: !state.isShuffled }));
    },

    reorderQueue: (startIndex: number, endIndex: number) => {
      set((state) => {
        const nextQueue = [...state.queue];
        const [moved] = nextQueue.splice(startIndex, 1);
        nextQueue.splice(endIndex, 0, moved);
        return { queue: nextQueue };
      });
    },

    removeFromQueue: (index: number) => {
      set((state) => {
        const nextQueue = state.queue.filter((_, i) => i !== index);
        let nextIndex = state.queueIndex;
        if (index < state.queueIndex) {
          nextIndex--;
        } else if (index === state.queueIndex) {
          nextIndex = Math.min(nextIndex, nextQueue.length - 1);
        }
        return { queue: nextQueue, queueIndex: nextIndex };
      });
    },

    addToQueue: (tracks: Track[]) => {
      set((state) => ({ queue: [...state.queue, ...tracks] }));
    },

    playNext: (track: Track) => {
      set((state) => {
        const nextQueue = [...state.queue];
        nextQueue.splice(state.queueIndex + 1, 0, track);
        return { queue: nextQueue };
      });
    },

    clearQueue: () => {
      set({ queue: [], queueIndex: -1 });
    },

    toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),
    toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
    toggleMiniPlayer: () => set((state) => ({ isMiniPlayer: !state.isMiniPlayer })),
  };
});
