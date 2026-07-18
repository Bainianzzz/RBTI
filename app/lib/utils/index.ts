// 通用纯函数公共入口；这里不得依赖页面、store 或具体业务模块。
export {
  extractStringArrayField,
  extractStringField,
  parseJsonLoose,
} from './json'
export { pickRandom } from './random'
