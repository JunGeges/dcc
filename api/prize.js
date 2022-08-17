import request from '@/utils/request'

const api = {
  luckActivity: 'user/luckActivity',
  activityInfo: 'user/activityInfo'
}

// 抽奖活动列表
export const luckyActivity = (params) => {
  return request.get(api.luckActivity, params)
}
// 中奖详情
export const activityInfo = (params) => {
  return request.get(api.activityInfo, params)
}
