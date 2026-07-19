---
name: pr-review-rbti
description: Review RBTI pull requests and local diffs for code quality, correctness, security vulnerabilities, privacy risks, performance regressions, and merge readiness. Use when inspecting RBTI code changes, running gh pr view/diff/checks, drafting review findings, or submitting a GitHub review.
---

# RBTI PR 审核

## 目标

重点发现会影响正确性、安全性、隐私、性能和长期维护的实际问题。不要复述项目基本规范，不审核具体业务写法是否符合个人偏好，也不要为了填满报告制造 finding。

项目是 Nuxt SSR 应用，通过 Nitro 服务端代理外部 LLM。审核安全边界时重点区分浏览器、服务端和外部模型。

## 流程

1. 读取仓库根目录 `AGENTS.md`。
2. 确认 PR 意图、base、head、文件范围、diff 和 checks。不要假定 base 一定是 `main`。

```bash
gh pr view <PR> --json number,title,body,author,baseRefName,headRefName,files,commits,additions,deletions,url
gh pr diff <PR> --patch --color=never
gh pr checks <PR>
```

3. 沿变更的调用链读取必要完整文件、调用方、类型和配置，不只看 patch。
4. 区分当前 PR 引入的问题和基线已有问题。只有当前变更新增、扩大、触发或依赖的问题才作为 finding。
5. 对每个候选 finding 证明：存在可达的失败或攻击路径、影响明确、能定位到代码。无法证明时不要升级为阻塞问题。
6. 按风险运行可用验证。不要安装依赖，不修改、暂存或提交用户代码。
7. 默认只输出审核报告。只有用户明确要求提交 review 时才执行 GitHub 写操作。

## 代码质量

从以下角度检查实际回归：

- **正确性**：边界值、空值、错误分支、状态转换、返回值和前后端契约是否可靠。
- **异步与资源**：并发竞态、旧响应覆盖新状态、重复提交、取消、超时、重试，以及 timer、stream、reader、listener、observer 的清理。
- **错误处理**：异常是否被吞掉，失败后状态是否可恢复，错误信息是否误导用户或掩盖根因。
- **类型安全**：是否把网络、LLM 或用户输入直接断言为可信类型；是否出现无依据的 `any`、非空断言或忽略类型检查。
- **可维护性**：职责是否清晰，是否重复逻辑、产生隐式耦合、留下死代码或使调用方契约难以理解。
- **性能**：是否引入无界数据增长、重复请求、高频深拷贝、平方级解析/渲染、阻塞主线程或明显资源泄漏。
- **兼容性**：SSR/水合、浏览器环境、移动端交互和部署运行时是否仍可用。
- **验证覆盖**：高风险路径是否有测试、构建检查或可复现的人工验证；不要只检查 happy path。

只对会导致行为错误、维护风险显著增加或验证不足以支撑高风险改动的问题提出 finding。纯命名、格式和个人架构偏好通常不值得评论。

## 安全与隐私

优先检查变更触及的信任边界：

- **密钥与敏感数据**：API key、token、环境变量、用户输入、prompt 和上游响应是否进入客户端包、日志、错误正文、监控或公开配置。
- **输入与输出验证**：客户端 body、URL、外部 API 响应和 LLM 输出是否有运行时校验、大小限制、允许值限制和安全 fallback。
- **注入风险**：`v-html`、Markdown/HTML、URL、模板、请求头和命令是否可能造成 XSS、prompt injection、header injection 或其他代码/内容注入。
- **服务端请求**：外部目标是否可被用户控制，是否可能形成 SSRF、开放代理、凭据转发或恶意重定向。
- **接口滥用**：公网接口是否缺少必要的限流、超时、并发限制、请求取消、body/token 上限，导致费用或拒绝服务风险。
- **访问控制**：需要保护的服务端操作是否只依赖客户端状态，是否存在越权、IDOR、绕过校验或信任可伪造标识。
- **错误与日志**：错误是否泄露凭据、供应商细节、完整用户内容或内部实现；日志是否包含不必要的私密数据。
- **浏览器安全**：外链、远程资源、跨域请求、cookie 和不可信内容渲染是否使用合适的隔离与安全属性。
- **依赖与配置**：新增依赖、锁文件、运行时配置和部署变化是否扩大供应链或暴露面。

不要只凭危险 API 名称报告漏洞。说明攻击者可控制什么、数据如何流向危险点、现有保护为何不足、最终影响是什么。若输入不可控或已有可靠校验，不提出漏洞 finding。

## 验证

根据变更范围选择验证：

```bash
npm exec nuxi typecheck
npm run build
```

- 不因缺少 `node_modules` 自行安装依赖；记录未运行原因。
- 视觉、交互、导航或端到端链路变化时，按根目录规范使用 `$playwright-cli`；缺少服务或 API key 时如实记录覆盖缺口。
- PR 没有关联 checks 时明确写“不适用”或“未配置”，不要写成通过。
- 基线已有验证失败不自动阻塞当前 PR；若当前 diff 扩大或依赖该失败，则按实际影响定级。
- 验证命令通过不等于代码安全或行为正确，仍需完成数据流和攻击路径分析。

## 严重性

| 前缀 | 含义 |
|---|---|
| **阻塞:** | 可利用的高影响安全漏洞、密钥泄露、跨用户数据泄漏、数据丢失或核心生产路径必然失败 |
| **必须修改:** | 合并前应修复的正确性、安全、竞态、资源、契约或明显性能问题 |
| **建议:** | 影响有限但有明确收益的质量、安全加固或可维护性改进 |
| **说明:** | 验证缺口、基线风险或不要求当前 PR 处理的上下文 |

每条 finding 都要包含位置、触发或攻击场景、影响和最小修复方向。优先使用最小必要严重性；不要用“可能”“也许”代替证据。

## 输出格式

输出审核结论前读取并遵循 [`references/output-format.md`](references/output-format.md)。

## 提交 GitHub review

仅在用户明确要求提交时执行。可定位 finding 优先作为 inline comment；跨文件问题和验证缺口放顶层 body。

- 存在阻塞或必须修改项：`REQUEST_CHANGES`。
- 只有建议或说明：`COMMENT`。
- 无可行动 finding 且验证充分：`APPROVE`。
- GitHub 不允许作者审核自己的 PR 时：使用 `COMMENT`，正文仍写真实结论。

先从 patch 确认目标行位于 diff。新增代码使用 `RIGHT` 和新行号，删除导致的问题使用 `LEFT` 和旧行号；不要强挂到无关行。

```bash
gh api --method POST repos/{owner}/{repo}/pulls/<PR>/reviews --input /tmp/pr-review.json
gh pr review <PR> --approve --body-file /tmp/pr-review-body.md
gh pr review <PR> --request-changes --body-file /tmp/pr-review-body.md
gh pr review <PR> --comment --body-file /tmp/pr-review-body.md
```

## 完成检查

- [ ] 已确认 PR 意图、base、head、diff 和 checks
- [ ] 已沿调用链检查变更影响，不只看 patch
- [ ] 已检查适用的代码质量和安全风险
- [ ] 每条 finding 都有可达场景、影响、位置和修复方向
- [ ] 已区分当前回归与基线问题
- [ ] 已运行适当验证或说明未运行原因
- [ ] 仅在明确授权后提交 GitHub review
