import request from '@/utils/request'

const api = {
  newsPublish: 'shop/newsPublish',
  getPlatformNewsList: 'shop/getPlatformNewsList',
	delPlatformNews: 'shop/delPlatformNews',
	rewardUser: 'shop/rewardUser',
	rewardSwitch: 'shop/rewardSwitch'
}

// 发布
export const newsPublish = (params) => {
  return request.post(api.newsPublish, params)
}

// 获取列表
export const getPlatformNewsList = (params) => {
  return request.get(api.getPlatformNewsList, params)
}

// 删除
export const delPlatformNews = (params) => {
  return request.post(api.delPlatformNews, params)
}

// 打赏
export const rewardUser = (params) => {
  return request.post(api.rewardUser, params)
}

// 打赏开关
export const rewardSwitch = (params) => {
  return request.get(api.rewardSwitch, params)
}
