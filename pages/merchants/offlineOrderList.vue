<template>
	<view class="offine-order-container">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="{ native: true,use:true }" @down="downCallback"
			:up="upOption" @up="upCallback">
			<view class="item" v-for="item,i in list.data" :key="i">
				<image class="img" :src="item.user.avatar_url" mode="aspectFit"></image>
				<view class="left">
					<view class="t">{{ item.user.nick_name}}</view>
					<view class="t">{{ item.user.mobile }}</view>
					<view class="b">{{ item.create_time }}</view>
				</view>
				<view class="right">+{{ item.pay_price }}</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import * as MerchantsApi from '@/api/merchants'
	import MescrollBody from '@/components/mescroll-uni/mescroll-body'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData
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
				app.getOfflineOrder(page.num)
					.then(list => {
						const curPageLen = list.data.length
						const totalSize = list.data.total
						app.mescroll.endBySize(curPageLen, totalSize)
					})
					.catch(() => app.mescroll.endErr())
			},

			// 店铺营业额流水
			getOfflineOrder(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					MerchantsApi.getOfflineOrder({
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

			// 刷新团购列表
			onRefreshList() {
				this.list = getEmptyPaginateObj()
				setTimeout(() => {
					this.mescroll.resetUpScroll()
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.offine-order-container {
		padding: 0 30rpx;
		box-sizing: border-box;
		background: white;

		.item {
			display: flex;
			align-items: center;
			// justify-content: space-between;
			border-bottom: 1rpx solid #efefef;
			padding: 20rpx 0;
			// height: 120rpx;
			
			.img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.left {
				line-height: 50rpx;

				.t {
					font-size: 32rpx;
					color: #343434;
				}

				.b {
					color: #a2a2a2;
					font-size: 30rpx;
				}
			}

			.right {
				color: red;
				font-size: 40rpx;
				font-weight: 600;
				margin-left: auto;
			}
		}
	}
</style>
