esbuild --bundle index.js \
    --format=esm \
    --outfile=iobio.viz.esm.js \
    --define:global=window \
    --sourcemap \
    $@
