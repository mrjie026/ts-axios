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
