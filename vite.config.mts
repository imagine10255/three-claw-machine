import * as path from 'node:path';

import {isNotEmpty} from '@acrool/js-utils/equal';
import react from '@vitejs/plugin-react-swc';
import {visualizer} from 'rollup-plugin-visualizer';
import {defineConfig, loadEnv} from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
// import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDev = process.env.NODE_ENV !== 'production';
    const baseUrl = isNotEmpty(env.PUBLIC_URL) ? env.PUBLIC_URL : '/';

    return {
        plugins: [
            eslint(),
            checker({typescript: true}),
            react({
                plugins: process.env.NODE_ENV !== 'production' ? [[
                    '@swc/plugin-styled-components', {
                        'displayName': true,
                        'ssr': false
                    }
                ]]: [],
            }),
            svgr(),
            // VitePWA({
            //     injectRegister: 'inline',
            //     registerType: 'autoUpdate',
            //     strategies: 'injectManifest',
            //     srcDir: 'src',
            //     filename: 'sw.ts',
            //     workbox: {
            //         clientsClaim: true,
            //         skipWaiting: true
            //     },
            //     devOptions: {
            //         enabled: false
            //     }
            // }),
            visualizer() as Plugin,
        ],
        css: {
            modules: {
                localsConvention: 'camelCase',
                scopeBehaviour: 'local',
                generateScopedName: 'main__[module]-[local]',
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            }
        },
        base: baseUrl,
        define: {
            'import.meta.env.PUBLIC_URL': JSON.stringify(baseUrl),
            'import.meta.env.VITE_SITE_CANONICAL': JSON.stringify(env.VITE_SITE_CANONICAL ?? '__SITE_CANONICAL__'),
            'import.meta.env.VITE_SITE_NAME': JSON.stringify(env.VITE_SITE_NAME ?? '__SITE_NAME__'),
            'import.meta.env.VITE_SITE_DESC': JSON.stringify(env.VITE_SITE_DESC ?? '__SITE_DESC__'),
            'import.meta.env.VITE_SITE_CODE': JSON.stringify(env.VITE_SITE_CODE ?? '__SITE_CODE__'),
            'import.meta.env.VITE_SITE_ENV': JSON.stringify(env.VITE_SITE_ENV ?? '__SITE_ENV__'),
        },
        optimizeDeps: {
            // [注意] 優化代碼，請勿將不確定的模塊加入，會導致發布程式碼錯誤
            include: [
                '@acrool/react-toaster',
                '@acrool/react-table',
                '@acrool/react-router-hash',
                '@acrool/react-locale',
            ],
        },
        build: {
            sourcemap: isDev,
            commonjsOptions: {
                include: [/node_modules/],
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        // 將 模組分配
                        motion: ['framer-motion'],
                    },
                },
            },
        },
        server: {
            // port: 3000,
            host: '0.0.0.0',
            proxy: {
                '/api': {
                    target: env.PROXY_API_DOMAIN,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
                // '^/api5': {
                //     target: env.PROXY_API_DOMAIN,
                //     rewrite: (path) => path.replace(/^\/api5/, ''),
                //     // target: 'http://ts-ezapp-api-my.6680861.com/api5-member',
                //     changeOrigin: true,
                //     secure: false,
                // },
            },
        },
    };
});
