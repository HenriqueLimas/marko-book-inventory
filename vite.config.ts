import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import netlifyAdapter from "@marko/run-adapter-netlify";
import marko from "@marko/run/vite";

export default defineConfig({
  plugins: [
    marko({
      adapter: netlifyAdapter()
    }),
    tailwindcss(),
  ]
})