/// <reference types="vite/client" />

declare module 'vue-writer' {
  import type { DefineComponent, Plugin } from 'vue'

  export const VueWriter: DefineComponent
  const vueWriterPlugin: Plugin
  export default vueWriterPlugin
}
