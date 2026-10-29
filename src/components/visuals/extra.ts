import { INDUSTRY_VISUALS } from "./industries";
import { CONTENT_VISUALS } from "./content";

// Visual kinds beyond the original case-study set, keyed by name.
export const EXTRA = { ...INDUSTRY_VISUALS, ...CONTENT_VISUALS };
export type ExtraKind = keyof typeof EXTRA;
