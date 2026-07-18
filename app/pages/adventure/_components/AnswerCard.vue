<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { useAdventureStore } from '~/stores/adventure'
import type { ActiveEvent } from '~/stores/adventure'
import '~/assets/css/adventure/card.css'

// 答题卡：打字机叙事 + 选项 + 自由输入 + 提交 + 跳过，全部内聚。
// 由 index.vue 在 phase === 'answering' && active 时渲染，
// 因此内部 active 一定存在。
const store = useAdventureStore()
const { active, events } = storeToRefs(store)

// 父级 v-if 保证 active 非空，收窄一次供模板直接使用
const currentEvent = computed(() => active.value!)

// 打字机 DOM 引用
const interludeEl = ref<HTMLElement | null>(null)
const narrativeEl = ref<HTMLElement | null>(null)

const interludeTyped = useTypedText(interludeEl, () => active.value?.interlude ?? '')
const narrativeTyped = useTypedText(narrativeEl, () => active.value?.narrative ?? '')

// 旁白打完 → 启动情境打字
interludeTyped.onComplete(() => {
  narrativeTyped.run({ startDelay: 220 })
})

// 新事件进来时，DOM 重建后启动打字：flush:'post' 保证在渲染后执行
watch(
  () => active.value,
  (ev) => {
    runTypewriter(ev)
  },
  { flush: 'post' },
)

function runTypewriter(ev: ActiveEvent | null) {
  if (!ev) return
  if (ev.interlude) {
    interludeTyped.run({ startDelay: 180 })
  } else {
    narrativeTyped.run({ startDelay: 180 })
  }
}

const anyTyping = computed(
  () => interludeTyped.typing.value || narrativeTyped.typing.value,
)
// 选项/输入框在打字全部完成后才出现
const fullyRevealed = computed(() => {
  if (!active.value) return false
  if (active.value.interlude) {
    return interludeTyped.done.value && narrativeTyped.done.value
  }
  return narrativeTyped.done.value
})

function skipAll() {
  if (!anyTyping.value) return
  interludeTyped.skip()
  narrativeTyped.skip()
}

function onKeydown(e: KeyboardEvent) {
  if (anyTyping.value && (e.code === 'Space' || e.code === 'Enter')) {
    e.preventDefault()
    skipAll()
  }
}

const freeInput = computed({
  get: () => active.value?.freeInput ?? '',
  set: (v: string) => store.setFreeInput(v),
})

const submitting = ref(false)
function onSubmit() {
  if (!active.value || !store.canSubmit || submitting.value) return
  submitting.value = true
  const opt = active.value.chosenOption
  store.submitAnswer(opt, freeInput.value).finally(() => {
    submitting.value = false
  })
}

// keydown 监听随组件生命周期挂载/卸载，仅在答题阶段生效；
// 组件挂载时 active 已就绪（父级 v-if 保证），需立即启动打字机。
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  runTypewriter(active.value)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    :key="events.length"
    :class="anyTyping ? 'cursor-pointer' : ''"
    @click="anyTyping ? skipAll() : undefined"
  >
    <article class="paper-panel relative rounded-3xl p-6 md:p-9">
      <GoldRule layout="full" diamond="solid" class="mb-6" />

      <p
        v-if="currentEvent.interlude"
        class="mb-5 border-l-4 border-sun pl-4 font-display text-base italic leading-7 text-paper-ink/60"
      >
        <span ref="interludeEl" /><ScrambleCursor
          v-if="interludeTyped.typing.value"
          char-class="text-parch-ink/50"
        />
      </p>

      <h1 class="font-display text-xl font-black leading-8 text-paper-ink md:text-2xl md:leading-9">
        <span ref="narrativeEl" /><ScrambleCursor
          v-if="narrativeTyped.typing.value"
          char-class="text-parch-ink/80"
        />
      </h1>

      <Transition name="rise" appear>
        <div v-if="fullyRevealed">
          <div class="mt-7 flex flex-col gap-3">
              <button
                v-for="opt in currentEvent.options"
                :key="opt"
                class="group min-h-13 rounded-lg border-2 px-4 py-3 text-left font-display text-base font-bold leading-6 transition-colors sm:px-5"
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
          </div>

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

      <p v-if="anyTyping" class="mt-6 text-sm font-medium text-paper-ink/40">轻触或按空格跳过 ›</p>
      <div class="gold-rule mt-6" />
    </article>
  </div>
</template>
