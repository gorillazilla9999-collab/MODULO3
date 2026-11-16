import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps the production build portable (GitHub Pages, sub-folders, static hosts).
// Routing is hash-based, so no server-side rewrite rules are needed.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
  // Output goes to the repo root so GitHub Pages (main / root) serves it. Never empty the root.
  build: { outDir: '..', emptyOutDir: false },
});
