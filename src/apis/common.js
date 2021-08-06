import { post, get, del } from './utils'

export const apiLogin = (userName, params) => {
  return get(`login/${userName}`, params)
}

// 获取数据字典列表
export const apiDictList = (dictType) => get(`/v1/dict/list/${dictType}`)

// 新增数据字典
export const apiAddDict = (params) => post('/v1/dict', params)

// 删除数据字典
export const apiDelDict = (dictCode) => del(`/v1/dict/${dictCode}`)
