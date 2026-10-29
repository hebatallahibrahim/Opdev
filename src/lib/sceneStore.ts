// Shared, mutable state read by the WebGL scene every frame.
// Written by scroll triggers and pointer listeners; never triggers React renders.
export const sceneStore = {
  // 0 = hero ring, 1 = Build, 2 = Execute, 3 = Grow, 4 = ring again (final CTA)
  progress: 0,
  pointer: { x: 0, y: 0 },
  intro: 0,
  // True once every glass shader has compiled and drawn a few frames.
  ready: false,
  introPlayed: false,
};

const introListeners = new Set<() => void>();

// Run `cb` when the preloader hands over to the page (immediately if it already has).
export function onIntro(cb: () => void) {
  if (sceneStore.introPlayed) {
    cb();
    return () => {};
  }
  introListeners.add(cb);
  return () => {
    introListeners.delete(cb);
  };
}

export function playIntro() {
  sceneStore.introPlayed = true;
  introListeners.forEach((cb) => cb());
  introListeners.clear();
}
