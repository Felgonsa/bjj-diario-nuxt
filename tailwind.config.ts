// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    // Esses caminhos garantem que o Tailwind olhe seus arquivos
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      // AQUI ENTRAM AS SUAS CORES (Traduzidas do seu CSS):
      colors: {
        brand: {
          DEFAULT: '#0055af', // bg-brand
          hover: '#004490',   // bg-brand-hover
          light: '#e6f0ff',   // bg-brand-light
        },
        ui: {
          background: '#f9fafb', // bg-ui-background
          surface: '#ffffff',    // bg-ui-surface
          border: '#e0e6ed',     // border-ui-border
          text: '#0f172a',       // text-ui-text
          muted: '#64748b',      // text-ui-muted
        },
        action: {
          danger: '#e11d48',
          success: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}