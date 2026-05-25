import { defineConfig, presetWind, presetIcons, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [presetWind(), presetIcons()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      'primary-900': 'var(--color-primary-900)',
      'primary-100': 'var(--color-primary-100)',
      'primary-50': 'var(--color-primary-50)',
      accent: 'var(--color-accent)',
      'accent-hover': 'var(--color-accent-hover)',
      'gray-warm': 'var(--color-gray-warm)',
      'gray-100': 'var(--color-gray-100)',
      'gray-300': 'var(--color-gray-300)',
      'gray-600': 'var(--color-gray-600)',
      'gray-900': 'var(--color-gray-900)',
      steel: 'var(--color-steel)',
      graphite: 'var(--color-graphite)',
      panel: 'var(--color-panel)',
      surface: 'var(--color-surface)',
      canvas: 'var(--color-canvas)',
      ink: 'var(--color-ink)',
      'ink-muted': 'var(--color-ink-muted)',
      'surface-1': 'var(--color-surface-1)',
      'surface-2': 'var(--color-surface-2)',
      hairline: 'var(--color-hairline)',
      inquiry: 'var(--color-inquiry-cta)',
      'inquiry-hover': 'var(--color-inquiry-cta-hover)',
    },
    fontFamily: {
      sans: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
      mono: '"IBM Plex Mono", "SFMono-Regular", monospace',
    },
    fontSize: {
      display: 'var(--text-display)',
      heading: 'var(--text-heading)',
      subhead: 'var(--text-subhead)',
      body: 'var(--text-body)',
      caption: 'var(--text-caption)',
      small: 'var(--text-small)',
    },
  },
  shortcuts: {
    btn: 'inline-flex items-center justify-center gap-2 font-normal rounded-[var(--radius-button)] transition-colors min-h-12 focus:outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 text-caption tracking-[0.16px]',
    'btn-primary':
      'btn bg-inquiry text-white hover:bg-inquiry-hover px-4 py-3',
    'btn-secondary':
      'btn bg-gray-900 text-white hover:bg-black px-4 py-3',
    'btn-outline':
      'btn border border-primary text-primary hover:bg-primary-50 px-4 py-3',
    'btn-quiet':
      'btn bg-white text-primary hover:bg-primary-50 px-4 py-3',
    'section': 'py-[var(--space-section)]',
    'container': 'max-w-[1584px] mx-auto px-4 sm:px-6 lg:px-8',
    'card': 'bg-white rounded-[var(--radius-card)] border border-gray-100 p-6',
    'section-band': 'py-[var(--space-section)] border-y border-gray-100 bg-surface-1',
    'section-heading': 'text-heading font-light leading-tight text-gray-900 tracking-normal',
    'metric-card': 'bg-white border border-gray-100 rounded-[var(--radius-card)] p-6',
    'proof-card': 'bg-white border border-gray-100 rounded-[var(--radius-card)] p-6',
    'product-card': 'bg-white border border-gray-100 rounded-[var(--radius-card)] overflow-hidden transition hover:bg-surface-1',
    'quote-panel': 'bg-white border border-gray-100 rounded-[var(--radius-card)] p-6',
    'table-procurement': 'w-full text-left text-caption border-separate border-spacing-0',
    'form-control': 'w-full border-0 border-b border-gray-600 bg-surface-1 rounded-[var(--radius-input)] px-4 py-[11px] text-body text-gray-900 placeholder:text-gray-600 focus:outline-none focus:border-b-2 focus:border-primary transition',
  },
});
