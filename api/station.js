import request from '@/utils/request'

const api = {
	stationPublish: 'shop/stationPublish',
	getStationNewsList: "shop/getStationNewsList",
	delStationNews: "shop/delStationNews",
	editStationNews: "shop/editStationNews",
	getStationNewsInfo: "shop/getStationNewsInfo"
}

// 站长发布团购消息
export const stationPublish = (param) => {
	return request.post(api.stationPublish, param)
}

// 站长发布消息列表
export const getStationNewsList = (param) => {
	return request.get(api.getStationNewsList, param)
}

// 获取消息详情
export const getStationNewsInfo = (param) => {
	return request.get(api.getStationNewsInfo, param)
}

// 站长删除发布的消息
export const delStationNews = (param) => {
	return request.get(api.delStationNews, param)
}

// 站长编辑发布的消息
export const editStationNews = (param) => {
	return request.post(api.editStationNews, param)
}
