import { RejctedFn, ResolvedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejctedFn
}
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    // 拦截器数据
    this.interceptors = []
  }
  use(resolved: ResolvedFn<T>, rejected?: RejctedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }
  // 提供 forEach 方法 遍历拦截器
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
  eject(id: number): void {
    // 删除 ID 时不能改变数组长度，否则 ID 错乱
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
