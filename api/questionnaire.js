import request from '@/utils/request'

const api = {
	collectUserInfo: 'user/collectUserInfo'
}

export const collectUserInfo = (params) => {
	return request.post(api.collectUserInfo, params)
}
