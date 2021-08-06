/**
 * 传给后端日期格式化
 * @param {*} date 传入日期
 * @param {*} fmt 显示格式
 * reutrn fmt时间格式
 */
export const sendDateTime = (date, fmt = 'yyyy/MM/dd hh:mm:ss') => {
  if (!date) return
  // if (fmt === 'yyyy-MM-dd') {
  //   date = `${dateFormat(date)} 23:59:59`
  // } else {
  //   date = dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
  // }
  date = dateFormat(date, 'yyyy/MM/dd hh:mm:ss')
  const timestamp = new Date(date).getTime()
  const zone = 8
  const timeDiff = (8 - zone) * 3600 * 1000
  return dateFormat(timestamp + timeDiff, fmt)
}

/**
 * 时间格式化函数
 * @param {*} date 传入日期
 * @param {*} fmt 显示格式
 */
export const dateFormat = (date, fmt = 'yyyy/MM/dd') => {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = date.split('+')[0]
    date = date.replace(/T/g, ' ').replace(/-/g, '/')
    date = new Date(date)
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  var week = { // 星期
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 生成UUID
 * 指定长度和基数
 * @param {*} len UUID长度
 * @param {*} radix 基数
 */
export const uuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 * 防抖动
 * @param {function} fn 需要进行防抖的事件
 * @param {number} delay 间隔时间
 * @param {boolean} immediately 是否立即执行
 * @return {function} 返回事件本身
 */
export const debounce = (fn, delay = 300, immediately = false) => {
  let timer = null
  let isImediately = immediately
  return function() {
    const _this = this
    const args = arguments

    if (timer) clearTimeout(timer)
    if (isImediately) {
      fn.apply(_this, args)
      isImediately = false
    } else {
      timer = setTimeout(() => {
        fn.apply(_this, args)
        timer = null
        isImediately = true
      }, delay)
    }
  }
}

/**
 * 节流
 * @param {function} fn 需要进行节流的事件
 * @param {number} delay 间隔时间
 * @param {boolean} immediately 是否立即执行
 * @param {function} cb 节流结束时的执行
 * @return {function} 返回事件本身
 */
export const throttle = (fn, delay = 300, immediately = false, cb) => {
  let timer = null
  return function() {
    if (immediately) {
      fn.apply(this, arguments)
      immediately = false
      timer = setTimeout(() => {
        immediately = true
        cb && cb.apply(this, arguments)
      }, delay)
    } else {
      if (timer) return
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, delay)
    }
  }
}

// 过滤数据字典数据
export const _filterDictList = (list) => {
  const res = list.map(item => {
    const children = item.childs.map(childItem => {
      return {
        value: childItem.dictCode,
        label: childItem.dictName
      }
    })

    const obj = {
      value: item.dictCode,
      label: item.dictName,
      children
    }
    return obj
  })
  return res
}
