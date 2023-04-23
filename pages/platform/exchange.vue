<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="{ native: true,use:true }" @down="downCallback"
		:up="upOption" @up="upCallback">
		<van-dialog id="van-dialog" />
		<view class="love-container">
			<view class="item" v-for="item in list.data">
				<image class="left" :src="item.user.avatar_url" mode="aspectFill"></image>
				<view class="right">
					<view class="nick">{{ item.user.nick_name }}</view>
					<view class="ctitle">{{ item.intro }}</view>
					<view class="date">{{ item.create_time }}</view>
					<view class="imgs">
						<image v-for="(itm,idx) in item.images" :key="idx" :src="itm.image_url" mode="aspectFill"
							@click="previewImg(item.images,idx)">
						</image>
					</view>
					<view class="date">{{ item.user_name }}</view>
					<view class="date">{{ item.phone }}</view>
					<view class="date">{{ item.address }}</view>
					<view class="nick">我要换：{{ item.exchange_desc }}</view>
					<view class="ddh" @click="ddh(item.phone)">联系TA</view>
					<view class="edit-btns" v-if="item.is_own">
						<view @click="toDelete(item)">删除</view>
						<!-- <view @click="toEdit(item)">编辑</view> -->
					</view>
				</view>
			</view>

			<view class="send-btn" @click="toSend">+ 发布互换</view>
			<view class="ds" @click="ds" v-if="switchOnoff">打赏</view>
			
		</view>
	</mescroll-body>
</template>

<script>
	import Dialog from '@/wxcomponents/vant/dialog/dialog';
	import * as PublishsApi from '@/api/publish'
	import MescrollBody from '@/components/mescroll-uni/mescroll-body'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData,
		navTo,
		wxPayment
	} from '@/core/app'
	// 每页记录数量
	const pageSize = 15

	export default {
		data() {
			return {
				// 打赏开关
				switchOnoff: 0,
				// 团购数据列表
				list: getEmptyPaginateObj(),
				// 上拉加载配置
				upOption: {
					// 首次自动执行
					auto: true,
					// 每页数据的数量; 默认10
					page: {
						size: pageSize
					},
					// 数量要大于4条才显示无更多数据
					noMoreSize: 4,
					// 空布局
					empty: {
						tip: '亲，暂无数据'
					}
				},
			}
		},

		components: {
			MescrollBody
		},

		mixins: [MescrollMixin],

		onShow() {
			this.onRefreshList()
			this.getSwitch()
		},

		methods: {
			/**
			 * 上拉加载的回调 (页面初始化时也会执行一次)
			 * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			 * @param {Object} page
			 */
			upCallback(page) {
				const app = this
				// await app.getCateList()
				// 设置列表数据
				app.getTuanList(page.num)
					.then(list => {
						const curPageLen = list.data.length
						const totalSize = list.data.total
						app.mescroll.endBySize(curPageLen, totalSize)
					})
					.catch(() => app.mescroll.endErr())
			},

			// 获取列表
			getTuanList(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					PublishsApi.getPlatformNewsList({
							page: pageNo,
							type: 20
						})
						.then(result => {
							// 合并新数据
							const newList = result.data.list
							app.list.data = getMoreListData(newList, app.list, pageNo)
							resolve(newList)
						})
				})
			},
			
			// 刷新本地团购列表
			onRefreshList() {
				this.list = getEmptyPaginateObj()
				setTimeout(() => {
					this.mescroll.resetUpScroll()
				}, 500)
			},

			// 预览图片
			previewImg(imgs, currentImgIndex) {
				const urls = imgs.map(item => item.image_url)
				uni.previewImage({
					current: currentImgIndex,
					urls,
					loop: true
				})
			},
			
			// 打赏开关
			getSwitch() {
				PublishsApi.rewardSwitch().then(res => {
					this.switchOnoff = res.data.onoff
				})
			},

			// 打电话
			ddh(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			
			// 打赏
			ds() {
				PublishsApi.rewardUser({
					money: 2
				}).then(res => {
					wxPayment(res.data.order.payment)
						.then(() => {
							setTimeout(() => {
								this.$success('支付成功')
							}, 1500)
						})
						.catch(err => {
							// app.$error('订单未支付')
						})
						.finally(() => {
							// app.disabled = false
						})
				})
			},

			// 发布
			toSend() {
				const link = "pages/platform/exchangePublish"
				navTo(link)
			},

			// 编辑
			toEdit(item) {
				const {
					id
				} = item
				navTo('article/pages/sendArticle', {
					flag: 1,
					id
				})
			},

			// 删除
			toDelete(item) {
				const {
					id
				} = item
				Dialog.confirm({
						title: '警告',
						message: '您确认删除吗?',
					})
					.then(() => {
						PublishsApi.delPlatformNews({
							id
						}).then(res => {
							this.$toast(res.message)
							this.onRefreshList()
						})
					})
					.catch(() => {
						// on cancel
					});

			},
		}
	}
</script>

<style lang="scss" scoped>
	.no-goods {
		text-align: center;
		color: #a5a5a5;
		margin-top: 150rpx;
		font-size: 35rpx;
	}

	.love-container {
		padding: 140rpx 30rpx 30rpx;
		box-sizing: border-box;
		height: 100vh;
		overflow-y: scroll;
		background-color: white;
		box-sizing: border-box;

		.item {
			display: flex;
			align-items: flex-start;
			// border-radius: 15rpx;
			// margin-top: 30rpx;
			padding: 20rpx 0;
			box-sizing: border-box;
			border-bottom: 1rpx solid #efefef;

			// box-shadow: 0 0 10rpx #efefef;
			// width: 690rpx;
			// margin-left: 30rpx;

			.nick {
				font-size: 35rpx;
				color: #000;
				font-weight: 600;
			}

			.left {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 30rpx;
				flex-shrink: 0;
			}

			.edit-btns {
				clear: both;
				display: flex;
				justify-content: flex-end;
				padding: 30rpx;
				box-sizing: border-box;
				margin-top: 20rpx;
				// border-top: 1rpx solid #Efefef;

				view {
					// margin-left: 30rpx;
				}
			}

			.right {
				.ctitle {
					margin-top: 10rpx;
					white-space: pre-line;
				}

				.date {
					color: #a5a5a5;
					margin: 10rpx 0;
					font-size: 30rpx;
				}

				.ddh {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					// box-shadow: 0 0 10rpx #efefef;
					background-color: #fa2209;
					// border: 1rpx solid #efefef;
					border-radius: 40rpx;
					color: white;
					font-size: 28rpx;
					align-items: flex-end;
					text-align: center;
					float: right;
				}

				.imgs {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					width: 560rpx;
					margin: 20rpx 0;

					image {
						border: 1prx solid #efefef;
						box-sizing: border-box;
						flex-shrink: 0;
						width: 33%;
						height: 200rpx;
					}
				}
			}

		}
		
		.ds {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			text-align: center;
			line-height: 80rpx;
			color: white;
			font-size: 30rpx;
			background-color: #fa2209;
			position: fixed;
			right: 30rpx;
			bottom: 80rpx;
			box-shadow: 0 0 10rpx #efefef;
		}

		.send-btn {
			width: 30%;
			height: 80rpx;
			line-height: 80rpx;
			position: fixed;
			right: 30rpx;
			// transform: translateX(-50%);
			top: 30rpx;
			// box-shadow: 0 0 10rpx #efefef;
			// background-color: #fa2209;
			border: 1rpx solid #a5a5a5;
			border-radius: 40rpx;
			color: #000;
			font-size: 28rpx;
			text-align: center;
		}
	}
</style>

