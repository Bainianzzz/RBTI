<script setup lang="ts">
import { ExternalLink, RotateCcw } from 'lucide-vue-next'
import { useAdventureStore } from '~/stores/adventure'
import { petById } from '~/data/pets'
import { petImageUrl } from '~/data/petImages'
import '~/assets/css/result/reveal.css'

// 揭卡：立绘 + 名称 + 标签 + 判词 + 操作按钮。
// 由 index.vue 在 ritual === 'revealed' 时渲染，因此 verdict 一定存在。
const store = useAdventureStore()
const { verdict } = storeToRefs(store)

// 父级 v-if 保证 verdict 非空，收窄一次供模板直接使用
const result = computed(() => verdict.value!)

const pet = computed(() => (verdict.value ? petById[verdict.value.petId] : undefined))
const imgUrl = computed(() => (pet.value ? petImageUrl(pet.value.name) : undefined))

// 裁决结果可能是 50 只里任意一只；若 LLM 返回了库里不存在的 id，回退到首只并提示
const fallbackMismatch = computed(() => verdict.value && !petById[verdict.value.petId])

function replay() {
  store.reset()
  navigateTo('/adventure')
}
</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <Transition name="reveal" appear>
      <article v-if="pet">
        <GoldRule diamond="none" class="mb-5">
          <p class="text-center font-display text-3xl font-black tracking-[0.18em] text-gold">
            你的本命精灵
          </p>
        </GoldRule>

        <!-- 精灵大卡：左侧立绘（100% 高度） + 右侧内容（含判词，同一容器） -->
        <div class="paper-panel flex flex-col overflow-hidden rounded-3xl md:flex-row">
          <!-- 左：精灵立绘 -->
          <div
            class="relative flex shrink-0 items-center justify-center bg-paper md:w-2/5 md:border-r-2 md:border-paper-ink/10"
          >
            <img
              v-if="imgUrl"
              :src="imgUrl"
              :alt="pet.name"
              class="h-full max-h-[320px] w-full object-contain p-5 md:max-h-none md:p-7"
              loading="lazy"
              @error="(e: Event) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <span v-else class="text-7xl font-black text-paper-ink/80">{{
              pet.name.charAt(0)
            }}</span>
            <!-- 属性 / 稀有度：浮在图上 -->
            <div class="absolute right-3 top-3 flex flex-col items-end gap-1.5">
              <span
                class="rounded-md border border-gold/50 bg-coal px-3 py-1 text-base font-black text-gold"
                >{{ pet.element }}属性</span
              >
              <span class="rounded-md bg-coal px-3 py-1 text-base font-bold text-ink">{{
                pet.rarity
              }}</span>
            </div>
          </div>

          <!-- 右：名称 + 标签 + 判词 -->
          <div class="flex flex-1 flex-col gap-5 bg-paper p-6 md:p-8 lg:p-10">
            <div>
              <h1 class="font-display text-5xl font-black text-paper-ink">{{ pet.name }}</h1>
              <p class="mt-2 text-lg font-bold text-paper-ink/55">「{{ pet.archetype }}」</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="t in pet.traits"
                  :key="t"
                  class="rounded-md bg-coal px-3 py-1.5 text-base font-bold text-gold"
                  >{{ t }}</span
                >
              </div>
            </div>

            <!-- 判词（与精灵图同一个大容器） -->
            <div class="border-t-2 border-paper-ink/10 pt-3">
              <p class="mb-1 font-display text-2xl font-black text-gold-deep">契约判词</p>
              <p class="text-lg font-medium leading-8 text-paper-ink/85">
                {{ result.verdict }}
              </p>
              <p
                v-if="result.resonance"
                class="mt-4 border-l-4 border-sun pl-4 text-base italic leading-7 text-paper-ink/55"
              >
                {{ result.resonance }}
              </p>
            </div>

            <p
              class="border-t border-paper-ink/10 pt-4 text-base font-medium leading-7 text-paper-ink/55"
            >
              {{ pet.personality }}
            </p>
          </div>
        </div>

        <p v-if="fallbackMismatch" class="mt-4 text-center text-base text-amber-400/70">
          （注：圣泉显影出现偏差，已回退展示。）
        </p>

        <!-- 操作 -->
        <div
          class="mt-8 flex flex-col-reverse items-stretch justify-center gap-4 sm:flex-row sm:items-center"
        >
          <ContractButton
            :href="pet.wikiUrl"
            :icon="ExternalLink"
            target="_blank"
            rel="noopener"
            class="text-lg"
          >
            查看图鉴
          </ContractButton>
          <ContractButton :icon="RotateCcw" class="text-lg" @click="replay">
            再启新旅程
          </ContractButton>
        </div>
      </article>
    </Transition>
  </div>
</template>
