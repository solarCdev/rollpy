import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      gray: {
        bg: "#111111",
        1: "#222222",
        2: "#AAAAAA"
      }
    }
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;
