import type { NextAction } from '~/types'

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface StreamOptions {
  temperature?: number
  maxTokens?: number
  json?: boolean
}

export interface PartialEventFields {
  narrative?: string
  interlude?: string
  options?: string[]
}

export interface PartialVerdictFields {
  petId: string
  verdict: string
}

export interface NextEventResult {
  nextAction: NextAction
  storySummary: string
  narrative: string
  interlude: string
  options: string[]
  pool: 'daily' | 'peak' | null
}
