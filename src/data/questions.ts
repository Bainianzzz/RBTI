import type { Question } from '@/types'

export const questions: Question[] = [
  {
    id: 1,
    text: '你第一次进入轻风山地时，更想先做什么？',
    options: [
      { text: '和路过训练师聊天套情报', weights: { E: 2, N: 1 } },
      { text: '先观察地形和可采集资源', weights: { I: 2, S: 1 } },
    ],
  },
  {
    id: 2,
    text: '遇到遗迹机关谜题，你会怎么处理？',
    options: [
      { text: '先按直觉尝试激活组合', weights: { N: 2, P: 1 } },
      { text: '记录线索并按顺序推演', weights: { S: 1, J: 2 } },
    ],
  },
  {
    id: 3,
    text: '队友想临时改路线去抓稀有宠物，你会？',
    options: [
      { text: '支持，临场变化更有惊喜', weights: { P: 2, E: 1 } },
      { text: '先看是否影响主线目标', weights: { J: 2, T: 1 } },
    ],
  },
  {
    id: 4,
    text: '在营地分配补给时你更看重？',
    options: [
      { text: '每个人都能安心继续探索', weights: { F: 2, I: 1 } },
      { text: '按战斗贡献优先分配效率最高', weights: { T: 2, J: 1 } },
    ],
  },
  {
    id: 5,
    text: '面对未知天气区域，你会？',
    options: [
      { text: '凭经验快速试探边界', weights: { S: 1, P: 2 } },
      { text: '先推测气候规律再行动', weights: { N: 2, J: 1 } },
    ],
  },
  {
    id: 6,
    text: '你更喜欢哪种探索节奏？',
    options: [
      { text: '高频互动、一路触发事件', weights: { E: 2, P: 1 } },
      { text: '沉浸探索、稳步推进地图', weights: { I: 2, J: 1 } },
    ],
  },
  {
    id: 7,
    text: '发现疑似隐藏剧情 NPC 时，你倾向？',
    options: [
      { text: '先感受角色动机再选择对话', weights: { F: 2, N: 1 } },
      { text: '先确认奖励与任务收益', weights: { T: 2, S: 1 } },
    ],
  },
  {
    id: 8,
    text: '打 Boss 前准备环节你会？',
    options: [
      { text: '预设站位和技能循环', weights: { J: 2, T: 1 } },
      { text: '保留弹性，视局势临时应变', weights: { P: 2, N: 1 } },
    ],
  },
  {
    id: 9,
    text: '当队伍出现分歧时你更可能？',
    options: [
      { text: '主动发言推动大家达成共识', weights: { E: 2, F: 1 } },
      { text: '先独立思考后给关键建议', weights: { I: 2, T: 1 } },
    ],
  },
  {
    id: 10,
    text: '在精灵培养上你更偏好？',
    options: [
      { text: '依据数值和克制关系精细养成', weights: { S: 2, T: 1 } },
      { text: '根据主题与故事构建队伍', weights: { N: 2, F: 1 } },
    ],
  },
  {
    id: 11,
    text: '地图开荒时你习惯？',
    options: [
      { text: '先清主干线，再补支线', weights: { J: 2, S: 1 } },
      { text: '哪里有趣就先去哪里', weights: { P: 2, E: 1 } },
    ],
  },
  {
    id: 12,
    text: '结算时你更在意哪件事？',
    options: [
      { text: '团队是否玩得开心、彼此认可', weights: { F: 2, E: 1 } },
      { text: '策略是否有效、目标是否达成', weights: { T: 2, I: 1 } },
    ],
  },
]
