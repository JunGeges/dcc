<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="{ native: true,use:true }" @down="downCallback"
		:up="upOption" @up="upCallback">
		<van-dialog id="van-dialog" />
		<view class="center-container">
			<view class="search-box">
				<view class="city">
					<view>
						<select-region v-model="region" placeholder="全国" @change="getSelectArea" />
					</view>
					<uni-icons type="arrowdown" color="#666" size="18" />
				</view>
				<u-search placeholder="搜索" :clearabled="true" :show-action="false" @search="toSearch">
				</u-search>
			</view>
			<view class="item" v-for="item in list.data">
				<view class="ctitle">{{ item.intro }}</view>
				<view class="date">{{ item.create_time }}</view>
				<view class="imgs">
					<image v-for="(itm,idx) in item.images" :key="idx" :src="itm.image_url" mode="aspectFill"
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

			<view class="send-btn" @click="toSendArticle" v-if="isZz">+ 发布本地团购</view>
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
	import SelectRegion from '@/components/select-region/select-region'
	// 每页记录数量
	const pageSize = 15

	export default {
		data() {
			return {
				// 是否是站长
				isZz: 0,
				// 省市区
				region: '',
				// 城市
				city: '全国',
				// 表单
				form: {
					city_id: '',
					province_id: '',
					region_id: '',
					search: ''
				},
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
			MescrollBody,
			SelectRegion
		},

		mixins: [MescrollMixin],

		onShow() {
			this.isZz = uni.getStorageSync("isZz")
			this.onRefreshList()
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

			// 获取本地团购列表
			getTuanList(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					StationsApi.getStationNewsList({
							page: pageNo,
							...this.form
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

			// 搜索团购
			toSearch(e) {
				this.form.search = e
				this.onRefreshList()
			},

			// 获取选择的省市区
			getSelectArea(res) {
				this.form.province_id = res[0].value
				this.form.city_id = res[1].value
				this.form.region_id = res[2].value
				this.onRefreshList()
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
			padding: 20rpx 30rpx;
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
				margin: 20rpx 0;

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

		.search-box {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: white;

			/deep/ u-search {
				flex: 1;
			}

			.city {
				/* #ifndef APP-PLUS-NVUE */
				display: flex;
				/* #endif */
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				// width: 160rpx;
				margin-left: 4px;
				margin-right: 30rpx;

				/deep/ .oneline-hide {
					width: 100rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}

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
</style>
