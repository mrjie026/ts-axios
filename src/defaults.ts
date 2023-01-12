import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  // token 对应 cookie 名称
  xsrfCookieName: 'XSRF-TOKEN',
  // header 中的 token 对应的 header 名称
  xxrfHeaderName: 'X-XSRF-TOKEN',
  // 请求数据默认配置
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  // 响应数据默认配置
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ],
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}
const methodNoData = ['delete', 'get', 'head', 'options']
methodNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
