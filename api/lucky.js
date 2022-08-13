import request from '@/utils/request'

const api = {
  'getLuckMoney': '/user/getLuckMoney'
}
// 抽奖金额
export const getLuckMoney = (param) => {
  return request.get(api.getLuckMoney, param)
}
