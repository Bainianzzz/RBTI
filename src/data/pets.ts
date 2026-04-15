import type { RocoPet } from '@/types'

import normalENFP from '@/assets/pets/normal/ENFP_normal.webp'
import normalENFJ from '@/assets/pets/normal/ENFJ_normal.webp'
import normalENTJ from '@/assets/pets/normal/ENTJ_normal.webp'
import normalENTP from '@/assets/pets/normal/ENTP_normal.webp'
import normalESFJ from '@/assets/pets/normal/ESFJ_normal.webp'
import normalESFP from '@/assets/pets/normal/ESFP_normal.webp'
import normalESTJ from '@/assets/pets/normal/ESTJ_normal.webp'
import normalESTP from '@/assets/pets/normal/ESTP_normal.webp'
import normalINFJ from '@/assets/pets/normal/INFJ_normal.webp'
import normalINFP from '@/assets/pets/normal/INFP_normal.webp'
import normalINTJ from '@/assets/pets/normal/INTJ_normal.webp'
import normalINTP from '@/assets/pets/normal/INTP_normal.webp'
import normalISFJ from '@/assets/pets/normal/ISFJ_normal.webp'
import normalISFP from '@/assets/pets/normal/ISFP_normal.webp'
import normalISTJ from '@/assets/pets/normal/ISTJ_normal.webp'
import normalISTP from '@/assets/pets/normal/ISTP_normal.webp'
import shinyENFP from '@/assets/pets/shiny/ENFP_shiny.webp'
import shinyENFJ from '@/assets/pets/shiny/ENFJ_shiny.webp'
import shinyENTJ from '@/assets/pets/shiny/ENTJ_shiny.webp'
import shinyENTP from '@/assets/pets/shiny/ENTP_shiny.webp'
import shinyESFJ from '@/assets/pets/shiny/ESFJ_shiny.webp'
import shinyESFP from '@/assets/pets/shiny/ESFP_shiny.webp'
import shinyESTJ from '@/assets/pets/shiny/ESTJ_shiny.webp'
import shinyESTP from '@/assets/pets/shiny/ESTP_shiny.webp'
import shinyINFJ from '@/assets/pets/shiny/INFJ_shiny.webp'
import shinyINFP from '@/assets/pets/shiny/INFP_shiny.webp'
import shinyINTJ from '@/assets/pets/shiny/INTJ_shiny.webp'
import shinyINTP from '@/assets/pets/shiny/INTP_shiny.webp'
import shinyISFJ from '@/assets/pets/shiny/ISFJ_shiny.webp'
import shinyISFP from '@/assets/pets/shiny/ISFP_shiny.webp'
import shinyISTJ from '@/assets/pets/shiny/ISTJ_shiny.webp'
import shinyISTP from '@/assets/pets/shiny/ISTP_shiny.webp'

const PET_NAME = {
  'pets.INTJ.name': '夜枭',
  'pets.INTP.name': '机械方方',
  'pets.ENTJ.name': '恶魔狼',
  'pets.ENTP.name': '红纹十字',
  'pets.INFJ.name': '利灯鱼',
  'pets.INFP.name': '奇丽花',
  'pets.ENFJ.name': '小皮球',
  'pets.ENFP.name': '粉星仔',
  'pets.ISTJ.name': '獠牙猪',
  'pets.ISFJ.name': '贝古斯',
  'pets.ESTJ.name': '窃光蚁',
  'pets.ESFJ.name': '格兰球',
  'pets.ISTP.name': '酷拉',
  'pets.ISFP.name': '雪影娃娃',
  'pets.ESTP.name': '炫爵虫',
  'pets.ESFP.name': '月牙雪熊',
} as const

const MBTI_LIST = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
] as const

type MbtiType = (typeof MBTI_LIST)[number]
type PetNameKey = keyof typeof PET_NAME

