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
    },
    fontFamily: {
      sans: 'Aptos, "Segoe UI", system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
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
    btn: 'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-button)] transition-colors min-h-11 focus:outline-none focus-visible:ring-3 focus-visible:ring-primary-100',
    'btn-primary':
      'btn bg-accent text-white hover:bg-accent-hover px-6 py-3 shadow-[0_10px_22px_rgba(232,93,28,0.18)]',
    'btn-secondary':
      'btn bg-primary text-white hover:bg-primary-900 px-6 py-3',
    'btn-outline':
      'btn border border-primary text-primary hover:bg-primary-50 px-6 py-3',
    'btn-quiet':
      'btn bg-white border border-gray-100 text-gray-900 hover:border-primary-100 hover:text-primary px-5 py-2.5',
    'section': 'py-[var(--space-section)]',
    'container': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'card': 'bg-white rounded-[var(--radius-card)] border border-gray-100 shadow-[var(--shadow-card)] p-6',
    'section-band': 'py-[var(--space-section)] border-y border-gray-100 bg-panel',
    'section-heading': 'text-heading font-bold leading-tight text-gray-900',
    'metric-card': 'bg-white/95 border border-gray-100 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]',
    'proof-card': 'bg-white border border-gray-100 rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]',
    'product-card': 'bg-white border border-gray-100 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition hover:shadow-[var(--shadow-elevated)] hover:border-primary-100',
    'quote-panel': 'bg-white border border-gray-100 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5',
    'table-procurement': 'w-full text-left text-caption border-separate border-spacing-0',
    'form-control': 'w-full border border-gray-300 bg-white rounded-[var(--radius-input)] px-4 py-3 text-body text-gray-900 placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-100 transition',
  },
});
