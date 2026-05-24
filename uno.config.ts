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
    },
    fontFamily: {
      sans: 'Inter, "Inter Fallback", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  shortcuts: {
    btn: 'inline-flex items-center justify-center font-semibold rounded-[var(--radius-button)] transition-colors',
    'btn-primary':
      'btn bg-accent text-white hover:bg-accent-hover px-6 py-3 min-h-12',
    'btn-secondary':
      'btn bg-primary text-white hover:bg-primary-900 px-6 py-3 min-h-12',
    'btn-outline':
      'btn border-2 border-primary text-primary hover:bg-primary-50 px-6 py-3 min-h-12',
    'section': 'py-[var(--space-section)]',
    'container': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'card': 'bg-white rounded-[var(--radius-card)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6',
  },
});
