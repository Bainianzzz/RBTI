<script setup lang="ts">
import { storeToRefs } from 'pinia'
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
  <main class="starfield relative min-h-dvh bg-linear-to-b from-night via-night-2 to-night px-5 py-8 text-ink">
    <div class="mx-auto w-full max-w-2xl">
      <!-- 进度条 -->
      <div class="mb-8 flex items-center gap-3">
        <span class="text-xs font-medium tracking-wide text-gold">
          精灵契约之日 · 第 {{ Math.min(events.length + 1, CEILING) }} 幕
        </span>
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-night-3">
          <div
            class="h-full rounded-full bg-linear-to-r from-gold-soft to-gold transition-all duration-500"
            :style="{ width: `${(Math.min(events.length + 1, CEILING) / CEILING) * 100}%` }"
          />
        </div>
        <span class="text-xs tabular-nums text-ink-dim">{{ events.length + 1 }}/{{ CEILING }}</span>
      </div>

      <!-- 生成中 -->
      <div v-if="phase === 'generating' || phase === 'idle'" class="py-24 text-center">
        <div class="mx-auto mb-6 size-12 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p class="text-sm text-ink-dim">
          命运之轮缓缓转动<span class="inline-block animate-pulse">…</span>
        </p>
        <p class="mt-2 text-xs text-ink-dim/60">精灵圣泉正在为你编织下一段奇遇</p>
      </div>

      <!-- 收尾中 -->
      <div v-else-if="phase === 'concluding'" class="py-24 text-center">
        <div class="relative mx-auto mb-8 flex size-24 items-center justify-center">
          <span class="absolute size-full animate-ping rounded-full bg-gold/20" />
          <span class="absolute size-14 animate-pulse rounded-full bg-gold-soft/30 blur-md" />
          <span class="size-9 rounded-full bg-gold-soft/60" />
        </div>
        <p class="text-base font-medium text-glow text-gold">黄昏降临，精灵圣泉泛起微光</p>
        <p class="mt-2 text-sm text-ink-dim">
          你的本命精灵正在显现<span class="inline-block animate-pulse">…</span>
        </p>
      </div>

      <!-- 出错 -->
      <div v-else-if="phase === 'error'" class="py-20 text-center">
        <p class="text-sm text-rose-400">旅途中遇到了一点意外</p>
        <p class="mt-2 max-w-md mx-auto break-all text-xs text-ink-dim/60">{{ error }}</p>
        <button
          class="btn-gold mt-6 rounded-md px-5 py-2 text-sm font-medium transition"
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
        <article class="relative rounded-2xl border border-parch-edge/60 bg-parch/95 p-6 text-parch-ink shadow-2xl md:p-8">
          <!-- 卡片顶部金线装饰 -->
          <div class="gold-rule mb-5" />

          <p
            v-if="active.interlude"
            class="mb-5 border-l-2 border-gold-deep/50 pl-4 text-sm italic leading-relaxed text-parch-ink/60"
          >
            <span ref="interludeEl" /><span v-if="interludeTyped.typing.value" class="ml-0.5 inline-block w-0.5 animate-pulse text-parch-ink/50">▌</span>
          </p>

          <h1 class="text-lg font-semibold leading-relaxed text-parch-ink">
            <span ref="narrativeEl" /><span v-if="narrativeTyped.typing.value" class="ml-0.5 inline-block w-0.5 animate-pulse text-parch-ink/80">▌</span>
          </h1>

          <Transition name="rise" appear>
            <div v-if="fullyRevealed">
              <div class="mt-6 flex flex-col gap-2.5">
                <button
                  v-for="opt in active.options"
                  :key="opt"
                  class="group rounded-xl border px-4 py-3 text-left text-sm transition-all"
                  :class="
                    active.chosenOption === opt
                      ? 'border-gold bg-gold-soft/25 text-parch-ink shadow-sm ring-1 ring-gold/40'
                      : 'border-parch-edge/40 bg-parch/50 text-parch-ink/80 hover:border-gold/50 hover:bg-gold-soft/10'
                  "
                  @click="store.selectOption(opt)"
                >
                  <span class="mr-2 inline-block text-gold-deep transition-opacity" :class="active.chosenOption === opt ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'">◆</span>
                  {{ opt }}
                </button>
              </div>

              <div class="mt-6">
                <label class="mb-2 block text-xs font-medium text-parch-ink/60">
                  或者，写下你的心声<span class="font-normal text-parch-ink/40">（可选）</span>
                </label>
                <textarea
                  v-model="freeInput"
                  rows="3"
                  placeholder="用一句话说说你会怎么做、心里在想什么…"
                  class="w-full resize-none rounded-xl border border-parch-edge/40 bg-parch/50 px-4 py-3 text-sm leading-relaxed text-parch-ink placeholder:text-parch-ink/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div class="mt-6 flex items-center justify-between gap-3">
                <span class="text-xs text-parch-ink/50">
                  <template v-if="!store.canSubmit">选一个选项，或写下你的答案</template>
                  <template v-else-if="events.length + 1 >= FLOOR">可继续旅程，也可见证本命精灵</template>
                  <template v-else>至少还有 {{ FLOOR - (events.length + 1) }} 幕才会收尾</template>
                </span>
                <button
                  class="btn-gold inline-flex shrink-0 items-center gap-1.5 rounded-lg px-6 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!store.canSubmit || submitting"
                  @click="onSubmit"
                >
                  {{ submitting ? '记录中…' : '继续旅程' }}
                  <svg v-if="!submitting" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </button>
              </div>
            </div>
          </Transition>

          <p v-if="anyTyping" class="mt-6 text-xs text-parch-ink/30">轻触或按空格跳过 ›</p>
          <div class="gold-rule mt-5" />
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
