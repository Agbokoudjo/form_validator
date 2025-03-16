import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
        alias: {
            util: "rollup-plugin-node-polyfills/polyfills/util",
            assert: "rollup-plugin-node-polyfills/polyfills/assert",
            os: "rollup-plugin-node-polyfills/polyfills/os",
            buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
            process: "rollup-plugin-node-polyfills/polyfills/process-es6",
            net: "rollup-plugin-node-polyfills/polyfills/empty",
            perf_hooks: "rollup-plugin-node-polyfills/polyfills/empty",
            path: "rollup-plugin-node-polyfills/polyfills/path",
            child_process: "rollup-plugin-node-polyfills/polyfills/empty",
            'pdfjs-dist/build/pdf.worker.min.mjs': '/node_modules/pdfjs-dist/build/pdf.worker.min.mjs'
        },
    },
})