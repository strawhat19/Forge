'use client';

export const forgeLoaderDoneEvent = 'forge:loader-done';
export const forgeLoaderStartEvent = 'forge:loader-start';

let done = false;
let ready = false;

export function isForgeLoaderDone() {
  return done;
}

export function isForgeLoaderReady() {
  return ready;
}

export function markForgeLoaderLoading() {
  ready = false;
  document.documentElement.classList.add('forgeLoading');
  window.dispatchEvent(new Event(forgeLoaderStartEvent));
}

export function markForgeLoaderDone() {
  if (!done) {
    done = true;
    document.documentElement.classList.add('forgeReady');
  }
  ready = true;
  document.documentElement.classList.remove('forgeLoading');
  window.dispatchEvent(new Event(forgeLoaderDoneEvent));
}
