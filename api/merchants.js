import request from '@/utils/request'

// api地址
const api = {
	add: 'shop/joinShop',
	edit: 'shop/editShop',
	detail: 'shop/getShopInfo',
	getShop: 'shop/getShop',
	categoryList: 'shop/categoryList',
	goodsCategoryList: 'category/list',
	addGoods: 'shop/addGoods',
	editGoods: 'shop/editGoods',
	nearbyShopList: 'shop/nearbyShopList',
	goodsInfo: 'shop/goodsInfo',
	getList: 'shop/getList',
	notice: 'shop/notice',
	open: 'shop/open',
	goodsList: 'shop/goodsList',
	delGoods: 'shop/delGoods',
	getShopTradeInfo: 'shop/getShopTradeInfo',
	getShopPaymentList: 'shop/getShopPaymentList',
	createShopCode: 'shop/createShopCode',
	getShopOrderList: 'shop/getShopOrderList',
	getExpressList: 'shop/getExpressList',
	deliveryOrder: 'shop/deliveryOrder',
	payOfflineOrder: 'shop/payOfflineOrder'
}

// 店铺入驻
export const add = (param) => {
	return request.post(api.add, param)
}
// 店铺编辑
export const edit = (param) => {
	return request.post(api.edit, param)
}

// 店铺详情
export const detail = (param) => {
	return request.get(api.detail, param)
}
// 店铺详情2
export const getShop = (param) => {
	return request.get(api.getShop, param)
}

// 店铺分类
export const categoryList = (param) => {
	return request.get(api.categoryList, param)
}

// 商品分类
export const goodsCategoryList = (param) => {
	return request.get(api.goodsCategoryList, param)
}

// 添加商品
export const addGoods = (param) => {
	return request.post(api.addGoods, param)
}
// 编辑商品
export const editGoods = (param) => {
	return request.post(api.editGoods, param)
}

// 删除店铺
export const delGoods = (param) => {
	return request.post(api.delGoods, param)
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
export const nearbyShopList = (param) => {
	return request.post(api.nearbyShopList, param)
}

// 店铺通知
export const notice = (param) => {
	return request.get(api.notice, param)
}

// 是否隐藏模块 
export const open = (param) => {
	return request.get(api.open, param)
}

//  店铺营业额基本信息
export const getShopTradeInfo = (param) => {
	return request.get(api.getShopTradeInfo, param)
}

//  店铺营业额流水列表
export const getShopPaymentList = (param) => {
	return request.get(api.getShopPaymentList, param)
}

// 获取店铺付款码
export const createShopCode = (param) => {
	return request.get(api.createShopCode, param)
}

// 获取店铺订单列表
export const getShopOrderList = (param) => {
	return request.get(api.getShopOrderList, param)
}

// 快递公司列表
export const getExpressList = (param) => {
	return request.get(api.getExpressList, param)
}

// 发货
export const deliveryOrder = (param) => {
	return request.post(api.deliveryOrder, param)
}

// 线下收款码支付
export const payOfflineOrder = (param) => {
	return request.post(api.payOfflineOrder, param)
}
