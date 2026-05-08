import { create } from 'zustand';
import type { BaseItemDto, PlayState } from '../api/types';
import { RepeatMode } from '../api/types';

interface PlaybackState {
  currentItem: BaseItemDto | null;
  playState: PlayState | null;
  isPlaying: boolean;
  isPaused: boolean;
  positionTicks: number;
  durationTicks: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  queue: BaseItemDto[];
  setCurrentItem: (item: BaseItemDto | null) => void;
  setPlayState: (state: PlayState | null) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setPosition: (ticks: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  addToQueue: (item: BaseItemDto) => void;
  removeFromQueue: (itemId: string) => void;
  clearQueue: () => void;
}

export const usePlaybackStore = create<PlaybackState>()((set) => ({
  currentItem: null,
  playState: null,
  isPlaying: false,
  isPaused: false,
  positionTicks: 0,
  durationTicks: 0,
  volume: 100,
  isMuted: false,
  repeatMode: RepeatMode.RepeatNone,
  queue: [],
  setCurrentItem: (item) => set({ currentItem: item }),
  setPlayState: (state) =>
    set({
      playState: state,
      isPlaying: state?.IsPaused === false,
      isPaused: state?.IsPaused === true,
      positionTicks: state?.PositionTicks || 0
    }),
  play: () => set({ isPlaying: true, isPaused: false }),
  pause: () => set({ isPlaying: false, isPaused: true }),
  stop: () =>
    set({
      isPlaying: false,
      isPaused: false,
      currentItem: null,
      positionTicks: 0
    }),
  setPosition: (ticks) => set({ positionTicks: ticks }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  addToQueue: (item) => set((state) => ({ queue: [...state.queue, item] })),
  removeFromQueue: (itemId) =>
    set((state) => ({ queue: state.queue.filter((i) => i.Id !== itemId) })),
  clearQueue: () => set({ queue: [] })
}));
