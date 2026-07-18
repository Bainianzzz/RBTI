# 开发指南

## 技术栈

- Nuxt 4、Vue 3、TypeScript
- Pinia
- Tailwind CSS v4
- DeepSeek OpenAI 兼容接口
- Fetch API、ReadableStream、Server-Sent Events
- lucide-vue-next、typed.js

## 环境要求

- Node.js 20 或更高版本
- npm
- 可用的 DeepSeek API Key

## 本地运行

1. 安装依赖：

```bash
npm ci
```

2. 根据示例创建本地环境变量文件：

```bash
cp .env.example .env
```

编辑 `.env`，填入 DeepSeek 配置：

```dotenv
API_URL=https://api.deepseek.com
API_KEY=your-api-key
API_MODEL=deepseek-v4-flash
```

`API_URL` 不需要包含 `/chat/completions`，服务端代理会自动拼接。`.env` 包含密钥且已被 Git 忽略，请勿提交或公开。

3. 启动开发服务器：

```bash
npm run dev
```

浏览器访问 <http://localhost:3000>。

## 构建与预览

```bash
npm run build
npm run preview
```

项目虽然以 SPA 方式渲染页面，但依赖 Nitro 服务端路由隐藏 API Key 并代理 LLM 请求，因此部署环境必须支持 Nuxt/Nitro 服务端，不能只托管静态文件。

## 项目结构

```text
app/
├── components/          # 全局共享组件
├── composables/         # Vue 组合式函数
├── data/                # 精灵、副本、图片及属性数据
├── lib/llm/             # 提示词、流式请求、叙事与裁决逻辑
├── lib/utils/           # JSON 解析及通用工具
├── pages/               # 首页、冒险页和结果页
├── stores/              # Pinia 冒险状态机
└── assets/css/          # 全局及页面样式
server/api/llm.post.ts   # 服务端 LLM 代理
shared/types/llm.ts      # 前后端共享请求类型
```
