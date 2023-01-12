// 所有请求的文件
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCreadentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownLoadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    // 创建 request 实例
    const request = new XMLHttpRequest()
    // request.open 初始化。 // method 固定大写，设置 true 异步请求
    request.open(method.toUpperCase(), url!, true)
    // config 方法配置 request 对象
    configureRequest()
    // 添加事件处理函数
    addEvents()
    // 处理请求 headers
    progressHeaders()
    // 处理请求取消逻辑
    processCancel()
    // 发送请求
    request.send(data)

    // ************* 整合代码
    // config 配置代码整合
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCreadentials) {
        request.withCredentials = withCreadentials
      }
    }
    // 事件代码整合
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      // 处理网络异常错误
      request.onerror = function handleError() {
        reject(createError('NetWork Error', config, null, request))
      }
      // 处理超时问题
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownLoadProgress) {
        request.onprogress = onDownLoadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }
    // headers 方法整合
    function progressHeaders(): void {
      // 如果为 form-data 类型，则删除 headers Content-Type 属性
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if (withCreadentials || (isURLSameOrigin(url!) && xsrfCookieName)) {
        const xsrfValue = cookie.read(xsrfCookieName!)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }
      if (auth) {
        // base 64 : btoa // Basic 拼接 base64
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        //   console.log('name', name, headers[name])
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          // 将传入的参数设置到请求头中
          request.setRequestHeader(name, headers[name])
        }
      })
    }
    //  Cancel 方法整合
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
    // ************* 整合代码 end

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
