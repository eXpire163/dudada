// esbuild.config.js
const { build } = require('esbuild');

build({
    entryPoints: ['server.js'], // Entry point of your Express app
    outfile: 'dist/server.js',          // Output bundled file
    platform: 'node',                   // Target Node.js environment
    bundle: true,                       // Bundle all dependencies
    external: ['express', 'ws'],        // External dependencies not bundled
    minify: true,                       // Minify for production
    sourcemap: true,                    // Generate source map for debugging
})
    .then(() => console.log('Server built successfully!'))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
