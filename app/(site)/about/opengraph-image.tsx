/**
 * Reuses the root card, which already names the person. Declaring
 * `openGraph` in the page metadata strips the inherited image, so this
 * route has to exist or a shared /about link renders with no preview.
 */
export { default, size, contentType, alt } from "../../opengraph-image";
