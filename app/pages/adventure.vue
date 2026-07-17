<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { useAdventureStore, FLOOR, CEILING } from '~/stores/adventure'

const store = useAdventureStore()
const { phase, active, events, error } = storeToRefs(store)

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
    if (!ev) return
    if (ev.interlude) {
      interludeTyped.run({ startDelay: 180 })
    } else {
      narrativeTyped.run({ startDelay: 180 })
    }
  },
  { flush: 'post' },
)

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

onMounted(() => {
  if (store.phase === 'idle') store.start()
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(
  () => phase.value,
  (p) => {
    if (p === 'done') navigateTo('/result')
  },
)
</script>

<template>
  <main class="page-vignette starfield relative flex min-h-dvh flex-col justify-center px-5 py-10 text-ink sm:px-8">
    <div class="mx-auto w-full max-w-3xl">
      <!-- 进度条 -->
      <div class="coal-bar mb-5 flex items-center gap-4 rounded-xl px-4 py-3 sm:px-5">
        <span class="shrink-0 text-sm font-black tracking-wide text-gold">
          精灵契约之日 · 第 {{ Math.min(events.length + 1, CEILING) }} 幕
        </span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
          <div
            class="h-full rounded-full bg-linear-to-r from-gold-soft to-gold transition-[width] duration-500"
            :style="{ width: `${(Math.min(events.length + 1, CEILING) / CEILING) * 100}%` }"
          />
        </div>
        <span class="shrink-0 text-sm font-bold tabular-nums text-ink-dim">{{ events.length + 1 }}/{{ CEILING }}</span>
      </div>

      <!-- 生成中 -->
      <div v-if="phase === 'generating' || phase === 'idle'" class="paper-panel rounded-3xl px-6 py-24 text-center">
        <div class="mx-auto mb-6 size-12 rounded-full border-4 border-paper-soft border-t-gold motion-safe:animate-spin" />
        <p class="text-base font-bold text-paper-ink">
          命运之轮缓缓转动<span class="inline-block animate-pulse">…</span>
        </p>
        <p class="mt-2 text-sm text-paper-ink/55">精灵圣泉正在为你编织下一段奇遇</p>
      </div>

      <!-- 收尾中 -->
      <div v-else-if="phase === 'concluding'" class="paper-panel rounded-3xl px-6 py-24 text-center">
        <div class="relative mx-auto mb-8 flex size-24 items-center justify-center">
          <span class="absolute size-full rounded-full bg-gold/20 motion-safe:animate-ping" />
          <span class="absolute size-14 rounded-full bg-gold-soft/40 blur-sm motion-safe:animate-pulse" />
          <span class="size-9 rounded-full bg-gold-soft/60" />
        </div>
        <p class="text-lg font-black text-gold-deep">黄昏降临，精灵圣泉泛起微光</p>
        <p class="mt-2 text-base text-paper-ink/60">
          你的本命精灵正在显现<span class="inline-block animate-pulse">…</span>
        </p>
      </div>

      <!-- 出错 -->
      <div v-else-if="phase === 'error'" class="paper-panel rounded-3xl px-6 py-20 text-center">
        <p class="text-base font-black text-rose-700">旅途中遇到了一点意外</p>
        <p class="mx-auto mt-2 max-w-md break-all text-sm text-paper-ink/55">{{ error }}</p>
                <button
                  class="mt-6 min-h-12 rounded-lg border-2 border-gold bg-coal px-6 text-base font-black text-gold transition-colors hover:bg-coal-soft"
                  @click="store.retry()"
                >
                  再试一次
                </button>
      </div>

      <!-- 答题：羊皮纸卡片 -->
      <div
        v-else-if="phase === 'answering' && active"
        :key="events.length"
        :class="anyTyping ? 'cursor-pointer' : ''"
        @click="anyTyping ? skipAll() : undefined"
      >
        <article class="paper-panel relative rounded-3xl p-6 md:p-9">
          <!-- 卡片顶部金线装饰 -->
          <div class="mb-6 flex items-center gap-3" aria-hidden="true">
            <span class="h-px flex-1 bg-linear-to-r from-transparent to-sun" />
            <span class="size-2 rotate-45 bg-sun" />
            <span class="h-px flex-1 bg-linear-to-l from-transparent to-sun" />
          </div>

          <p
            v-if="active.interlude"
            class="mb-5 border-l-4 border-sun pl-4 font-display text-base italic leading-7 text-paper-ink/60"
          >
           <span ref="interludeEl" /><ScrambleCursor v-if="interludeTyped.typing.value" char-class="text-parch-ink/50" />
          </p>

          <h1 class="font-display text-xl font-black leading-8 text-paper-ink md:text-2xl md:leading-9">
           <span ref="narrativeEl" /><ScrambleCursor v-if="narrativeTyped.typing.value" char-class="text-parch-ink/80" />
          </h1>

          <Transition name="rise" appear>
            <div v-if="fullyRevealed">
              <div class="mt-7 flex flex-col gap-3">
                <button
                  v-for="opt in active.options"
                  :key="opt"
                  class="group min-h-13 rounded-lg border-2 px-4 py-3 text-left font-display text-base font-bold leading-6 transition-colors sm:px-5"
                  :class="
                    active.chosenOption === opt
                      ? 'border-gold bg-coal text-gold'
                      : 'border-paper-ink/15 bg-coal text-ink hover:border-sun hover:bg-coal-soft'
                  "
                  @click="store.selectOption(opt)"
                >
                  <span class="mr-2 inline-block text-sun transition-opacity" :class="active.chosenOption === opt ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'">◆</span>
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
                  class="w-full resize-none rounded-lg border-2 border-paper-ink/12 bg-white/55 px-4 py-3 text-base leading-7 text-paper-ink placeholder:text-paper-ink/35 focus:border-sun focus:outline-hidden focus:ring-gold/25"
                />
              </div>

              <div class="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <span class="text-sm font-medium text-paper-ink/50">
                  <template v-if="!store.canSubmit">选一个选项，或写下你的答案</template>
                  <template v-else-if="events.length + 1 >= FLOOR">可继续旅程，也可见证本命精灵</template>
                  <template v-else>至少还有 {{ FLOOR - (events.length + 1) }} 幕才会收尾</template>
                </span>
                <button
                  class="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-gold bg-coal px-7 text-base font-black text-gold transition-colors hover:bg-coal-soft disabled:cursor-not-allowed disabled:border-paper-ink/15 disabled:text-ink disabled:opacity-40"
                  :disabled="!store.canSubmit || submitting"
                  @click="onSubmit"
                >
                  {{ submitting ? '记录中…' : '继续旅程' }}
                  <ArrowRight v-if="!submitting" class="size-4" :stroke-width="2.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Transition>

          <p v-if="anyTyping" class="mt-6 text-sm font-medium text-paper-ink/40">轻触或按空格跳过 ›</p>
          <div class="gold-rule mt-6" />
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.rise-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.rise-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
