import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { BASE } from "./src/common/constants";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: BASE,
});
