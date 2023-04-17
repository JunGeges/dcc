<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="{ native: true,use:true }" @down="downCallback"
		:up="upOption" @up="upCallback">
		<van-dialog id="van-dialog" />
		<view class="center-container" v-if="list.data.length">
			<view class="item" v-for="item in list.data">
				<view class="ctitle">{{ item.intro }}</view>
				<view class="date">{{ item.create_time }}</view>
				<view class="imgs">
					<image v-for="(itm,idx) in item.images" :key="idx" :src="itm.image_url" mode="aspectFit"
						@click="previewImg(item.images,idx)">
					</image>
				</view>
				<view class="date">{{ item.user.nick_name }}</view>
				<view class="date">{{ item.phone }}</view>
				<view class="date">{{ item.address }}</view>
				<view class="edit-btns" v-if="item.is_own">
					<view @click="toDelete(item)">删除</view>
					<view @click="toEdit(item)">编辑</view>
				</view>
			</view>

			
		</view>
		<view class="no-goods" v-else>
			<!-- 暂无信息~ -->
			<view class="send-btn" @click="toSendArticle">+ 发布本地团购</view>
		</view>
	</mescroll-body>
</template>

<script>
	import Dialog from '@/wxcomponents/vant/dialog/dialog';
	import * as StationsApi from '@/api/station'
	import MescrollBody from '@/components/mescroll-uni/mescroll-body'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData,
		navTo
	} from '@/core/app'
	// 每页记录数量
	const pageSize = 15

	export default {
		data() {
			return {
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

			// 获取本地团购列表
			getTuanList(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					StationsApi.getStationNewsList({
							page: pageNo
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

			// 发布本地团购
			toSendArticle() {
				const link = "article/pages/sendArticle"
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
						StationsApi.delStationNews({
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
		.send-btn {
			width: 60%;
			height: 80rpx;
			line-height: 80rpx;
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			bottom: 100rpx;
			box-shadow: 0 0 10rpx #efefef;
			background-color: #fa2209;
			border-radius: 40rpx;
			color: white;
			font-size: 28rpx;
			text-align: center;
		}
	}
	.center-container {
		padding-bottom: 30rpx;
		box-sizing: border-box;
		height: 100vh;
		overflow-y: scroll;
		background-color: #fafafa;

		.item {
			border-radius: 15rpx;
			margin-top: 30rpx;
			padding: 20rpx 30rpx 0 30rpx;
			box-sizing: border-box;
			background-color: white;
			box-shadow: 0 0 10rpx #efefef;
			width: 690rpx;
			margin-left: 30rpx;


			.ctitle {
				font-size: 35rpx;
				color: #000;
				font-weight: 600;
				white-space: pre-line
			}

			.date {
				color: #a5a5a5;
				margin: 10rpx 0;
				font-size: 30rpx;
			}

			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				width: 630rpx;

				image {
					border: 1prx solid #efefef;
					box-sizing: border-box;
					flex-shrink: 0;
					width: 33%;
					height: 200rpx;
				}
			}

			.edit-btns {
				display: flex;
				justify-content: flex-end;
				padding: 30rpx;
				box-sizing: border-box;
				margin-top: 20rpx;
				border-top: 1rpx solid #Efefef;

				view {
					margin-left: 30rpx;
				}
			}
		}

	}
</style>
