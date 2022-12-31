const toString = Object.prototype.toString
// 类型保护，可以拓展 .toISOString()
export function isDate(val: any): val is Date {
  return toString.call(val) === '[boject Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  // 判断普通对象
  return toString.call(val) === '[object Object]'
}

// 混合函数 >> 使用交叉类型
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
