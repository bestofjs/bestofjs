import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig((props) => {
  // https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const env = loadEnv(props.mode, process.cwd(), 'VITE_APP');

  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        ['process.env.' + key]: `'${val}'`,
      };
    },
    {},
  );
  envWithProcessPrefix['process.env.NODE_ENV'] = `'${props.mode}'`;
  return {
    plugins: [
      // checker({ typescript: true, enableBuild: false }),
      react(),
      tsconfigPaths(),
    ].filter(Boolean),
    build: {
      outDir: './build',
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
