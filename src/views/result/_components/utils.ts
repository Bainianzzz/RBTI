import { snapdom } from '@zumer/snapdom'

export const RESULT_SHARE_CARD_EXPORT_ID = 'result-share-card-export'
const EXPORT_SCALE = 2

const waitForImages = async (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'))
  await Promise.all(
    images.map(async (image) => {
      if (image.complete) {
        return
      }
      await new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
      })
    }),
  )
}

export const downloadResultShareCardImage = async (mbti: string): Promise<boolean> => {
  const shareCard = document.getElementById(RESULT_SHARE_CARD_EXPORT_ID)
  if (!shareCard) {
    return false
  }

  try {
    await waitForImages(shareCard)
    const fileName = `rbti-result-${mbti.toLowerCase() || 'unknown'}.png`
    const capture = await snapdom(shareCard, { scale: EXPORT_SCALE })
    await capture.download({
      type: 'png',
      filename: fileName,
    })
    return true
  } catch {
    return false
  }
}
