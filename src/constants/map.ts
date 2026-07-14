import type { StyleSpecification } from "maplibre-gl";
import { serviceAreaConfig } from "@/constants/service-area";
import { geoapifyConfig } from "@/lib/geoapify";
import type { MapProvider } from "@/types/map";

const defaultDarkTileUrl =
  "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png";
// Apple-Maps-style light basemap. CARTO already renders roads, buildings,
// parks, water and labels with the right hierarchy of greys and soft colours
// — we just dial saturation and contrast a touch so it reads at home next
// to the off-white SkySend cards.
const defaultLightTileUrl =
  "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png";
const defaultGeocodingUrl = "https://nominatim.openstreetmap.org/search";
const defaultAutocompleteUrl = "https://nominatim.openstreetmap.org/search";

function pickFallbackTileUrl(theme: "dark" | "light"): string {
  if (process.env.NEXT_PUBLIC_MAP_TILE_URL) {
    return process.env.NEXT_PUBLIC_MAP_TILE_URL;
  }
  return theme === "light" ? defaultLightTileUrl : defaultDarkTileUrl;
}

const preferredMapProvider: MapProvider = geoapifyConfig.hasApiKey
  ? "geoapify"
  : process.env.NEXT_PUBLIC_MAP_PROVIDER === "openstreetmap"
    ? "openstreetmap"
    : "custom";

export const mapConfig = {
  provider: preferredMapProvider,
  geoapifyApiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
  publicToken: process.env.NEXT_PUBLIC_MAP_PUBLIC_TOKEN,
  styleUrl: geoapifyConfig.styleUrl,
  geocodingUrl:
    process.env.NEXT_PUBLIC_MAP_GEOCODING_URL ??
    geoapifyConfig.forwardGeocodingBaseUrl ??
    defaultGeocodingUrl,
  autocompleteUrl:
    geoapifyConfig.autocompleteBaseUrl ?? defaultAutocompleteUrl,
  reverseGeocodingUrl: geoapifyConfig.reverseGeocodingBaseUrl,
  defaultCenter: serviceAreaConfig.center,
  defaultZoom: 12.8,
  minZoom: 10,
  maxZoom: 18,
  maxPitch: 0,
  supportsPointSelection: true,
  supportsAutocomplete: geoapifyConfig.hasApiKey,
  attribution:
    preferredMapProvider === "geoapify"
      ? "(c) Geoapify, DeschideMapTiles, DeschideStreetMap contributors"
      : "(c) DeschideStreetMap contributors, (c) CARTO",
} as const;

/**
 * Build the raster style for a given theme.
 *
 * Dark: original SkySend look (near-black background, desaturated).
 * Light: a real Apple-Maps-style basemap — roads are dark grey, buildings
 * are lighter grey, parks a soft green, water a soft blue, all over an
 * off-white surface. Coloured layers come straight from CARTO Light All so
 * every element reads on its own, no CSS invert needed.
 */
export function buildFallbackMapStyle(theme: "dark" | "light"): StyleSpecification {
  const tileUrl = pickFallbackTileUrl(theme);
  if (theme === "light") {
    return {
      version: 8,
      sources: {
        "skysend-raster-tiles": {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: mapConfig.attribution,
        },
      },
      layers: [
        {
          id: "skysend-background",
          type: "background",
          paint: {
            // Off-white surface so the map blends with the SkySend card.
            "background-color": "#eef2f6",
          },
        },
        {
          id: "skysend-raster-layer",
          type: "raster",
          source: "skysend-raster-tiles",
          paint: {
            "raster-opacity": 1,
            // Native CARTO tones are already close to Apple Maps; lift
            // saturation a touch so parks/water show their colour, trim
            // contrast so the off-white surface reads calm.
            "raster-brightness-min": 0.78,
            "raster-brightness-max": 1.04,
            "raster-saturation": 0.18,
            "raster-contrast": 0.06,
          },
        },
      ],
    };
  }

  return {
    version: 8,
    sources: {
      "skysend-raster-tiles": {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
        attribution: mapConfig.attribution,
      },
    },
    layers: [
      {
        id: "skysend-background",
        type: "background",
        paint: {
          "background-color": "#151719",
        },
      },
      {
        id: "skysend-raster-layer",
        type: "raster",
        source: "skysend-raster-tiles",
        paint: {
          "raster-opacity": 1,
          "raster-brightness-min": 0.18,
          "raster-brightness-max": 1.06,
          "raster-saturation": -0.18,
          "raster-contrast": 0.18,
        },
      },
    ],
  };
}

/**
 * Backwards-compatible dark default for any code path that still expects
 * the historical `fallbackMapStyle` export.
 */
export const fallbackMapStyle: StyleSpecification = buildFallbackMapStyle("dark");

/**
 * Default style is whichever the Geoapify style URL points to when one is
 * configured; otherwise the dark raster fallback so first paint matches the
 * historical behaviour on the public site.
 */
export const defaultMapStyle: StyleSpecification | string =
  mapConfig.styleUrl ?? fallbackMapStyle;

/**
 * Theme-aware variant for the map container — picks the matching raster
 * style at mount time so each theme gets its own basemap. Runtime theme
 * switches are intentionally not handled here; the map reloads when its
 * owning view changes (or the user reloads).
 */
export function getFallbackMapStyleForTheme(
  theme: "dark" | "light",
): StyleSpecification {
  return buildFallbackMapStyle(theme);
}