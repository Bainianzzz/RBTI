// LLM 模块公共入口。业务调用方只依赖这里，不感知传输、解析和提示词细节。
export { generateNextEvent } from './narrative'
export { generateVerdict } from './verdict'
export { HARD_CAP } from './prompts'
export type {
  NextEventResult,
  PartialEventFields,
  PartialVerdictFields,
} from './types'
