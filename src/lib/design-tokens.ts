export const CORE_TOKENS = {
  color: {
    canvas: '#ffffff',
    surface1: '#f4f4f4',
    surface2: '#e0e0e0',
    ink: '#161616',
    inkMuted: '#525252',
    hairline: '#e0e0e0',
    primary: '#0f62fe',
    accent: '#e85d1c',
    success: '#24a148',
    warning: '#f1c21b',
    error: '#da1e28',
  },
  radius: {
    card: '8px',
    button: '4px',
    input: '4px',
  },
  typography: {
    sans: 'Inter, Noto Sans SC, Helvetica Neue, Arial, system-ui, sans-serif',
    mono: 'SFMono-Regular, Roboto Mono, Consolas, monospace',
  },
};

export const COMPONENT_TOKENS = {
  buttonPrimaryBg: 'var(--color-primary)',
  buttonInquiryBg: 'var(--color-accent)',
  fieldBg: 'var(--color-surface-1)',
  fieldBorder: '#8d8d8d',
  fieldFocusRing: '0 0 0 2px var(--color-focus)',
  cardBg: 'var(--color-canvas)',
  sidebarBg: 'var(--color-canvas)',
  mobileCtaBg: 'var(--color-canvas)',
};

export const VERTICAL_TOKENS = {
  machinery: {
    primary: '#0f62fe',
    accent: '#e85d1c',
    surfaceTint: '#f8fbff',
    specBg: '#f4f4f4',
    proofBg: '#edf5ff',
  },
  materials: {
    primary: '#007d79',
    accent: '#e85d1c',
    surfaceTint: '#f6fbfa',
    specBg: '#eef7f6',
    proofBg: '#defbe6',
  },
  'consumer-oem': {
    primary: '#0f62fe',
    accent: '#ff6f00',
    surfaceTint: '#fffaf2',
    specBg: '#f4f4f4',
    proofBg: '#fff1e0',
  },
};

export function getDesignTokenExport() {
  return {
    name: 'B2B Inquiry Design Language',
    version: '1.0.0',
    core: CORE_TOKENS,
    components: COMPONENT_TOKENS,
    verticals: VERTICAL_TOKENS,
  };
}
