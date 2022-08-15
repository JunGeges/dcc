import request from '@/utils/request'

// api地址
const api = {
  userInfo: 'user/info',
  assets: 'user/assets',
  bindMobile: 'user/bindMobile',
  spreadBanner: 'user/spreadBanner',
  applyWithdraw: 'user/applyWithdraw',
  withdrawRecord: 'user/getWithdrawList',
  myLuckRecord: 'user/myLuckRecord'
}

// 当前登录的用户信息
export const info = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.userInfo, param, options)
}

// 账户资产
export const assets = (param, option) => {
  return request.get(api.assets, param, option)
}

// 绑定手机号
export const bindMobile = (data, option) => {
  return request.post(api.bindMobile, data, option)
}

// 获取分享图片信息
export const spreadBanner = (param, option) => {
  return request.get(api.spreadBanner, param, option)
}

// 申请提现
export const applyWithdraw = (param) => {
  return request.post(api.applyWithdraw, param)
}

// 提现记录
export const withdrawRecord = (param, option) => {
  return request.get(api.withdrawRecord, param, option)
}
// 中奖记录
export const myLuckRecord = (param, option) => {
  return request.get(api.myLuckRecord, param, option)
}
