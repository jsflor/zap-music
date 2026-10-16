import { describe, it, expect, beforeEach, vi } from "vitest";
import { usePlayerStore } from "../stores/playerStore";
import { Track } from "../types/music";

describe("PlayerStore", () => {
  const mockTrack1: Track = {
    id: "track-1",
    title: "Track One",
    artist: "Artist One",
    album: "Album One",
    duration: 180,
    streamUrl: "http://example.com/1.mp3",
    sourceType: "local",
    sourceId: "local-1",
  };

  const mockTrack2: Track = {
    id: "track-2",
    title: "Track Two",
    artist: "Artist Two",
    album: "Album Two",
    duration: 200,
    streamUrl: "http://example.com/2.mp3",
    sourceType: "local",
    sourceId: "local-1",
  };

  const mockTrack3: Track = {
    id: "track-3",
    title: "Track Three",
    artist: "Artist Three",
    album: "Album Three",
    duration: 220,
    streamUrl: "http://example.com/3.mp3",
    sourceType: "local",
    sourceId: "local-1",
  };

  beforeEach(() => {
    // Reset Zustand store state
    usePlayerStore.setState({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      queue: [],
      queueIndex: -1,
      history: [],
      repeatMode: "off",
      isShuffled: false,
      volume: 0.8,
      isMuted: false,
    });
  });

  it("should initialize with default states", () => {
    const state = usePlayerStore.getState();
    expect(state.currentTrack).toBeNull();
    expect(state.isPlaying).toBe(false);
    expect(state.volume).toBe(0.8);
    expect(state.repeatMode).toBe("off");
  });

  it("should play track and build queue correctly", async () => {
    // Mock audio play to avoid real network calls in test runner
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();

    await usePlayerStore.getState().playTrack(mockTrack1, [mockTrack1, mockTrack2]);

    const state = usePlayerStore.getState();
    expect(state.currentTrack?.id).toBe("track-1");
    expect(state.queue).toHaveLength(2);
    expect(state.queueIndex).toBe(0);
    expect(state.duration).toBe(180);
  });

  it("should advance to next track when nextTrack is called", async () => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();

    await usePlayerStore.getState().playTrack(mockTrack1, [mockTrack1, mockTrack2, mockTrack3]);
    usePlayerStore.getState().nextTrack();

    const state = usePlayerStore.getState();
    expect(state.currentTrack?.id).toBe("track-2");
    expect(state.queueIndex).toBe(1);
  });

  it("should reorder queue properly", () => {
    usePlayerStore.setState({
      queue: [mockTrack1, mockTrack2, mockTrack3],
      queueIndex: 0,
    });

    usePlayerStore.getState().reorderQueue(0, 2);
    const updatedQueue = usePlayerStore.getState().queue;
    expect(updatedQueue[0].id).toBe("track-2");
    expect(updatedQueue[1].id).toBe("track-3");
    expect(updatedQueue[2].id).toBe("track-1");
  });

  it("should toggle repeat mode between off, all, and one", () => {
    expect(usePlayerStore.getState().repeatMode).toBe("off");
    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe("all");
    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe("one");
    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe("off");
  });

  it("should toggle shuffle state", () => {
    expect(usePlayerStore.getState().isShuffled).toBe(false);
    usePlayerStore.getState().toggleShuffle();
    expect(usePlayerStore.getState().isShuffled).toBe(true);
  });
});
