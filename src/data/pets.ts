import type { RocoPet } from '@/types'

import imageAbu from '@/assets/pets/esfp.webp'
import imageDimo from '@/assets/pets/enfj.webp'
import imageEnchanterCat from '@/assets/pets/infp.webp'
import imageEvilDing from '@/assets/pets/entp.webp'
import imageFireGod from '@/assets/pets/entj.webp'
import imageFrostDoll from '@/assets/pets/isfp.webp'
import imageGranBall from '@/assets/pets/esfj.webp'
import imageGuardDog from '@/assets/pets/isfj.webp'
import imageHolyWater from '@/assets/pets/infj.webp'
import imageKula from '@/assets/pets/istp.webp'
import imageLuoYin from '@/assets/pets/istj.webp'
import imageMechaCube from '@/assets/pets/intp.webp'
import imagePalsas from '@/assets/pets/intj.webp'
import imageRoyalGryphon from '@/assets/pets/estj.webp'
import imageSonicDog from '@/assets/pets/estp.webp'
import imageSpringFlower from '@/assets/pets/enfp.webp'

const PET_NAME = {
  'pets.INTJ.name': '帕尔萨斯',
  'pets.INTP.name': '机械方方',
  'pets.ENTJ.name': '烈火战神',
  'pets.ENTP.name': '恶魔叮',
  'pets.INFJ.name': '圣水守护',
  'pets.INFP.name': '魔力猫',
  'pets.ENFJ.name': '迪莫',
  'pets.ENFP.name': '蹦蹦花',
  'pets.ISTJ.name': '罗隐',
  'pets.ISFJ.name': '护主犬',
  'pets.ESTJ.name': '皇家狮鹫',
  'pets.ESFJ.name': '格兰球',
  'pets.ISTP.name': '酷拉',
  'pets.ISFP.name': '雪影娃娃',
  'pets.ESTP.name': '音速犬',
  'pets.ESFP.name': '阿布',
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
  'pets.INTJ.name': imagePalsas,
  'pets.INTP.name': imageMechaCube,
  'pets.ENTJ.name': imageFireGod,
  'pets.ENTP.name': imageEvilDing,
  'pets.INFJ.name': imageHolyWater,
  'pets.INFP.name': imageEnchanterCat,
  'pets.ENFJ.name': imageDimo,
  'pets.ENFP.name': imageSpringFlower,
  'pets.ISTJ.name': imageLuoYin,
  'pets.ISFJ.name': imageGuardDog,
  'pets.ESTJ.name': imageRoyalGryphon,
  'pets.ESFJ.name': imageGranBall,
  'pets.ISTP.name': imageKula,
  'pets.ISFP.name': imageFrostDoll,
  'pets.ESTP.name': imageSonicDog,
  'pets.ESFP.name': imageAbu,
}

const getWikiNameByNameKey = (nameKey: PetNameKey): string => PET_NAME[nameKey]

const getWikiPageUrlByNameKey = (nameKey: PetNameKey): string =>
  `https://wiki.biligame.com/rocom/${encodeURIComponent(getWikiNameByNameKey(nameKey))}`

const getLocalPortraitUrlByNameKey = (nameKey: PetNameKey): string => PET_IMAGE_URL[nameKey]

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
  }
})

export const petByMbti = pets.reduce<Record<string, RocoPet>>((accumulator, pet) => {
  accumulator[pet.mbti] = pet
  return accumulator
}, {})
