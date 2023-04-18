<template>
	<view class="home-container" v-if="shopInfo">
		<!-- <image class="m-bg" src="../../static/background/user-header2.png" mode="widthFix"></image> -->
		<!-- 店铺信息 -->
		<view class="m-info" @click="showOperate">
			<image :src="shopInfo.logo_image_url" mode="aspectFill"></image>
			<view class="">{{ shopInfo.store_name }}</view>
			<view class="operate"></view>
		</view>
		<view class="m-desc">
			<view class="">店铺简介：</view>
			<view class="">{{ shopInfo.store_info }}</view>
		</view>
		<view class="m-desc" @click="callPhone">
			<view class="">联系方式：</view>
			<view class="">{{ shopInfo.address.phone }}</view>
			<view class="phone">
				<van-icon name="phone-o" />
			</view>
		</view>
		<!-- 店铺地址 -->
		<view class="m-address" @click="navigation">
			<van-icon class="iconfont3" class-prefix="icon" name="ditu_dingwei_o"></van-icon>
			<view class="address">{{ shopInfo.address.detail }}</view>
			<view class="dh">
				<van-icon class="iconfont3" class-prefix="icon" name="daohang"></van-icon>
				<view class="">导航</view>
			</view>
		</view>
		<!-- 店铺商品 -->
		<view class="goods-box" v-for="item,index in goodsList" :key="index" @click="goGoodsDetail(item.goods_id)">
			<image :src="item.goods_image" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="">{{ item.goods_name }}</view>
				<view class="price-box">
					<view class="price">￥{{ item.goods_price }}</view>
					<view class="o-price">￥{{ item.line_price }}</view>
				</view>
			</view>
		</view>
		<!-- 店铺详情 -->
		<!--    <view class="detail">
      <view class="">欢迎光临本店，本店新开张，诚信经营，只赚信誉不赚钱，谢谢，本店商品均属正品，假一罚十信誉保证。 欢迎广大顾客前来放心选购，我们将竭诚为您服务!</view>
      <image src="../../static/order/status/wait_receipt.png" mode="widthFix"></image>
    </view> -->
		<van-action-sheet :show="isShowOperate" :actions="operate_action" @close="showOperate"
			@select="selectOperateType" />
	</view>

</template>

<script>
	import * as MerchantsApi from '@/api/merchants'
	import {
		navTo
	} from '@/core/app'
	const operate_action = [{
		name: '去付款',
		type: 0
	}]
	export default {
		data() {
			return {
				operate_action,
				isShowOperate: false,
				shopInfo: '',
				goodsList: []
			}
		},

		onLoad(options) {
			this.form = {
				shop_id: options.store_shop_id
			}
		},

		onShow() {
			MerchantsApi.getShop(this.form).then(res => {
				this.shopInfo = res.data.info
			})
			MerchantsApi.goodsList(this.form).then(res => {
				this.goodsList = res.data.list
			})
		},

		computed: {
			detailAddress() {
				const {
					province,
					city,
					regions,
					store_address
				} = this.shopInfo
				return `${province}${city}${regions}${store_address}`
			}
		},

		methods: {
			// 选择操作类型
			selectOperateType(event) {
				const {
					name,
					type
				} = event.detail
				navTo('pages/payMerchant/payMerchant', {
					shop_id: this.shopInfo.shop_id
				})
			},

			// 显示操作类型
			showOperate() {
				this.isShowOperate = !this.isShowOperate
			},

			// 查看商品详情
			goGoodsDetail(goods_id) {
				const url = 'pages/goods/detail'
				const params = {
					goodsId: goods_id
				}
				navTo(url, params)
			},

			// 导航
			navigation() {
				const {
					latitude,
					longitude
				} = this.shopInfo.address
				uni.openLocation({
					latitude: Number(latitude),
					longitude: Number(longitude),
					success() {
						console.log('success')
					}
				})
			},

			// 打电话
			callPhone() {
				const app = this
				uni.makePhoneCall({
					phoneNumber: app.shopInfo.address.phone
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin p {
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: white;
	}

	.home-container {
		color: #343434;
		background: #efefef;
		padding-bottom: 50rpx;
		box-sizing: border-box;
		height: 100vh;

		.m-bg {
			width: 100vw;
			display: block;
		}

		.m-info {
			@include p;
			display: flex;
			align-items: center;
			height: 200rpx;
			font-weight: 600;
			// border-bottom: 1rpx solid #efefef;

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.operate {
				padding: 10rpx;

				border: 3rpx solid #a5a5a5 {
					width: 3rpx 3rpx 0 0;
				}

				;
				margin-left: auto;
				width: 0;
				height: 0;
				box-sizing: border-box;
				transform: rotate(45deg)
			}
		}

		.m-desc {
			@include p;
			padding: 30rpx;
			display: flex;
			align-items: flex-start;


			border: {
				top: 1rpx solid #efefef;
				// bottom: 1rpx solid #efefef;
			}

			& view:last-child {
				flex: 1;
			}

			.phone {
				margin-right: 30rpx;
				font-size: 35rpx;
				text-align: right
			}
		}

		.m-address {
			@include p;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-top: 1rpx solid #efefef;
			padding: 30rpx;

			.address {
				flex: 1;
				font-size: 26rpx;
				margin: 0 30rpx;
			}

			.dh {
				// float: right;
				margin-left: auto;
				margin-right: 30rpx;
				display: flex;
				flex-flow: column wrap;
				align-items: center;
				font-size: 20rpx;
			}
		}

		.goods-box {
			display: flex;
			align-items: center;
			padding: 10rpx;
			box-sizing: border-box;

			width: 90%;
			margin: 30rpx auto;
			border-radius: 10rpx;
			background-color: white;
			box-shadow: 0 0 10rpx #efefef;

			image {
				width: 200rpx;
				height: 200rpx;
				margin-right: 20rpx;
				border-radius: 10rpx 0 0 10rpx;
			}

			.goods-info {
				padding: 20rpx;
				box-sizing: border-box;
				font-size: 30rpx;
				flex: 1;

				.price-box {
					font-weight: 600;
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					color: #fa2209;
					font-size: 32rpx;


					& :last-child {
						font-weight: normal;
						color: #a5a5a5;
						font-size: 24rpx;
						margin-left: 20rpx;
						text-decoration: line-through;
					}
				}
			}
		}

		.detail {
			background-color: white;
			font-size: 30rpx;
			padding: 30rpx;
			box-sizing: border-box;

			view {
				letter-spacing: 1.5rpx;
			}
		}

	}
</style>
