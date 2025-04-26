
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "./decky-chat-plugin/dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    target: "esnext",
    lib: {
      entry: "./src/main.tsx",
      formats: ["iife"],
      name: "DeckyChat"
    }
  },
  plugins: [react()]
});
