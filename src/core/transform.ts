import { AxiosTransformer } from '../types'
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  // 转换数组进行遍历
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 链式调用
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
