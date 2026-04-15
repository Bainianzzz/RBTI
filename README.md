# 洛克王国：世界本命测试（RBTI）

[![Pages Visits](https://visitor-badge.laobi.icu/badge?page_id=bainianzzz.rbti-pages&left_text=Pages%20Visits)](https://bainianzzz.github.io/RBTI/)

一个基于 MBTI 维度加权题目的网页测试项目。  
用户完成测试后，会得到对应的精灵人格镜像结果，作为本命精灵，并可一键分享结果链接或者图片。
每次刷新结果页面，有可能出现自己本命精灵的异色形态。

## 体验地址

- GitHub Pages: [https://bainianzzz.github.io/RBTI/](https://bainianzzz.github.io/RBTI/)

## 功能特性

- 18 道场景题按 MBTI 维度实时加权，自动生成本命精灵结果。
- 结果页支持孵蛋动画、打字机标题与 10% 概率异色精灵。
- 支持分享链接与结果图片导出（移动端下载 / 桌面端弹窗预览）。
- 中英文双语（`zh-CN` / `en-US`）文案切换。
- GitHub Pages 自动部署，移动端与桌面端均适配。

## Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=Bainianzzz/RBTI&type=Date)](https://www.star-history.com/#Bainianzzz/RBTI&Date)

## 技术栈

- 前端框架：Vue 3 + Vite + TypeScript
- 状态与路由：Pinia + Vue Router
- 样式与组件：Tailwind CSS + Reka UI + Headless UI
- 国际化：vue-i18n
- 结果导出：@zumer/snapdom
- 交互与图标：vue-writer + vue-sonner + lucide-vue-next
- 代码质量：ESLint + oxlint + Vitest

## 项目结构

```
RBTI/
├─ src/
│  ├─ assets/pets/           # 宠物 webp 静态资源
│  ├─ components/            # 通用组件（如 AppToaster、图表等）
│  ├─ data/
│  │  ├─ questions.ts        # 题目权重与业务数据
│  │  └─ pets.ts             # MBTI 到宠物信息映射
│  ├─ i18n/                  # 国际化初始化
│  ├─ locales/
│  │  ├─ text/               # 页面文案（zh-CN / en-US）
│  │  └─ questions/          # 题库文案（zh-CN / en-US）
│  ├─ router/                # 路由配置
│  ├─ stores/                # Pinia 状态管理（答题流程/结果）
│  ├─ types/                 # 类型定义
└─ └─ views/
      ├─ Quiz.vue            # 答题页
      └─ Result.vue          # 结果页（宠物展示、分享、提示）
```
