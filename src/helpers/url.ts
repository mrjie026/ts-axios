import { isDate, isPlainObject, isURLSearchParams } from './util'
interface URLOrigin {
  protocol: string
  host: string
}

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
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
    serializedParams = parts.join('&')
  }

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

export function isAbsoluteURL(url: string): boolean {
  // 判断是否绝对路径
  return /(^[a-z][a-z\d+\-\.]*:)?\/\//i.test(url)
}
export function combineURL(baseURL: string, relativeURL?: string) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// 判断是否同源(协议和域名是否一致)
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

//
const urlParsingNode = document.createElement('a')
// 当前页面的来源
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
