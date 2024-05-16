import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/viz.js'],
  bundle: true,
  outfile: 'iobio.viz.esm.js',
  minify: true,
  define: {
    global: 'window',
  },
  format: 'esm',
})
