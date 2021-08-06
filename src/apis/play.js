import { post, del } from './utils'

// 获取牌局列表
export const apiGetMahjongList = (data) => post('/v1/mahjong/list', data, { isLogin: true })

// 新增牌局
export const apiAddMahjong = (params) => post('/v1/mahjong', params)

// 删除牌局
export const apiDelMahjong = (id) => del(`/v1/mahjong/${id}`)
