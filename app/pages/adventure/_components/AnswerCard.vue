<script setup lang="ts">
import { useAdventureStore } from '~/stores/adventure'
import '~/assets/css/adventure/card.css'
import AnswerComposer from './card/AnswerComposer.vue'
import OptionList from './card/OptionList.vue'
import StoryPrompt from './card/StoryPrompt.vue'

// 答题卡负责编排流式叙事、选项和回答组件，并统一持有提交逻辑。
const store = useAdventureStore()
const { active, events, isStreaming } = storeToRefs(store)

// 父级 v-if 保证 active 非空，收窄一次供模板直接使用
const currentEvent = computed(() => active.value!)

const freeInput = computed({
  get: () => active.value?.freeInput ?? '',
  set: (v: string) => store.setFreeInput(v),
})

const submitting = ref(false)
function onSubmit() {
  if (!active.value || isStreaming.value || !store.canSubmit || submitting.value) return
  submitting.value = true
  const opt = active.value.chosenOption
  store.submitAnswer(opt, freeInput.value).finally(() => {
    submitting.value = false
  })
}

function onCardKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.isComposing || event.repeat) return
  const target = event.target
  if (!(target instanceof HTMLButtonElement)) return
  if (target.dataset.answerOption !== active.value?.chosenOption) return

  event.preventDefault()
  event.stopPropagation()
  onSubmit()
}
</script>

<template>
  <div :key="events.length">
    <article
      class="paper-panel relative rounded-3xl p-6 md:p-9"
      @keydown.capture="onCardKeydown"
    >
      <GoldRule layout="full" diamond="solid" class="mb-6" />

      <StoryPrompt
        :interlude="currentEvent.interlude"
        :narrative="currentEvent.narrative"
        :is-streaming="isStreaming"
      />

      <OptionList
        v-if="currentEvent.options.length"
        :options="currentEvent.options"
        :selected-option="currentEvent.chosenOption"
        :disabled="isStreaming"
        @select="store.selectOption"
      />

      <Transition name="rise" appear>
        <AnswerComposer
          v-if="!isStreaming && currentEvent.options.length"
          v-model="freeInput"
          :can-submit="store.canSubmit"
          :submitting="submitting"
          @submit="onSubmit"
        />
      </Transition>

      <p v-if="isStreaming" class="mt-6 text-sm font-medium text-paper-ink/40">
        奇遇正在书写中<span class="inline-block animate-pulse">…</span>
      </p>
      <div class="gold-rule mt-6" />
    </article>
  </div>
</template>
