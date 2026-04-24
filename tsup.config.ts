import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        // Point d'entrée principal
        'index': 'src/index.ts',

        // Modules de premier niveau
        'cache/index': 'src/Cache/index.ts',
        'collection/index': 'src/Collection/index.ts',
        'formatting/index': 'src/Formatting/index.ts',
        'subscriber/index': 'src/subscriber/index.ts',
        'translation/index': 'src/Translation/index.ts',
        'user/index': 'src/User/index.ts',

        // FormSubmit et ses sous-modules
        'form-submit/index': 'src/FormSubmit/index.ts',
        'form-submit/contracts/index': 'src/FormSubmit/contracts/index.ts',
        'form-submit/events/index': 'src/FormSubmit/events/index.ts',

        // Validation et ses sous-modules
        'validation/index': 'src/Validation/index.ts',
        'validation/core/index': 'src/Validation/Core/index.ts',
        'validation/core/router/index': 'src/Validation/Core/Router/index.ts',
        'validation/core/adapter/index': 'src/Validation/Core/Adapter/index.ts',

        // Validation Rules
        'validation/rules/index': 'src/Validation/Rules/index.ts',
        'validation/rules/choice/index': 'src/Validation/Rules/Choice/index.ts',
        'validation/rules/file/index': 'src/Validation/Rules/File/index.ts',
        'validation/rules/text/index': 'src/Validation/Rules/Text/index.ts',

        // Utils
        'utils/index': 'src/_Utils/index.ts',
    },

    format: ['esm', 'cjs'],
    dts: false,         // types générés séparément par tsc
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    bundle: false,      // transpile fichier par fichier
    minify: false,
    target: 'esnext',
    outDir: 'dist',
    tsconfig: './tsconfig.json',
    keepNames: true,
    outExtension({ format }) {
        return { js: '.js' };
    },
});