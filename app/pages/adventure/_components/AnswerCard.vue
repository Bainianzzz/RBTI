<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { useAdventureStore } from '~/stores/adventure'
import '~/assets/css/adventure/card.css'

// 答题卡：LLM 流式叙事 + 选项 + 自由输入 + 提交，全部内聚。
// 流本身承担逐字展示；结束前只展示已收到内容，不允许作答。
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

</script>

<template>
  <div :key="events.length">
    <article class="paper-panel relative rounded-3xl p-6 md:p-9">
      <GoldRule layout="full" diamond="solid" class="mb-6" />

      <p
        v-if="currentEvent.interlude"
        class="mb-5 border-l-4 border-sun pl-4 font-display text-base italic leading-7 text-paper-ink/60"
      >
        {{ currentEvent.interlude }}<ScrambleCursor
          v-if="isStreaming && !currentEvent.narrative"
          char-class="text-parch-ink/50"
        />
      </p>

      <h1
        v-if="currentEvent.narrative"
        class="font-display text-xl font-black leading-8 text-paper-ink md:text-2xl md:leading-9"
      >
        {{ currentEvent.narrative }}<ScrambleCursor
          v-if="isStreaming"
          char-class="text-parch-ink/80"
        />
      </h1>

      <TransitionGroup
        v-if="currentEvent.options.length"
        name="rise"
        tag="div"
        class="mt-7 flex flex-col gap-3"
        appear
      >
        <button
          v-for="opt in currentEvent.options"
          :key="opt"
          :disabled="isStreaming"
          class="group min-h-13 rounded-lg border-2 px-4 py-3 text-left font-display text-base font-bold leading-6 transition-colors disabled:cursor-wait disabled:opacity-70 sm:px-5"
          :class="
            currentEvent.chosenOption === opt
              ? 'border-gold bg-coal text-gold'
              : 'border-paper-ink/15 bg-coal text-ink hover:border-sun hover:bg-coal-soft'
          "
          @click="store.selectOption(opt)"
        >
          <span
            class="mr-2 inline-block text-sun transition-opacity"
            :class="currentEvent.chosenOption === opt ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'"
          >◆</span>
          {{ opt }}
        </button>
      </TransitionGroup>

      <Transition name="rise" appear>
        <div v-if="!isStreaming && currentEvent.options.length">
          <div class="mt-6">
            <label class="mb-2 block text-sm font-black text-paper-ink/65">
              或者，写下你的心声<span class="font-medium text-paper-ink/40">（可选）</span>
            </label>
            <textarea
              v-model="freeInput"
              rows="3"
              placeholder="用一句话说说你会怎么做、心里在想什么…"
              class="w-full resize-none rounded-lg border-2 border-paper-ink/12 bg-white/55 px-4 py-3 text-base leading-7 text-paper-ink placeholder:text-paper-ink/35 focus:border-sun focus:outline-hidden"
            />
          </div>

          <div class="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <span class="text-sm font-medium text-paper-ink/50">
              {{ store.canSubmit ? '你的选择将塑造接下来的旅程' : '选一个选项，或写下你的答案' }}
            </span>
            <ContractButton
              :disabled="!store.canSubmit"
              :loading="submitting"
              loading-text="记录中…"
              :icon="ArrowRight"
              @click="onSubmit"
            >
              继续旅程
            </ContractButton>
          </div>
        </div>
      </Transition>

      <p v-if="isStreaming" class="mt-6 text-sm font-medium text-paper-ink/40">
        奇遇正在书写中<span class="inline-block animate-pulse">…</span>
      </p>
      <div class="gold-rule mt-6" />
    </article>
  </div>
</template>
