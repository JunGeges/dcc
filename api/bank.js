import request from '@/utils/request'

// api地址
const api = {
  list: 'bank/list',
  detail: 'bank/detail',
  add: 'bank/add',
  edit: 'bank/edit',
  remove: 'bank/remove'
}

// 银行卡列表
export const list = (param) => {
  return request.get(api.list, param)
}

// 银行卡详情  //银行卡详情 ,参数bankId
export const detail = (bankId) => {
  return request.get(api.detail, { bankId })
}

// 添加银行卡
export const add = (param) => {
  return request.post(api.add,  { form: param })
}

// 编辑银行卡  //编辑银行卡 ,参数bankId卡ID, user_name姓名，bank_name银行名称，card_no卡号，phone手机号
export const edit = (bankId, param) => {
  return request.post(api.edit, { bankId, form: param })
}

// 删除银行卡  删除银行卡，参数bankId
export const remove = (bankId) => {
  return request.get(api.remove, {bankId})
}
