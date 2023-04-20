<template>
	<view class="shop-container">
		<view class="head-box" @click="goShop">
			<image class="logo" :src="shopInfo.logo_image_url" mode="aspectFill"></image>
			<view class="shop-info">
				<view class="sptitle">{{ shopInfo.store_name }}</view>
				<view class="intro">{{ shopInfo.store_info }}</view>
			</view>
			<view class="shop-enter">我的店铺</view>
		</view>

		<view class="section">
			<view class="section-title">
				<view class="">经营数据</view>
				<view class="right" @click="onCloseProfit">
					<view class="">营业额转佣金</view>
					<view class="operate"></view>
				</view>
			</view>
			<view class="data-box" @click="toPaymentList">
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

		<!-- 设置比列区域 -->
		<van-action-sheet :show="isShowRate" title="收款码平台抽成比例(%)" @close="onCloseRate">
			<view>
				<van-field :value="form.platform_code_scale" type="number" placeholder="请输入收款码平台抽成比例" :border="false"
					@change="getRate" />
				<view class="delivery-btn" @click="onUpdateRate">确认修改</view>
			</view>
		</van-action-sheet>
		<!-- 营业额转佣金区域 -->
		<van-action-sheet :show="isShowProfit" title="营业额转个人佣金" @close="onCloseProfit">
			<view>
				<van-field :value="remain" readonly type="number" placeholder="请输入收款码平台抽成比例" :border="false" />
				<view class="delivery-btn" @click="shopProfitToUser">确认转换</view>
			</view>
		</van-action-sheet>

	</view>
</template>

<script>
	import {
		navTo
	} from '@/core/app'
	import * as MerchantsApi from '@/api/merchants'
	const items = [{
			title: '店铺信息',
			icon: 'shanghupiliangruzhu',
			link: 'pages/merchants/merchantsEnter?flag=1'
		}, {
			title: '抽成比列',
			icon: 'dianpuguanli',
			link: '',
			rate: 1
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
			icon: 'dingdanguanli',
			link: 'pages/merchants/orderList'
		},
		{
			title: '下载收款码',
			icon: 'shoukuanma',
			link: ''
		},
		{
			title: '收款码订单',
			icon: 'dingdan',
			link: 'pages/merchants/offlineOrderList'
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
				isShowRate: false,
				isShowProfit: false,
				form: {
					platform_code_scale: ''
				},
				shopInfo: {},
				remain: ''
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
			
			// 切换转换操作弹窗
			onCloseProfit() {
				this.isShowProfit = !this.isShowProfit
			},

			// 切换比例设置弹窗
			onCloseRate() {
				this.isShowRate = !this.isShowRate
			},

			// 获取比例
			getRate(e) {
				this.form.platform_code_scale = e.detail
			},
			
			// 转换佣金
			shopProfitToUser() {
				MerchantsApi.shopProfitToUser()
					.then(res => {
						this.$toast(res.message)
						setTimeout(() => {
							this.onCloseProfit()
							this.getShopTradeInfo()
						}, 1500)
					})
					.catch(console.log)
			},

			// 修改比例
			onUpdateRate() {
				MerchantsApi.editShopScale(this.form)
					.then(res => {
						this.$toast(res.message)
						setTimeout(() => {
							this.onCloseRate()
							this.form.platform_code_scale = ''
						}, 1500)
					})
					.catch(console.log)
			},

			go(item) {
				const {
					link,
					rate
				} = item
				if (link) {
					return navTo(link, {
						store_shop_id: this.shopInfo.shop_id
					})
				}

				if (rate) {
					return this.onCloseRate()
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
					src: imgUrl,
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
							this.form.platform_code_scale = parseFloat(res.data.info.platform_code_scale)
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
							this.remain = result.data.remain
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
		/deep/ .van-field__control {
			text-align: center;
		}
		.delivery-btn {
			width: 300rpx;
			height: 60rpx;
			margin: 30rpx auto 50rpx auto;
			color: white;
			background-color: #fa2209;
			line-height: 60rpx;
			text-align: center;
			border-radius: 30rpx;
			font-size: 30rpx;
		}

		.section {
			background-color: white;
			margin-top: 30rpx;

			.section-title {
				padding: 0 40rpx;
				display: flex;
				align-items: center;
				height: 100rpx;
				border-bottom: 1rpx solid #efefef;
				box-sizing: border-box;
				color: #151515;
				font-size: 32rpx;
				// font-weight: 600;
				
				.right {
					margin-left: auto;
					display: flex;
					height: 100%;
					align-items: center;
					.operate {
						padding: 10rpx;
					
						border: 3rpx solid #a5a5a5 {
							width: 3rpx 3rpx 0 0;
						}
					
						margin-left: auto;
						width: 0;
						height: 0;
						box-sizing: border-box;
						transform: rotate(45deg)
					}
				}
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
