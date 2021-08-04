import { get } from './utils'

export const apiLogin = (userName, params) => {
  return get(`login/${userName}`, params)
}

// 获取数据字典列表
export const apiDictList = (dictType) => get(`/v1/dict/list/${dictType}`)
