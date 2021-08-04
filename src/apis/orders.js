import { get, post, del, put } from './utils'
// 新增订单
export const apiAddOrder = (params) => post('/v1/order', params)

// 删除订单
export const apiDelOrder = (id) => del(`/v1/order/${id}`)

// 更新订单
export const apiUpdateOrder = (id, params) => put(`/v1/order/${id}`, params)

// 获取订单详情
export const apiOrderDetail = (id) => get(`/v1/order/${id}`)

// 订单列表
export const apiOrderList = (params) => post('/v1/order/list', params)
