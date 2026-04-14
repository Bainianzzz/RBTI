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
  nameKey: string
  mbti: string
  titleKey: string
  descriptionKey: string
  habitatKey: string
  wikiUrl: string
  imageUrl: string
}

export interface Question {
  id: number
  textKey: string
  options: {
    textKey: string
    weights: Partial<Record<Dimension, number>>
  }[]
}
