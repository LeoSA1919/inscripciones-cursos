import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite: plugin de React y puerto fijo del servidor de desarrollo.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
