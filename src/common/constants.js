// localstorage常量类
const localStorageKeys = {
  // 用户账号
  OPERATOR: 'operator',
  // token
  TOKEN: 'token',
  // 系统类型
  SYSTEM: 'system',
  USER_INFO: 'USER_INFO'
}

const dictType = {
  PAY_TYPE: 'PAY_TYPE',
  INCOME_TYPE: 'INCOME_TYPE',
  ACCOUNT_TYPE: 'ACCOUNT_TYPE',
  MEMBER_TYPE: 'MEMBER_TYPE',
  PROJECT_TYPE: 'PROJECT_TYPE',
  MAHJONG_PLAYER: 'MAHJONG_PLAYER',
  PLAY_ADDRESS_TYPE: 'PLAY_ADDRESS_TYPE'
}

const addDictTitle = {
  PAY_TYPE: '支出分类',
  INCOME_TYPE: '收入分类',
  ACCOUNT_TYPE: '账号',
  MEMBER_TYPE: '成员',
  PROJECT_TYPE: '项目'
}

const timeInterval = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR'
}

const orderType = {
  PAY: 0,
  INCOME: 1
}

const weappInfo = {
  MANGOGUANG: 'MANGOGUANG'
}

export {
  localStorageKeys,
  dictType,
  orderType,
  addDictTitle,
  timeInterval,
  weappInfo
}
