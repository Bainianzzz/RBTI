# 审核输出格式

先列 findings，按严重性排序。没有 finding 时明确写“未发现阻塞或必须修改项”。省略没有内容的章节，不要为了填满模板制造 finding。

```markdown
## 审核结论
通过 / 要求修改 / 评论

## Findings
### **必须修改:** <标题>
- 位置：`path/to/file.ts:42`
- 场景：...
- 影响：...
- 建议：...

## 验证
- `npm exec nuxi typecheck`：通过 / 失败 / 未运行（原因）
- `npm run build`：通过 / 失败 / 未运行（原因）
- PR checks：通过 / 失败 / 未配置 / 不适用
- Playwright：通过 / 失败 / 不适用 / 未运行（原因）
```

只有建议或说明时仍放在 `Findings` 下并使用对应严重性前缀。没有 finding 时省略 `Findings`，在审核结论下直接说明未发现阻塞或必须修改项。
