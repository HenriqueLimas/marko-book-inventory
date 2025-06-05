import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import marko from "@marko/run/vite";

export default defineConfig({
  plugins: [
    marko(),
    tailwindcss(),
  ],
})