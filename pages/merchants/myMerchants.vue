<template>
	<view class="shop-container">
		<view class="head-box" @click="goShop">
			<image class="logo" :src="shopInfo.logo_image_url" mode="aspectFit"></image>
			<view class="shop-info">
				<view class="sptitle">{{ shopInfo.store_name }}</view>
				<view class="intro">{{ shopInfo.store_info }}</view>
			</view>
			<view class="shop-enter">我的店铺</view>
		</view>

		<view class="section" @click="toPaymentList">
			<view class="section-title">经营数据</view>
			<view class="data-box">
				<view class="item" v-for="(item,i) in sellData">
					<view class="t">{{ item.title }}</view>
					<view class="d">{{ item.data }}</view>
				</view>
			</view>
		</view>

		<view class="section">
			<view class="section-title">店铺管理</view>
			<view class="data-box">
				<view class="item" style="font-weight: normal;" v-for="(item, index) in items" :key="index"
					@click="go(item)">
					<van-icon class="iconfont3" class-prefix="icon" :name="item.icon"></van-icon>
					<view>{{ item.title }}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		navTo
	} from '@/core/app'
	import * as MerchantsApi from '@/api/merchants'
	const items = [{
			title: '店铺信息',
			icon: 'dianpuguanli',
			link: 'pages/merchants/merchantsEnter?flag=1'
		},
		{
			title: '添加商品',
			icon: 'tianjiashangpin',
			link: 'pages/merchants/goodsEnter'
		},
		{
			title: '商品管理',
			icon: 'shangpinguanli',
			link: 'pages/merchants/goodsEditList'
		},
		{
			title: '订单管理',
			icon: 'shangpinguanli',
			link: 'pages/merchants/orderList'
		},
		{
			title: '下载收款码',
			icon: 'shangpinguanli',
			link: ''
		},
		{
			title: '收款码订单',
			icon: 'shangpinguanli',
			link: 'pages/merchants/orderList'
		}
	]

	const sellData = [{
			title: "今日营业额",
			type: 'today',
			data: "0"
		},
		{
			title: "本周营业额",
			type: 'week',
			data: "0"
		},
		{
			title: "本月营业额",
			type: 'month',
			data: "0"
		},
		{
			title: "累计营业额",
			type: 'total',
			data: "0"
		},
		{
			title: "剩余营业额",
			type: 'remain',
			data: "0"
		},
		{
			title: "已提现营业额",
			type: 'already_money',
			data: "0"
		}
	]
	export default {
		data() {
			return {
				items,
				sellData,
				shopInfo: {}
			}
		},

		onShow() {
			Promise.all([this.getShopInfo(), this.getShopTradeInfo()])
		},

		methods: {
			// 查看店铺详情
			goShop() {
				navTo(`pages/merchants/home?store_shop_id=${this.shopInfo.shop_id}`)
			},

			// 查看店铺流水
			toPaymentList() {
				navTo('pages/merchants/paymentList', {
					shop_id: this.shopInfo.shop_id
				})
			},

			go(item) {
				const {
					link
				} = item
				if (link) {
					return navTo(link, {
						store_shop_id: this.shopInfo.shop_id
					})
				}
				// 下载二维码
				this.getShopCode()
			},

			// 下载二维码
			getShopCode() {
				MerchantsApi.createShopCode({
						shop_id: this.shopInfo.shop_id
					})
					.then(res => {
						this.saveImageToPhotosAlbum(res.data.url)
					})
					.catch(console.log)
			},

			// 保存图片到相册
			saveImageToPhotosAlbum(imgUrl) {
				uni.getImageInfo({
					src: 'imgUrl',
					success: (res) => {
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success: () => {
								uni.saveImageToPhotosAlbum({
									filePath: res.path,
									success: () => {
										this.$toast('已保存到相册~')
									},
									fail: () => {
										this.$toast('保存失败!')
									}
								})
							}
						})

					}
				})
			},

			// 店铺详情
			getShopInfo() {
				return new Promise((reslove, reject) => {
					MerchantsApi.detail()
						.then(res => {
							this.shopInfo = res.data.info
							reslove(res)
						})
						.catch(reject)
				})
			},

			// 店铺营业额基本信息
			getShopTradeInfo() {
				return new Promise((reslove, reject) => {
					MerchantsApi.getShopTradeInfo()
						.then(result => {
							for (let key in result.data) {
								this.sellData.forEach(item => {
									if (item.type === key) {
										item['data'] = result.data[key]
									}
								})
							}
							reslove(result)
						})
						.catch(reject)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop-container {
		.section {
			background-color: white;
			margin-top: 30rpx;

			.section-title {
				padding: 0 40rpx;
				height: 100rpx;
				line-height: 100rpx;
				border-bottom: 1rpx solid #efefef;
				box-sizing: border-box;
				color: #151515;
				font-size: 32rpx;
				// font-weight: 600;
			}

			.data-box {
				display: flex;
				flex-wrap: wrap;

				& .item:nth-child(3n) {
					border-right: none;
				}

				.item {
					width: 33.333%;
					display: flex;
					flex-flow: column;
					align-items: center;
					margin-top: 30rpx;
					line-height: 60rpx;
					border-right: 1rpx solid #efefef;

					.t {
						// color: #6e6e6e;
						// font-size: 32rpx;
					}

					.d {
						color: #171717;
						font-size: 35rpx;
						font-weight: 600;
					}
				}

			}
		}

		.head-box {
			height: 200rpx;
			display: flex;
			padding: 0 0 0 30rpx;
			// flex-flow: column wrap;
			// justify-content: center;
			align-items: center;

			color: white;
			background-color: rgba(197, 154, 70, .6);

			.shop-info {
				width: 400rpx;
				height: 120rpx;
				display: flex;
				flex-flow: column;
				justify-content: space-between;

				.sptitle {
					font-size: 35rpx;
					font-weight: 600;
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.intro {
					font-weight: normal;
					font-size: 30rpx;
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.shop-enter {
				margin-left: auto;
				font-size: 30rpx;
				background-color: rgba(0, 0, 0, .5);
				height: 60rpx;
				// width: 200rpx;
				padding: 0 0 0 30rpx;
				line-height: 60rpx;
				border-radius: 30rpx 0 0 30rpx;
				text-align: right;
			}

			.logo {
				width: 120rpx;
				height: 120rpx;
				border-radius: 18rpx;
				margin-right: 30rpx;
			}
		}
	}
</style>
