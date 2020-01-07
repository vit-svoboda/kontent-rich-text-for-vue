import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    name: 'vueKontentRichText',
    exports: 'named'
  },
  plugins: [
    resolve({
      extensions: ['.js', '.vue']
    }),
    vue(),
  ],
  external: ['jsdom']
}
