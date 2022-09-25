import request from '@/utils/request'

const api = {
	teamData: 'user/pushUserData'
}

export const getTeamData = (params) => {
	return request.get(api.teamData, params)
}
