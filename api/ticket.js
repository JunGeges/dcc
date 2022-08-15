import request from '@/utils/request'

const api = {
  getMyLuckTicket: 'user/getMyLuckTicket'
}

export const getMyLuckTicket = (parmas) => {
  return request.get(api.getMyLuckTicket, parmas)
}
