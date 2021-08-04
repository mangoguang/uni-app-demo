import { post } from './utils'

// 获取用户收支信息
export const apiPayInfo = () => post('/v1/users/payInfo')

// 根据jsCode获取用户信息
export const apiGetUserInfoByCode = (params) => post('/v1/users/getUserInfoByCode', params, { isLogin: false })
