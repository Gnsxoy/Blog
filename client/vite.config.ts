import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const {
    VITE_APP_PUBLIC_PATH,
    VITE_APP_BASE_URL,
    VITE_APP_BUILD_BASE_URL,
  } = loadEnv(mode, process.cwd());

  const VITE_APP_IS_SERVE = command === 'serve';

  return {
    base: VITE_APP_IS_SERVE ? './' : VITE_APP_PUBLIC_PATH,
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'c@': path.resolve(__dirname, 'src/components'),
        'a@': path.resolve(__dirname, 'src/apis'),
        'v@': path.resolve(__dirname, 'src/views'),
        'u@': path.resolve(__dirname, 'src/utils'),
        'i@': path.resolve(__dirname, 'src/image'),
        's@': path.resolve(__dirname, 'src/style'),
        'r@': path.resolve(__dirname, 'src/router'),
        'x@': path.resolve(__dirname, 'src/store'),
        't@': path.resolve(__dirname, 'src/types'),
        'h@': path.resolve(__dirname, 'src/hooks'),
        'm@': path.resolve(__dirname, 'mock')
      }
    },
    define: {
      VITE_APP_IS_SERVE
    },
    server: {
      host: 'gnsxoy.local',
      port: 7013,
      open: true,
      proxy: {
        [VITE_APP_BASE_URL]: {
          target: VITE_APP_BUILD_BASE_URL,
          changeOrigin: true,
          rewrite: (url) => url.replace(new RegExp(`^${VITE_APP_BASE_URL}`), '')
        }
      }
    }
  }
});
