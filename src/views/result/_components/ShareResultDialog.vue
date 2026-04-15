<script setup lang="ts">
import { computed } from 'vue'
import { Copy, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useQuizStore } from '@/stores/quiz.ts'

import ResultShareCard from './ResultShareCard.vue'
import { downloadResultShareCardImage, RESULT_SHARE_CARD_EXPORT_ID } from './utils'

const quizStore = useQuizStore()
const { t } = useI18n()

const petName = computed<string>(() => t(quizStore.matchedPet.nameKey))
const shareText = computed<string>(
  () => t('result.shareText', { petName: petName.value }),
)

const shareLink = async (): Promise<void> => {
  try {
    const shareUrl = `${window.location.origin}`
    await navigator.clipboard.writeText(`${shareText.value} ${shareUrl}/RBTI`)
    toast.success(t('result.copySuccess'))
  } catch {
    toast.error(t('result.copyFailed'))
  }
}

const downloadShareImage = async (): Promise<void> => {
  const didDownload = await downloadResultShareCardImage(quizStore.finalMbti)
  if (didDownload) {
    toast.success(t('result.downloadSuccess'))
  } else {
    toast.error(t('result.downloadFailed'))
  }
}
</script>

<template>
  <div
    :id="RESULT_SHARE_CARD_EXPORT_ID"
    class="pointer-events-none fixed top-0 left-[-10000px] z-[-1] w-[390px]"
    aria-hidden="true"
  >
    <ResultShareCard :export-mode="true" />
  </div>

  <div class="grid w-full gap-3 md:hidden">
    <Button
      type="button"
      variant="outline"
      class="border-light bg-light text-accent-warm border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition"
      @click="downloadShareImage"
    >
      <Download class="h-4 w-4" />
      {{ t('result.downloadImage') }}
    </Button>
    <Button
      type="button"
      variant="outline"
      class="border-light bg-light text-dark border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition active:scale-[0.98]"
      @click="shareLink"
    >
      <Copy class="h-4 w-4" />
      {{ t('result.shareLink') }}
    </Button>
  </div>

  <div class="hidden md:block">
    <Dialog>
      <DialogTrigger as-child>
        <Button
          type="button"
          variant="outline"
          class="border-light bg-light text-dark border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition active:scale-[0.98]"
        >
          <Copy class="h-4 w-4" />
          {{ t('result.shareResultImage') }}
        </Button>
      </DialogTrigger>

      <DialogContent
        :show-close-button="true"
        class="bg-light border-light shadow-warm w-[96vw] max-w-[min(96vw,1400px)] max-h-[92vh] space-y-6 overflow-y-auto rounded-2xl border p-5 md:p-10 lg:p-12"
      >
        <DialogHeader>
          <DialogTitle class="text-dark text-lg font-semibold md:text-xl">
            {{ t('result.shareResultImage') }}
          </DialogTitle>
        </DialogHeader>

        <div class="mx-auto w-full max-w-[1280px]">
          <ResultShareCard />
        </div>

        <div class="grid w-full gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            class="border-light bg-light text-dark border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition active:scale-[0.98]"
            @click="shareLink"
          >
            <Copy class="h-4 w-4" />
            {{ t('result.shareLink') }}
          </Button>
          <Button
            type="button"
            variant="outline"
            class="border-light bg-light text-accent-warm border-dark-hover bg-light-hover h-auto w-full rounded-xl py-3.5 text-sm transition"
            @click="downloadShareImage"
          >
            <Download class="h-4 w-4" />
            {{ t('result.downloadImage') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
