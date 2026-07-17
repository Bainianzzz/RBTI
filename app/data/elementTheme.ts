// 18 属性的主题色映射：用于结果页精灵卡等需要按属性着色的地方。
// 取每个属性最具识别度的色相，避免全站单一色调。
import type { PetElement } from '@/types'

export const elementTheme: Record<PetElement, { name: string; from: string; to: string; ring: string; text: string }> = {
  火: { name: '火', from: 'from-orange-500', to: 'to-red-600', ring: 'ring-orange-400/40', text: 'text-orange-600' },
  水: { name: '水', from: 'from-sky-500', to: 'to-blue-700', ring: 'ring-sky-400/40', text: 'text-sky-600' },
  草: { name: '草', from: 'from-emerald-500', to: 'to-green-700', ring: 'ring-emerald-400/40', text: 'text-emerald-600' },
  电: { name: '电', from: 'from-amber-400', to: 'to-yellow-500', ring: 'ring-amber-300/40', text: 'text-amber-500' },
  地: { name: '地', from: 'from-amber-700', to: 'to-yellow-900', ring: 'ring-amber-600/40', text: 'text-amber-700' },
  翼: { name: '翼', from: 'from-cyan-400', to: 'to-teal-500', ring: 'ring-cyan-300/40', text: 'text-cyan-600' },
  虫: { name: '虫', from: 'from-lime-500', to: 'to-emerald-600', ring: 'ring-lime-400/40', text: 'text-lime-600' },
  龙: { name: '龙', from: 'from-indigo-500', to: 'to-violet-700', ring: 'ring-indigo-400/40', text: 'text-indigo-600' },
  幽: { name: '幽', from: 'from-slate-600', to: 'to-zinc-800', ring: 'ring-slate-400/40', text: 'text-slate-500' },
  冰: { name: '冰', from: 'from-cyan-300', to: 'to-sky-500', ring: 'ring-cyan-300/50', text: 'text-cyan-500' },
  光: { name: '光', from: 'from-amber-300', to: 'to-yellow-400', ring: 'ring-amber-300/50', text: 'text-amber-500' },
  幻: { name: '幻', from: 'from-fuchsia-500', to: 'to-purple-700', ring: 'ring-fuchsia-400/40', text: 'text-fuchsia-600' },
  萌: { name: '萌', from: 'from-pink-400', to: 'to-rose-500', ring: 'ring-pink-300/40', text: 'text-pink-500' },
  武: { name: '武', from: 'from-red-700', to: 'to-rose-900', ring: 'ring-red-500/40', text: 'text-red-700' },
  普通: { name: '普通', from: 'from-stone-400', to: 'to-stone-600', ring: 'ring-stone-400/40', text: 'text-stone-500' },
  机械: { name: '机械', from: 'from-zinc-500', to: 'to-slate-700', ring: 'ring-zinc-400/40', text: 'text-zinc-500' },
  恶: { name: '恶', from: 'from-violet-800', to: 'to-slate-900', ring: 'ring-violet-700/40', text: 'text-violet-700' },
  毒: { name: '毒', from: 'from-purple-600', to: 'to-fuchsia-800', ring: 'ring-purple-500/40', text: 'text-purple-600' },
}

export function getElementTheme(el: PetElement) {
  return elementTheme[el] ?? elementTheme['普通']
}
