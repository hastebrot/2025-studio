import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    {
      name: "exclude-font-assets-from-bundle",
      generateBundle(_options, bundle) {
        for (const key in bundle) {
          if (key.endsWith(".ttf")) {
            delete bundle[key];
          }
          if (key.endsWith(".woff")) {
            delete bundle[key];
          }
        }
      },
    },
    {
      name: "full-reload-on-hot-update",
      handleHotUpdate({ server }) {
        server.ws.send({ type: "full-reload" });
        return [];
      },
    },
  ],
  build: {
    target: "esnext",
    sourcemap: false,
    minify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        assetFileNames(chunkInfo) {
          if (chunkInfo.names[0] === "tabler-sprite-filled.svg") {
            return `assets/tabler-sprite-filled-[hash][extname]`;
          }
          if (chunkInfo.names[0] === "tabler-sprite-nostroke.svg") {
            return `assets/tabler-sprite-outlined-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        advancedChunks: {
          groups: [
            {
              name: "zodmaid",
              test: (id) => {
                return id.includes("packages/zodmaid/");
              },
            },
            { name: "react-router", test: "react-router" },
            { name: "react", test: "react|react-dom" },
            { name: "modules", test: "[\\\\/]node_modules" },
          ],
        },
      },
    },
  },
});
