import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-cpy';

const external = [
  'stream',
  'fs',
  'zlib',
  '@foliojs-fork/fontkit',
  'events',
  '@foliojs-fork/linebreak',
  'png-js',
  'crypto-js',
  'saslprep',
  'jpeg-exif'
];

const supportedBrowsers = [
  'Firefox 102', // ESR from 2022
  'iOS 14', // from 2020
  'Safari 14' // from 2020
];

export default [
  // CommonJS build for Node
  {
    input: 'lib/document.js',
    external,
    output: {
      name: 'pdfkit',
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      interop: false
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                node: '18'
              }
            }
          ]
        ]
      }),
      copy({
        files: ['lib/font/data/*.afm', 'lib/mixins/data/*.icc'],
        dest: 'js/data'
      })
    ]
  },
  // ES for green browsers
  {
    input: 'lib/document.js',
    external,
    output: {
      name: 'pdfkit.es',
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                browsers: supportedBrowsers
              }
            }
          ]
        ]
      })
    ]
  },
  {
    input: 'lib/virtual-fs.js',
    external,
    output: {
      name: 'virtual-fs',
      file: 'js/virtual-fs.js',
      format: 'cjs',
      sourcemap: false
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              loose: true,
              modules: false,
              targets: {
                browsers: supportedBrowsers
              }
            }
          ]
        ]
      })
    ]
  }
];
