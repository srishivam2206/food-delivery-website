import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, any request starting with /api is forwarded to the Express server.
// This avoids CORS problems and means the React code can just call "/api/...".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
