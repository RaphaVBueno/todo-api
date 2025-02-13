import esbuild from 'esbuild'
import path from 'path'

esbuild
  .build({
    entryPoints: ['./src/server.ts'],
    bundle: true,
    outfile: './dist/bundle.js',
    platform: 'node',
    target: 'node16',
    tsconfig: './tsconfig.json',
    alias: {
      src: path.resolve('./src'), // 🔥 Adiciona suporte a alias 'src'
    },
    external: ['aws-sdk', 'mock-aws-s3', 'nock', '@mapbox/node-pre-gyp'],
  })
  .catch(() => process.exit(1))
