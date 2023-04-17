import request from '@/utils/request'

const api = {
	getTuanActive: "shop/getTuanActive",
	getActiveInfo: "shop/getActiveInfo"
}

// 团购列表
export const getTuanActive = (param) => {
	return request.get(api.getTuanActive, param)
}

// 团购详情
export const getActiveInfo = (param) => {
	return request.get(api.getActiveInfo, param)
}
