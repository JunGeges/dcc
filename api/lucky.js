import request from '@/utils/request'

const api = {
  'getLuckMoney': '/user/getLuckMoney',
  'openLuck': '/user/openLuck'
}
// 抽奖金额
export const getLuckMoney = (param) => {
  return request.get(api.getLuckMoney, param)
}

// 开奖
export const openLuck = (param) => {
  return request.get(api.openLuck, param)
}
