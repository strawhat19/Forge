export const forgeGaussianBlurRequestEvent = 'forge:gaussian-blur-request';
export const forgeGaussianBlurDismissEvent = 'forge:gaussian-blur-dismiss';

export type GaussianBlurRequest = {
  open: boolean;
  source: string;
  strength?: number;
};

export function setGaussianBlurOverlay(
  open: boolean,
  source = 'default',
  strength = 18,
) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent<GaussianBlurRequest>(forgeGaussianBlurRequestEvent, {
    detail: { open, source, strength },
  }));
}

export function showGaussianBlurOverlay(source = 'default', strength = 18) {
  setGaussianBlurOverlay(true, source, strength);
}

export function hideGaussianBlurOverlay(source = 'default') {
  setGaussianBlurOverlay(false, source);
}
