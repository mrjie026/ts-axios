import { isDate, isPlainObject } from './util'
function encode(val: string): string {
  // 处理特殊字符
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    // 可能为数组类型
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      // 非数组
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        // 字符串
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      // 有 # 则去掉
      url = url.slice(0, markIndex)
    }
    // 没 ? 拼 ?，否则拼 &
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}
