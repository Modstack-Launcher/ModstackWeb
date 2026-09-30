import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/news': {
        target: 'https://fitzxel-cl-api.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, '/v2/modstack/news'),
      },
    },
  },
});
