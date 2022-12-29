// 所有请求的文件
import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = config

  const request = new XMLHttpRequest()
  // method 固定大写，设置 true 异步请求
  request.open(method.toUpperCase(), url, true)

  request.send(data)
}
