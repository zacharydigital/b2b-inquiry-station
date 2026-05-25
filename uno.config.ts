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
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
    },
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
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
    btn: 'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-button)] transition-colors min-h-12 focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 text-caption tracking-[0.16px] no-underline hover:no-underline',
    'btn-primary':
      'btn bg-[var(--button-primary-bg)] text-white hover:bg-[var(--color-primary-hover)] px-5 py-3',
    'btn-inquiry':
      'btn bg-[var(--button-inquiry-bg)] text-white hover:bg-accent-hover px-5 py-3 shadow-[0_8px_18px_rgba(232,93,28,0.18)]',
    'btn-secondary':
      'btn bg-gray-900 text-white hover:bg-black px-4 py-3',
    'btn-outline':
      'btn border border-primary text-primary hover:bg-primary-50 px-5 py-3',
    'btn-quiet':
      'btn bg-white text-primary hover:bg-primary-50 px-4 py-3',
    'section': 'py-[var(--space-section)]',
    'container': 'max-w-[1584px] mx-auto px-4 sm:px-6 lg:px-8',
    'card': 'bg-white rounded-[var(--radius-card)] border border-gray-100 p-6',
    'section-band': 'py-[var(--space-section)] border-y border-hairline bg-surface-1',
    'section-heading': 'text-heading font-semibold leading-tight text-gray-900 tracking-normal',
    'metric-card': 'bg-[var(--card-bg)] border border-hairline rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]',
    'proof-card': 'bg-[var(--card-bg)] border border-hairline rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]',
    'product-card': 'bg-[var(--card-bg)] border border-hairline rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition hover:shadow-[var(--shadow-elevated)] hover:border-primary-100 no-underline hover:no-underline',
    'quote-panel': 'bg-[var(--sidebar-bg)] border border-hairline rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6',
    'table-procurement': 'w-full text-left text-caption border-separate border-spacing-0',
    'form-control': 'w-full border border-[var(--field-border)] border-b-[var(--field-border-hover)] bg-[var(--field-bg)] rounded-[var(--radius-input)] px-4 py-[11px] text-body text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] transition',
  },
});
