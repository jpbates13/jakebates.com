import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  envPrefix: 'REACT_APP_',
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
  },
});
