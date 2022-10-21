import request from '@/utils/request'

// api地址
const api = {
  add: 'shop/add',
  detail: 'shop/detail',
  categoryList: 'shop/categoryList',
  addGoods: 'shop/addGoods',
  editGoods: 'shop/editGoods',
  goodsList: 'shop/goodsList',
  goodsInfo: 'shop/goodsInfo',
  getList: 'shop/getList',
  notice: 'shop/notice',
  open: 'shop/open',
}

// 店铺入驻
export const add = (param) => {
  return request.post(api.add, param)
}

// 店铺详情
export const detail = (param) => {
  return request.get(api.detail, param)
}

// 店铺分类
export const categoryList = (param) => {
  return request.get(api.categoryList, param)
}

// 添加商品
export const addGoods = (param) => {
  return request.post(api.addGoods, param)
}
// 编辑商品
export const editGoods = (param) => {
  return request.post(api.editGoods, param)
}

// 商品列表
export const goodsList = (param) => {
  return request.get(api.goodsList, param)
}

// 商品详情
export const goodsInfo = (param) => {
  return request.get(api.goodsInfo, param)
}

// 首页店铺集合
export const getList = (param) => {
  return request.get(api.getList, param)
}

// 店铺通知
export const notice = (param) => {
  return request.get(api.notice, param)
}

// 是否隐藏模块 
export const open = (param) => {
  return request.get(api.open, param)
}
