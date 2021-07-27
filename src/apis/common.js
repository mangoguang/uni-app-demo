import { get } from './utils'

export const apiLogin = (userName, params) => {
  return get(`login/${userName}`, params)
}
