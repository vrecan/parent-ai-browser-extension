import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                background: "src/background/background.ts",
                content: "src/content/content.ts",
                popup: "src/popup/popup.ts"
            },
            output: {
                entryFileNames: "[name].js",
                dir: "dist"
            }
        }
    }
});