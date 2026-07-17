// 基于 typed.js 的打字机封装：单元素逐字显示。
// 在客户端 onMounted/watch 后初始化，SSR 安全。
// 用法：
//   const el = ref<HTMLElement | null>(null)
//   const t = useTypedText(el, () => props.text)
//   t.run()                  // 开始打字
//   t.skip()                 // 跳过，直接显示全文
//   t.onComplete(() => {})   // 打完回调

import Typed from 'typed.js'
import type { Ref } from 'vue'

export interface TypedRunOptions {
  typeSpeed?: number
  startDelay?: number
}

export function useTypedText(
  elRef: Ref<HTMLElement | null>,
  textGetter: () => string,
) {
  const typing = ref(false)
  const done = ref(false)
  let instance: Typed | null = null
  let onCompleteCb: (() => void) | null = null

  function destroy() {
    if (instance) {
      instance.destroy()
      instance = null
    }
    typing.value = false
  }

  // 开始（或重新开始）打字。DOM 必须已存在，调用方负责在渲染后触发。
  function run(opts: TypedRunOptions = {}) {
    if (!import.meta.client) return
    const el = elRef.value
    if (!el) return
    destroy()
    done.value = false
    const text = textGetter()
    if (!text) {
      done.value = true
      onCompleteCb?.()
      return
    }
    typing.value = true
    instance = new Typed(el, {
      strings: [text],
      typeSpeed: opts.typeSpeed ?? 38,
      startDelay: opts.startDelay ?? 0,
      showCursor: false,
      contentType: 'null',
      onComplete: () => {
        typing.value = false
        done.value = true
        onCompleteCb?.()
      },
    })
  }

  // 跳过打字，直接显示全文并触发完成回调
  function skip() {
    if (!instance && !typing.value) {
      // 从未启动（如无文本），无需跳过
      if (done.value) return
    }
    const el = elRef.value
    destroy()
    if (el) {
      el.textContent = textGetter()
    }
    typing.value = false
    done.value = true
    onCompleteCb?.()
  }

  function onComplete(cb: () => void) {
    onCompleteCb = cb
  }

  onScopeDispose(() => destroy())

  return { typing, done, run, skip, onComplete, destroy }
}
