import { resolve } from 'node:path'

import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)

const LOCALE_PAIRS = [
  {
    name: 'text',
    zhPath: resolve('src/i18n/locales/text/zh-CN.ts'),
    enPath: resolve('src/i18n/locales/text/en-US.ts'),
  },
  {
    name: 'questions',
    zhPath: resolve('src/i18n/locales/questions/zh-CN.ts'),
    enPath: resolve('src/i18n/locales/questions/en-US.ts'),
  },
]

const getValueType = (value) => {
  if (Array.isArray(value)) return 'array'
  if (value === null) return 'null'
  return typeof value
}

const collectShape = (value, path, shape) => {
  const currentPath = path || '<root>'
  const type = getValueType(value)
  shape.set(currentPath, type)

  if (Array.isArray(value)) {
    shape.set(`${currentPath}.__len`, String(value.length))
    value.forEach((item, index) => {
      collectShape(item, `${currentPath}[${index}]`, shape)
    })
    return
  }

  if (type === 'object') {
    Object.entries(value).forEach(([key, child]) => {
      const childPath = path ? `${path}.${key}` : key
      collectShape(child, childPath, shape)
    })
  }
}

const compareShapes = (leftShape, rightShape, leftLabel, rightLabel) => {
  const errors = []

  for (const [path, leftType] of leftShape.entries()) {
    if (!rightShape.has(path)) {
      errors.push(`[missing] ${rightLabel} 缺少键: ${path}`)
      continue
    }
    const rightType = rightShape.get(path)
    if (leftType !== rightType) {
      errors.push(`[type] ${path} 类型不一致: ${leftLabel}=${leftType}, ${rightLabel}=${rightType}`)
    }
  }

  return errors
}

const run = () => {
  const allErrors = []

  for (const pair of LOCALE_PAIRS) {
    const zhModule = jiti(pair.zhPath)
    const enModule = jiti(pair.enPath)
    const zh = zhModule.default ?? zhModule
    const en = enModule.default ?? enModule

    const zhShape = new Map()
    const enShape = new Map()
    collectShape(zh, '', zhShape)
    collectShape(en, '', enShape)

    const zhToEnErrors = compareShapes(zhShape, enShape, 'zh-CN', 'en-US')
    const enToZhErrors = compareShapes(enShape, zhShape, 'en-US', 'zh-CN')

    if (zhToEnErrors.length > 0 || enToZhErrors.length > 0) {
      allErrors.push(`\n[${pair.name}]`)
      allErrors.push(...zhToEnErrors, ...enToZhErrors)
    }
  }

  if (allErrors.length > 0) {
    console.error('i18n 完备性校验失败:')
    console.error(allErrors.join('\n'))
    process.exit(1)
  }

  console.log('i18n 完备性校验通过（zh-CN <-> en-US）')
}

run()
