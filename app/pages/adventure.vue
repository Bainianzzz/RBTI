<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAdventureStore, FLOOR, CEILING } from '~/stores/adventure'
import { useTypedText } from '~/composables/useTypedText'

definePageMeta({ layout: false })

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
  <main class="min-h-dvh bg-gradient-to-b from-amber-50 via-stone-50 to-stone-100 px-5 py-8 text-stone-800">
    <div class="mx-auto w-full max-w-2xl">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-xs font-medium tracking-wide text-stone-500">
          精灵契约之日 · 第 {{ Math.min(events.length + 1, CEILING) }} 幕
        </span>
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
          <div
            class="h-full rounded-full bg-amber-500 transition-all duration-500"
            :style="{ width: `${(Math.min(events.length + 1, CEILING) / CEILING) * 100}%` }"
          />
        </div>
        <span class="text-xs tabular-nums text-stone-400">{{ events.length + 1 }}/{{ CEILING }}</span>
      </div>

      <div v-if="phase === 'generating' || phase === 'idle'" class="py-24 text-center">
        <p class="text-sm text-stone-500">
          命运之轮缓缓转动<span class="inline-block animate-pulse">…</span>
        </p>
        <p class="mt-2 text-xs text-stone-400">精灵圣泉正在为你编织下一段奇遇</p>
      </div>

      <div v-else-if="phase === 'concluding'" class="py-24 text-center">
        <p class="text-base font-medium text-stone-700">黄昏降临，精灵圣泉泛起微光</p>
        <p class="mt-2 text-sm text-stone-500">
          你的本命精灵正在显现<span class="inline-block animate-pulse">…</span>
        </p>
      </div>

      <div v-else-if="phase === 'error'" class="py-20 text-center">
        <p class="text-sm text-rose-600">旅途中遇到了一点意外</p>
        <p class="mt-2 max-w-md mx-auto break-all text-xs text-stone-400">{{ error }}</p>
        <button
          class="mt-6 rounded-md bg-stone-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
          @click="store.retry()"
        >
          再试一次
        </button>
      </div>

      <div
        v-else-if="phase === 'answering' && active"
        :key="events.length"
        :class="anyTyping ? 'cursor-pointer' : ''"
        @click="anyTyping ? skipAll() : undefined"
      >
        <article>
          <p
            v-if="active.interlude"
            class="mb-5 border-l-2 border-amber-300/70 pl-4 text-sm italic leading-relaxed text-stone-500"
          >
            <span ref="interludeEl" /><span v-if="interludeTyped.typing.value" class="ml-0.5 inline-block w-0.5 animate-pulse text-stone-400">▌</span>
          </p>

          <h1 class="text-lg font-semibold leading-relaxed text-stone-800">
            <span ref="narrativeEl" /><span v-if="narrativeTyped.typing.value" class="ml-0.5 inline-block w-0.5 animate-pulse text-stone-700">▌</span>
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
                      ? 'border-amber-500 bg-amber-50 text-stone-900 shadow-sm ring-1 ring-amber-500/30'
                      : 'border-stone-200 bg-white/70 text-stone-700 hover:border-amber-300 hover:bg-amber-50/50'
                  "
                  @click="store.selectOption(opt)"
                >
                  <span class="mr-2 inline-block text-amber-500 transition-opacity" :class="active.chosenOption === opt ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'">◆</span>
                  {{ opt }}
                </button>
              </div>

              <div class="mt-6">
                <label class="mb-2 block text-xs font-medium text-stone-500">
                  或者，写下你的心声<span class="font-normal text-stone-400">（可选）</span>
                </label>
                <textarea
                  v-model="freeInput"
                  rows="3"
                  placeholder="用一句话说说你会怎么做、心里在想什么…"
                  class="w-full resize-none rounded-xl border border-stone-200 bg-white/70 px-4 py-3 text-sm leading-relaxed text-stone-800 placeholder:text-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div class="mt-6 flex items-center justify-between gap-3">
                <span class="text-xs text-stone-400">
                  <template v-if="!store.canSubmit">选一个选项，或写下你的答案</template>
                  <template v-else-if="events.length + 1 >= FLOOR">可继续旅程，也可见证本命精灵</template>
                  <template v-else>至少还有 {{ FLOOR - (events.length + 1) }} 幕才会收尾</template>
                </span>
                <button
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition enabled:hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!store.canSubmit || submitting"
                  @click="onSubmit"
                >
                  {{ submitting ? '记录中…' : '继续旅程' }}
                  <svg v-if="!submitting" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
          </Transition>

          <p v-if="anyTyping" class="mt-6 text-xs text-stone-300">轻触或按空格跳过 ›</p>
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
