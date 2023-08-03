import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig((props) => {
  // https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const env = loadEnv(props.mode, process.cwd(), "VITE_APP");

  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
  };
  return {
    plugins: [
      checker({ typescript: true, enableBuild: false }),
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        minify: true,
      }),
    ].filter(Boolean),
    build: {
      outDir: "./build",
      sourcemap: true,
    },
    // If `envWithProcessPrefix` is an empty object, `process.env` will be undefined and the app cannot be loaded
    // Caveat: Cannot access `process.env` in build mode, always use `process.env.VARIABLE_NAME`
    define: envWithProcessPrefix,
    // Uncomment if you want to open browser when start up
    // server: {
    //   open: true,
    // },
  };
});
