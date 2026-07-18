# RBTI · 本命精灵契约

一个基于《洛克王国：世界》手游世界观的 AI 性格测试原型。

系统会随机选择一个真实副本作为本局舞台，由 DeepSeek 根据玩家的每次选择实时续写探索剧情。冒险结束后，模型会分析整段旅程中体现出的性格倾向，从精灵库中选出唯一一只最契合的本命精灵，并生成契约判词。

> 本项目为非官方同人原型，与腾讯及《洛克王国：世界》官方无关。AI 生成内容仅供娱乐参考。

## 主要功能

- **随机副本探索**：每局从 BWIKI 收录的副本中随机选择一个，整段故事围绕该副本展开。
- **AI 动态叙事**：玩家的选择会影响路线、谜题、遭遇和战斗，下一幕由 DeepSeek 实时生成。
- **选项与自由回答**：每题提供 3-4 个选项，同时允许玩家输入自己的行动或想法。
- **流式内容展示**：通过 Fetch API、ReadableStream 和 SSE 流式接收模型内容，减少等待感。
- **滚动故事记忆**：每轮更新故事摘要，在保持剧情连贯的同时控制请求长度。
- **本命精灵匹配**：根据整段冒险中的回答，从约 50 只、覆盖全部属性的精灵中匹配唯一结果。
- **契约结果页**：展示精灵图片、属性、特征、性格介绍和 AI 生成的契约判词。
- **无账号与持久化**：不需要登录，回答和结果仅保存在当前页面会话中。

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

3. 编辑 `.env`，填入 DeepSeek 配置：

```dotenv
API_URL=https://api.deepseek.com
API_KEY=your-api-key
API_MODEL=deepseek-v4-flash
```

`API_URL` 不需要包含 `/chat/completions`，服务端代理会自动拼接。`.env` 包含密钥且已被 Git 忽略，请勿提交或公开。

4. 启动开发服务器：

```bash
npm run dev
```

浏览器访问 <http://localhost:3000>。

## 构建与预览

生成生产构建：

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

项目虽然以 SPA 方式渲染页面，但依赖 Nitro 服务端路由隐藏 API Key 并代理 LLM 请求，因此部署环境必须支持 Nuxt/Nitro 服务端，不能只托管静态文件。

## 工作流程

1. 玩家从首页开始契约。
2. 应用随机抽取一个副本 seed，并请求 DeepSeek 生成第一幕。
3. 玩家选择预设行动，也可以补充自己的回答。
4. 模型结合副本背景、故事摘要和最新回答生成下一幕，并判断副本是否已经完成。
5. 副本结束后，模型根据全部回答匹配本命精灵并生成判词。

精灵白名单来自 `app/data/pets.ts`。叙事中允许出现的精灵严格受该名单限制，避免混入其他作品或《洛克王国》网页版独有设定。

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

## 数据与素材来源

- 《洛克王国：世界》官网：<https://rocom.qq.com/>
- 《洛克王国：世界》BWIKI：<https://wiki.biligame.com/rocom/首页>
- 副本资料：<https://wiki.biligame.com/rocom/副本图鉴>
- 精灵图鉴图片由 BWIKI/patchwiki 提供，相关页面链接记录在项目数据文件中。

游戏名称、世界观、角色及美术素材版权归其各自权利方所有。
