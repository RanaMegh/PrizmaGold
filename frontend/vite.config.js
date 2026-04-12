import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ Tailwind plugin added
  ],

  base: "./",

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/forecast": "http://localhost:8000",
      "/trends": "http://localhost:8000",
      "/images": "http://localhost:8000",
    },
  },

  optimizeDeps: {
    include: ["recharts", "framer-motion"],
  },
});