<template>
	<view class="infomation-container">
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
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="{ native: true,use:true }" @down="downCallback"
			:up="upOption" @up="upCallback">
			<view class="info-item" v-for="item in list.data" @click="toTuanDetail(item.active_id)">
				<image class="right" :src="item.image.external_url" mode="aspectFill"></image>
				<view class="left">
					<view class="t">{{ item.title }}</view>
					<view class="intro">{{ item.intro }}</view>
					<view class="b">
						<!-- <view class="">刘站长</view> -->
						<view class="">{{ item.active_start_date }}</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>

</template>

<script>
	import * as GroupBuysApi from '@/api/groupBuy'
	import {
		navTo
	} from '@/core/app'
	import MescrollBody from '@/components/mescroll-uni/mescroll-body'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData
	} from '@/core/app'
	import SelectRegion from '@/components/select-region/select-region'

	// 每页记录数量
	const pageSize = 15

	export default {
		data() {
			return {
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

		},

		methods: {

			// 团购详情
			toTuanDetail(id) {
				const url = `pages/groupBuy/detail?active_id=${id}`
				navTo(url)
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

			// 获取团购列表
			getTuanList(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					GroupBuysApi.getTuanActive({
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

			// 刷新团购列表
			onRefreshList() {
				this.list = getEmptyPaginateObj()
				setTimeout(() => {
					this.mescroll.resetUpScroll()
				}, 500)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.infomation-container {
		height: 100vh;
		background-color: white;
		overflow-y: scroll;
		padding-bottom: 50rpx;
		box-sizing: border-box;

		.info-item {
			display: flex;
			align-items: center;
			// justify-content: space-between;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin-top: 50rpx;

			.left {
				// margin-right: 30rpx;
				// height: 180rpx;
				display: flex;
				flex-flow: column nowrap;
				justify-content: space-around;

				.intro {
					margin: 20rpx 0;
				}

				.t {
					font-weight: 600;
					color: #000000;
					font-size: 35rpx;
				}

				.b {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;

					// & view:nth-child(1) {
					// 	font-size: 32rpx;
					// 	color: #2f2f2f;
					// }

					& :first-child {
						color: #b0b0b5;
						font-size: 30rpx;
					}
				}
			}

			.right {
				flex-shrink: 0;
				height: 200rpx;
				width: 220rpx;
				border-radius: 15rpx;
				margin-right: 50rpx;
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
	}
</style>
