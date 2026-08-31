/**
 * X/Twitter reads its own meta tags, so the card is re-exported from the
 * Open Graph route rather than designed twice. Change opengraph-image.tsx
 * and both previews follow.
 */
export { default, size, contentType, alt } from "./opengraph-image";
