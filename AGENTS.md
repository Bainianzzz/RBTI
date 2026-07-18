## 技术栈

- Nuxt 4（`app/` srcDir，全局 SSR）+ Vue 3 `<script setup>` + TypeScript
- Pinia 状态管理；Tailwind v4（`@tailwindcss/postcss`）
- DeepSeek LLM（`app/lib/llm/`，客户端流式请求）；lucide-vue-next 图标
- 依赖安装由用户自行 `npm i`，不要代跑
- 全部使用组合式风格，不允许使用选项式

## SSR规范

- 项目默认启用全局 SSR；所有页面和组件必须兼容服务端渲染
- 浏览器专属逻辑放在 `onMounted` 或 `import.meta.client` 中，SSR 阶段不得请求 LLM
- API Key 仅保存在服务端，客户端只能请求项目自身的 API

## 目录结构

```
app/
├── components/         # 全局自动导入（ContractButton、PageShell、GoldRule…）
├── composables/        # 全局自动导入的组合式函数
├── pages/              # index.vue；页面目录用 index.vue 编排、_components 放私有组件
├── assets/css/         # main.css 全局样式；<page>/ 放页面私有样式
├── stores/adventure.ts   # 冒险状态机
├── lib/<module>/         # 独立模块目录；index.ts 仅导出公共 API，逻辑按职责拆文件
├── data/                 # pets、eventSeeds、petImages、elementTheme
└── types/
```

`_components/`、`_partials/` 已在 `.nuxtignore` 排除，不进路由扫描。
`app/pages/result/dev/` 是本地预览路由，已 gitignore，永不部署。

## 提交规则

仅当用户明确说"提交"时才提交。流程：① `$nuxt` skill 检查本轮改动是否符合最佳实践，不符先改；② `$commit` skill 起草信息并提交。message 用英文

## Playwright CLI 时机

改动涉及视觉、交互、页面跳转、LLM 端到端链路时，用 `$playwright-cli` 打开 `localhost:3000` 实测。纯样式微调、类型修复、文档无需启动浏览器。产物落 `.playwright-cli/`，已 gitignore。
