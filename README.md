# 洛克世界人格镜像（RBTI）

一个基于 MBTI 维度加权题目的网页测试项目。  
用户完成测试后，会得到对应的精灵人格镜像结果，并可一键分享结果链接。

## 在线地址

- GitHub Pages: [https://bainianzzz.github.io/RBTI/](https://bainianzzz.github.io/RBTI/)
- 项目仓库: [https://github.com/Bainianzzz/RBTI](https://github.com/Bainianzzz/RBTI)

## 功能特性

- 12 道探索场景题，按 MBTI 维度权重实时累积分数。
- Pinia 管理答题状态，自动计算最终 MBTI 结果。
- 结果页根据 MBTI 映射精灵信息、性格标签与 Wiki 跳转。
- 移动端与桌面端适配，桌面端支持垂直居中展示。
- 支持复制分享文案与结果链接，含 GitHub Star 引导按钮。
- GitHub Actions 自动构建并部署到 GitHub Pages。

## Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=Bainianzzz/RBTI&type=Date)](https://www.star-history.com/#Bainianzzz/RBTI&Date)

## 技术栈

- Vue 3（`<script setup>`）
- TypeScript（严格模式）
- Vite
- Tailwind CSS
- Pinia
- Vue Router
- Lucide Vue Next
- VueUse

## 项目结构

- `src/types/`：核心类型定义（题目、维度、精灵）
- `src/data/`：题库与精灵数据
- `src/stores/`：答题状态管理
- `src/views/Quiz.vue`：答题页
- `src/views/Result.vue`：结果页
- `src/router/`：路由及结果页访问守卫
