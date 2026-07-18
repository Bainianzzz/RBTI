// 宽松解析被 markdown 围栏或多余文字包裹的 JSON 对象。
export function parseJsonLoose<T>(raw: string): T {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenceMatch ? fenceMatch[1]! : trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('LLM 返回的内容不是有效 JSON')
  }
  return JSON.parse(candidate.slice(start, end + 1)) as T
}

// 从未完成 JSON 中提取字符串字段的已写入部分。
export function extractStringField(raw: string, key: string): string | undefined {
  const needle = `"${key}"`
  const index = raw.indexOf(needle)
  if (index === -1) return undefined

  let cursor = index + needle.length
  while (cursor < raw.length) {
    const character = raw[cursor]
    if (
      character === ' '
      || character === '\t'
      || character === '\n'
      || character === '\r'
      || character === ':'
    ) {
      cursor++
      continue
    }
    break
  }
  if (raw[cursor] !== '"') return undefined
  cursor++

  let output = ''
  while (cursor < raw.length) {
    const character = raw[cursor]
    if (character === '\\') {
      const next = raw[cursor + 1]
      if (next === undefined) break
      if (next === 'n') output += '\n'
      else if (next === 't') output += '\t'
      else if (next === 'r') output += '\r'
      else if (next === '"') output += '"'
      else if (next === '\\') output += '\\'
      else if (next === '/') output += '/'
      else if (next === 'u' && raw.length >= cursor + 6) {
        const hex = raw.slice(cursor + 2, cursor + 6)
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          output += String.fromCharCode(parseInt(hex, 16))
          cursor += 4
        } else {
          output += next
        }
      } else {
        output += next
      }
      cursor += 2
      continue
    }
    if (character === '"') return output
    output += character
    cursor++
  }
  return output
}

// 从未完成 JSON 中提取数组里已经闭合的字符串项。
export function extractStringArrayField(
  raw: string,
  key: string,
): string[] | undefined {
  const keyIndex = raw.indexOf(`"${key}"`)
  if (keyIndex === -1) return undefined
  const arrayStart = raw.indexOf('[', keyIndex)
  if (arrayStart === -1) return undefined

  const items: string[] = []
  let current = ''
  let inString = false
  let escaped = false

  for (let index = arrayStart + 1; index < raw.length; index++) {
    const character = raw[index]!
    if (!inString) {
      if (character === ']') return items
      if (character === '"') {
        inString = true
        current = ''
      }
      continue
    }
    if (escaped) {
      if (character === 'n') current += '\n'
      else if (character === 't') current += '\t'
      else if (character === 'r') current += '\r'
      else current += character
      escaped = false
      continue
    }
    if (character === '\\') {
      escaped = true
      continue
    }
    if (character === '"') {
      items.push(current)
      inString = false
      continue
    }
    current += character
  }

  return items
}
