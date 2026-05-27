import { DESIGN_TOKEN_CONTRACT } from './design-token-contract';

export const CORE_TOKENS = DESIGN_TOKEN_CONTRACT.core;
export const COMPONENT_TOKENS = DESIGN_TOKEN_CONTRACT.components;
export const LAYOUT_TOKENS = DESIGN_TOKEN_CONTRACT.layout;
export const STATE_TOKENS = DESIGN_TOKEN_CONTRACT.state;
export const CONVERSION_TOKENS = DESIGN_TOKEN_CONTRACT.conversion;
export const DATA_DISPLAY_TOKENS = DESIGN_TOKEN_CONTRACT.dataDisplay;
export const MEDIA_TOKENS = DESIGN_TOKEN_CONTRACT.media;
export const MOTION_TOKENS = DESIGN_TOKEN_CONTRACT.motion;
export const LAYER_TOKENS = DESIGN_TOKEN_CONTRACT.layers;
export const ACCESSIBILITY_TOKENS = DESIGN_TOKEN_CONTRACT.accessibility;
export const BRAND_TOKENS = DESIGN_TOKEN_CONTRACT.brand;
export const EMAIL_THEME_TOKENS = DESIGN_TOKEN_CONTRACT.emailTheme;
export const MODULE_TOKENS = DESIGN_TOKEN_CONTRACT.modules;
export const VERTICAL_TOKENS = DESIGN_TOKEN_CONTRACT.verticals;

export function getDesignTokenExport() {
  return {
    name: 'B2B Inquiry Design Language',
    version: '1.0.0',
    core: CORE_TOKENS,
    components: COMPONENT_TOKENS,
    layout: LAYOUT_TOKENS,
    state: STATE_TOKENS,
    conversion: CONVERSION_TOKENS,
    dataDisplay: DATA_DISPLAY_TOKENS,
    media: MEDIA_TOKENS,
    motion: MOTION_TOKENS,
    layers: LAYER_TOKENS,
    accessibility: ACCESSIBILITY_TOKENS,
    brand: BRAND_TOKENS,
    emailTheme: EMAIL_THEME_TOKENS,
    modules: MODULE_TOKENS,
    verticals: VERTICAL_TOKENS,
  };
}
