import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
// 工厂函数
function createInstance() {
  const context = new Axios()
  // 绑定 this 上下文
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
