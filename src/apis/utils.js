import http from '@/common/request'

export const post = (url, data = {}, options = {}) => {
  return http.request({
    method: 'POST', // 请求方法必须大写 [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE]
    url,
    data,
    custom: options, // 自定义参数
    // 返回当前请求的task, options。请勿在此处修改options。非必填
    getTask: (task, options) => {
      // setTimeout(() => {
      //   task.abort()
      // }, 500)
    }
  })
}

export const get = (url, params = {}, options = {}) => {
  return http.request({
    method: 'GET', // 请求方法必须大写 [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE]
    url,
    // data,
    params,
    custom: options, // 自定义参数
    // 返回当前请求的task, options。请勿在此处修改options。非必填
    getTask: (task, options) => {
      // setTimeout(() => {
      //   task.abort()
      // }, 500)
    }
  })
}

export const reload = (method, url, data = {}, options = {}) => {
  const methodObj = {
    post: () => post(url, data, options),
    get: () => get(url, data, options)
  }
  return methodObj[method]()
}
