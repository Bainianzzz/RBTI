export type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export interface PetStats {
  hp: number
  atk: number
  def: number
  spAtk: number
  spDef: number
  speed: number
}

export interface RocoPet {
  id: string
  name: string
  mbti: string
  title: string
  stats: PetStats
  description: string
  wikiUrl: string
  habitat: string
  imageUrl: string
}

export interface Question {
  id: number
  text: string
  options: {
    text: string
    weights: Partial<Record<Dimension, number>>
  }[]
}
