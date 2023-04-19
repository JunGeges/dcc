<template>
	<view class="pay-merchants-container">
		<view class="info-box">
			<view class="info">
				<view class="tip">付款给</view>
				<view class="shop-name">{{ shopInfo.store_name }}</view>
			</view>
			<view class="input-content">
				<view class="tip">付款金额</view>
				<view class="input-box">
					<view class="flag">￥</view>
					<input placeholder="请输入付款金额~" focus placeholder-style="color:#fa2209" type="digit"
						confirm-type="done" @input="getMoney">
				</view>
			</view>
			<view class="pay-btn-box">
				<view class="pay-btn" @click="payOfflineOrder">确认付款</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as MerchantsApi from '@/api/merchants'
	import {
		wxPayment,
		navTo
	} from '@/core/app'

	import {
		PayTypeEnum
	} from '@/common/enum/order'

	export default {
		data() {
			return {
				shopInfo: {},
				payForm: {
					money: 0,
					shop_id: '',
					pay_type: 20
				}
			}
		},

		onLoad(options) {
			const {
				shop_id
			} = options

			this.shop_id = shop_id
			this.payForm.shop_id = shop_id

			// 获取二维码参数
			if (options.scene) {
				this.shop_id = options.scene
				this.payForm.shop_id = options.scene
			}
		},

		onShow() {
			this.getShopInfo()
			this.bindShopUser()
		},

		methods: {
			// 获取店铺信息
			getShopInfo() {
				return new Promise((reslove, reject) => {
					MerchantsApi.getShop({
							shop_id: this.shop_id
						})
						.then(result => {
							this.shopInfo = result.data.info
							reslove(result)
						})
						.catch(reject)
				})
			},

			bindShopUser() {
				MerchantsApi.bindShopUser({
					shop_id: this.shop_id
				}).catch(console.log)
			},

			// 获取支付金额
			getMoney(e) {
				const value = e.detail.value
				this.payForm.money = parseFloat(value)
			},

			// 生成支付订单
			payOfflineOrder() {
				const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
				if (!reg.test(this.payForm.money)) return this.$toast('金额输入有误，请重新输入~')

				return new Promise((reslove, reject) => {
					MerchantsApi.payOfflineOrder(this.payForm)
						.then(result => this.onSubmitCallback(result))
						.catch(reject)
				})
			},

			// 订单提交成功后回调
			onSubmitCallback(result) {
				const app = this
				// 发起微信支付
				if (result.data.order.payType == PayTypeEnum.WECHAT.value) {
					wxPayment(result.data.order.payment)
						.then(() => {
							app.$success('支付成功')
							setTimeout(() => {
								if (getCurrentPages().length > 1) {
									uni.navigateBack({})
								} else {
									navTo('pages/merchants/home', {}, 'redirectTo')
								}
							}, 1500)
						})
						.catch(err => {
							app.$error('订单未支付')
						})
						.finally(() => {
							app.disabled = false
						})
				}
				// 余额支付
				// if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
				// 	app.$success('支付成功')
				// 	app.disabled = false
				// 	setTimeout(() => {
				// 		// app.onRefreshList()
				// 	}, 1500)
				// }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pay-merchants-container {
		height: 100vh;
		background-color: #efeff4;
		padding: 30rpx;
		box-sizing: border-box;

		.info-box {
			width: 100%;
			background-color: white;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-radius: 18rpx;

			.info {
				padding: 30rpx 0;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					background-color: #efefef;
					height: 1rpx;
					display: block;
				}

				.tip {
					font-size: 30rpx;
					color: #656565;
					margin-bottom: 30rpx;
				}

				.shop-name {
					color: #343434;
					font-size: 40rpx;
					font-weight: 600;
				}
			}

			.input-content {
				padding: 30rpx 0;

				.tip {
					font-size: 30rpx;
					color: #656565;
					margin-bottom: 30rpx;
				}

				.input-box {
					display: flex;
					align-items: center;

					input {
						color: #fa2209;
						height: 100rpx;
						font-size: 60rpx;
						font-weight: 600;
						border-bottom: 1rpx solid #efefef;
					}

					.flag {
						color: #fa2209;
						font-size: 45rpx;
						font-weight: 600;
					}
				}

			}

			.pay-btn-box {
				height: 120rpx;

				.pay-btn {
					float: right;
					border-radius: 16rpx;
					background-color: #fa2209;
					color: white;
					padding: 0 20rpx;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					margin: 20rpx 20rpx 0 0;
				}
			}
		}
	}
</style>