const MBTI_TO_NAME_KEY: Record<MbtiType, PetNameKey> = {
  INTJ: 'pets.INTJ.name',
  INTP: 'pets.INTP.name',
  ENTJ: 'pets.ENTJ.name',
  ENTP: 'pets.ENTP.name',
  INFJ: 'pets.INFJ.name',
  INFP: 'pets.INFP.name',
  ENFJ: 'pets.ENFJ.name',
  ENFP: 'pets.ENFP.name',
  ISTJ: 'pets.ISTJ.name',
  ISFJ: 'pets.ISFJ.name',
  ESTJ: 'pets.ESTJ.name',
  ESFJ: 'pets.ESFJ.name',
  ISTP: 'pets.ISTP.name',
  ISFP: 'pets.ISFP.name',
  ESTP: 'pets.ESTP.name',
  ESFP: 'pets.ESFP.name',
}

const PET_IMAGE_URL: Record<PetNameKey, string> = {
  'pets.INTJ.name': normalINTJ,
  'pets.INTP.name': normalINTP,
  'pets.ENTJ.name': normalENTJ,
  'pets.ENTP.name': normalENTP,
  'pets.INFJ.name': normalINFJ,
  'pets.INFP.name': normalINFP,
  'pets.ENFJ.name': normalENFJ,
  'pets.ENFP.name': normalENFP,
  'pets.ISTJ.name': normalISTJ,
  'pets.ISFJ.name': normalISFJ,
  'pets.ESTJ.name': normalESTJ,
  'pets.ESFJ.name': normalESFJ,
  'pets.ISTP.name': normalISTP,
  'pets.ISFP.name': normalISFP,
  'pets.ESTP.name': normalESTP,
  'pets.ESFP.name': normalESFP,
}

const SHINY_PET_IMAGE_URL: Record<PetNameKey, string> = {
  'pets.INTJ.name': shinyINTJ,
  'pets.INTP.name': shinyINTP,
  'pets.ENTJ.name': shinyENTJ,
  'pets.ENTP.name': shinyENTP,
  'pets.INFJ.name': shinyINFJ,
  'pets.INFP.name': shinyINFP,
  'pets.ENFJ.name': shinyENFJ,
  'pets.ENFP.name': shinyENFP,
  'pets.ISTJ.name': shinyISTJ,
  'pets.ISFJ.name': shinyISFJ,
  'pets.ESTJ.name': shinyESTJ,
  'pets.ESFJ.name': shinyESFJ,
  'pets.ISTP.name': shinyISTP,
  'pets.ISFP.name': shinyISFP,
  'pets.ESTP.name': shinyESTP,
  'pets.ESFP.name': shinyESFP,
}

const getWikiNameByNameKey = (nameKey: PetNameKey): string => PET_NAME[nameKey]

const getWikiPageUrlByNameKey = (nameKey: PetNameKey): string =>
  `https://wiki.biligame.com/rocom/${encodeURIComponent(getWikiNameByNameKey(nameKey))}`

const getLocalPortraitUrlByNameKey = (nameKey: PetNameKey): string => PET_IMAGE_URL[nameKey]
const getLocalShinyPortraitUrlByNameKey = (nameKey: PetNameKey): string =>
  SHINY_PET_IMAGE_URL[nameKey]

export const pets: RocoPet[] = MBTI_LIST.map((mbti) => {
  const nameKey = MBTI_TO_NAME_KEY[mbti]

  return {
    id: `pet-${mbti.toLowerCase()}`,
    nameKey,
    mbti,
    titleKey: `pets.${mbti}.title`,
    descriptionKey: `pets.${mbti}.description`,
    habitatKey: `pets.${mbti}.habitat`,
    wikiUrl: getWikiPageUrlByNameKey(nameKey),
    imageUrl: getLocalPortraitUrlByNameKey(nameKey),
    shinyImageUrl: getLocalShinyPortraitUrlByNameKey(nameKey),
  }
})

export const petByMbti = pets.reduce<Record<string, RocoPet>>((accumulator, pet) => {
  accumulator[pet.mbti] = pet
  return accumulator
}, {})
