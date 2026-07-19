# 审核输出格式

将可定位 findings 写成 inline comments，按严重性排序提交。没有 finding 时明确写“未发现阻塞或必须修改项”。省略没有内容的章节，不要为了填满模板制造 finding。

## Inline comment

```markdown
**必须修改:** <标题>

相关代码：`<最小必要表达式或语句>`

场景：...

影响：...

建议：...
```

代码较长时使用短代码块，只引用证明问题所需的几行。inline comment 已关联 diff 行，但仍要显式引用关键表达式或标识符，避免评论脱离代码语境。

## 顶层 review body

```markdown
## 审核结论
通过 / 要求修改 / 评论

## 未挂行 Findings
### **必须修改:** <标题>
- 位置：`path/to/file.ts:42`
- 相关代码：`<最小必要表达式或语句>`
- 场景：...
- 影响：...
- 建议：...

## 验证
- `npm exec nuxi typecheck`：通过 / 失败 / 未运行（原因）
- `npm run build`：通过 / 失败 / 未运行（原因）
- PR checks：通过 / 失败 / 未配置 / 不适用
- Playwright：通过 / 失败 / 不适用 / 未运行（原因）
```

只有建议或说明时仍使用对应严重性前缀。没有未挂行 finding 时省略该章节，在审核结论下直接说明未发现阻塞或必须修改项。不要在顶层 body 重复已经提交的 inline findings。
