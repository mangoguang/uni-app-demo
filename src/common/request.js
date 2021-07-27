import Request from 'luch-request'
import { localStorageKeys } from '@/common/constants'

const { configMap } = require('../../resource.config')
const env = process.env.NODE_ENV
const { baseURL } = configMap[env]
const http = new Request()

http.setConfig((config) => { /* config 为默认全局配置*/
  config.baseURL = baseURL /* 根域名 */
  config.timeout = 6000
  config.firstIpv4 = false // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
  return config
})

http.interceptors.request.use((config) => { // 可使用async await 做异步操作
  const { isLogin } = config.custom
  const token = uni.getStorageSync(localStorageKeys.TOKEN)
  if (isLogin && token) {
    // 设置请求头headers
    config.header = {
      ...config.header,
      'Content-Type': 'application/json; charset=utf-8', // 演示用
      Authorization: token // 演示用
    }
  }
  return config
}, config => { // 可使用async await 做异步操作
  return Promise.reject(config)
})

http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
  //  if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
  //    return Promise.reject(response) // return Promise.reject 可使promise状态进入catch
  // if (response.config.custom.verification) { // 演示自定义参数的作用
  //   return response.data
  // }
  return response.data?.data
}, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
  // const {statusCode} = response
  // switch (statusCode) {
  //   case 401:
  //     // 重新登陆
  //     const loginData = await apiLogin('guang', { password: MD5('427815').toString(), uuid: '123456' })
  //     localStorage.setItem(localStorageKeys.TOKEN, `Bearer ${loginData.data.token}`)
  //     // console.log('重新发起请求')
  //     let { baseURL, url, data, method } = error.config
  //     // console.log(22222222222, { baseURL, url, data }, reload)
  //     let reloadResponse = await reload(method, `${baseURL}${url}`, JSON.parse(data))
  //     // console.log('重发请求结果', reloadResponse)
  //     // return reloadResponse
  //     // toLoginPage()
  //     break;
  //   case 404:
  //     // Toast.fail(data.message)
  //     break;
  //   default:
  //     break;
  // }
  return Promise.reject(response)
})

export default http
