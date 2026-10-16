import { usePlayerStore } from "../stores/playerStore";

export function initMediaControls(): () => void {
  if (!("mediaSession" in navigator)) {
    return () => {};
  }

  const handlePlay = () => {
    usePlayerStore.getState().resume();
  };

  const handlePause = () => {
    usePlayerStore.getState().pause();
  };

  const handlePreviousTrack = () => {
    usePlayerStore.getState().prevTrack();
  };

  const handleNextTrack = () => {
    usePlayerStore.getState().nextTrack();
  };

  const handleSeekTo = (details: MediaSessionActionDetails) => {
    if (typeof details.seekTime === "number") {
      usePlayerStore.getState().seek(details.seekTime);
    }
  };

  const handleSeekBackward = (details: MediaSessionActionDetails) => {
    const offset = details.seekOffset || 10;
    const current = usePlayerStore.getState().currentTime;
    usePlayerStore.getState().seek(Math.max(0, current - offset));
  };

  const handleSeekForward = (details: MediaSessionActionDetails) => {
    const offset = details.seekOffset || 10;
    const current = usePlayerStore.getState().currentTime;
    const duration = usePlayerStore.getState().duration;
    usePlayerStore.getState().seek(Math.min(duration, current + offset));
  };

  try {
    navigator.mediaSession.setActionHandler("play", handlePlay);
    navigator.mediaSession.setActionHandler("pause", handlePause);
    navigator.mediaSession.setActionHandler("previoustrack", handlePreviousTrack);
    navigator.mediaSession.setActionHandler("nexttrack", handleNextTrack);
    navigator.mediaSession.setActionHandler("seekto", handleSeekTo);
    navigator.mediaSession.setActionHandler("seekbackward", handleSeekBackward);
    navigator.mediaSession.setActionHandler("seekforward", handleSeekForward);
  } catch (err) {
    console.warn("MediaSession action handler error:", err);
  }

  // Subscribe to playback status to update playbackState
  const unsubscribe = usePlayerStore.subscribe((state) => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = state.isPlaying ? "playing" : "paused";
      if (
        "setPositionState" in navigator.mediaSession &&
        isFinite(state.duration) &&
        state.duration > 0 &&
        isFinite(state.currentTime)
      ) {
        try {
          navigator.mediaSession.setPositionState({
            duration: state.duration,
            playbackRate: 1.0,
            position: Math.min(state.currentTime, state.duration),
          });
        } catch {
          // Ignore transient position state bounds issues during transitions
        }
      }
    }
  });

  return () => {
    unsubscribe();
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("seekto", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
    }
  };
}
