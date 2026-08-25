'use client';

export const forgeLoaderDoneEvent = 'forge:loader-done';

let done = false;

export function isForgeLoaderDone() {
  return done;
}

export function markForgeLoaderDone() {
  if (done) return;
  done = true;
  document.documentElement.classList.add('forgeReady');
  window.dispatchEvent(new Event(forgeLoaderDoneEvent));
}
