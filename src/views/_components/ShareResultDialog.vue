<script setup lang="ts">
import { computed } from 'vue'
import { Copy, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useQuizStore } from '@/stores/quiz'

import ResultShareCard from './ResultShareCard.vue'

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

const downloadShareImage = (): void => {
  toast.info(t('result.downloadSoon'))
}
</script>

<template>
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
        class="bg-light border-light shadow-warm w-full max-w-[min(92vw,1100px)] space-y-6 rounded-2xl border p-5 md:p-8 lg:p-10"
      >
        <DialogHeader>
          <DialogTitle class="text-dark text-lg font-semibold md:text-xl">
            {{ t('result.shareResultImage') }}
          </DialogTitle>
        </DialogHeader>

        <ResultShareCard />

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
