# 洛克王国：世界本命测试（RBTI）

一个基于 MBTI 维度加权题目的网页测试项目。  
用户完成测试后，会得到对应的精灵人格镜像结果，作为本命精灵，并可一键分享结果链接。

## 体验地址

- GitHub Pages: [https://bainianzzz.github.io/RBTI/](https://bainianzzz.github.io/RBTI/)

## 功能特性

- 18 道探索场景题，按 MBTI 维度权重实时累积分数。
- Pinia 管理答题状态，自动计算最终 MBTI 结果。
- 移动端与桌面端适配。
- 支持复制分享文案与结果链接。
- GitHub Actions 自动构建并部署到 GitHub Pages。

## Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=Bainianzzz/RBTI&type=Date)](https://www.star-history.com/#Bainianzzz/RBTI&Date)

## 技术栈

- 框架/构建：Vue 3 + Vite
- 语言：TypeScript
- 样式：Tailwind CSS
- 状态/路由：Pinia + Vue Router
- 国际化：vue-i18n
- 工具库：@vueuse/core + @headlessui/vue
- UI/交互：Lucide + vue-sonner
- 质量/测试：oxlint + ESLint + Vitest
- 资源处理：sharp (WebP 优化)

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
