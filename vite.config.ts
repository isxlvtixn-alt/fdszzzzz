import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/miniapp/",          // важно для абсолютных путей к ассетам
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // отдельный CSS, чтобы Telegram WebView не блокировал inline-стили
    cssCodeSplit: true,
    // минимизация JS и CSS для продакшна
    minify: 'esbuild',
    // имя папки вывода (можно поменять на dist/miniapp, если нужно)
    outDir: 'dist',
  },
}));
