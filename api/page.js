import request from '@/utils/request'

// api地址
const apiUri = {
  detail: 'page/detail',
	bindUser: 'user/bindUser',
}

// 页面数据
export function detail(pageId) {
  return request.get(apiUri.detail, {
    pageId
  })
}

export function bindUser(param) {
  return request.post(apiUri.bindUser,param)
}