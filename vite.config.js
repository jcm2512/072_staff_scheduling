import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "vite-ngrok-logger",
      configureServer(server) {
        server.httpServer?.once("listening", () => {
          console.log(
            "\n🚀 Vite is running at:\n" +
              "  ➜  Local:   http://localhost:5173/\n" +
              "  ➜  Ngrok:   https://relative-anemone-evidently.ngrok-free.app/\n"
          );
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ["relative-anemone-evidently.ngrok-free.app", "localhost"],
  },
});
