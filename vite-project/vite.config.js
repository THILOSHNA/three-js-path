import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

// Replace 'repo-name' with your actual GitHub repository name
const base = process.env.NODE_ENV === "production" ? "/three-js-journey/" : "/";

export default defineConfig({
  base,
  plugins: [glsl()],
});
