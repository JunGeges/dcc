<template>

	<view class="team-container">
		<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
			@up="upCallback">
			<view class="li" v-for="(item,index) in list.data" :key="index">
				<image class="left" :src="item.avatar_url" mode="aspectFit"></image>
				<view class="mid">
					<view class="">{{ item.nick_name }}</view>
					<view class="">{{ item.mobile }}</view>
					<!-- <view class="">{{ item. }}</view> -->
				</view>
				<view class="right">推荐人数：{{ item.zt_cnt }}</view>
			</view>
		</mescroll-body>
	</view>
</template>
<script>
	const pageSize = 15
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData
	} from '@/core/app'
	import * as TeamApi from '@/api/team'
	export default {
		data() {
			return {
				// 优惠券列表数据
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
						tip: '亲，暂无记录了'
					}
				}
			}
		},

		components: {
			MescrollBody
		},
		mixins: [MescrollMixin],

		mounted() {
			// PrizeApi.luckyActivity().then(res => {
			//   console.log(res);
			// })
			// PrizeApi.activityInfo({ id: 1 }).then(res => {
			//   console.log(res);
			// })
		},

		methods: {
			/**
			 * 上拉加载的回调 (页面初始化时也会执行一次)
			 * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			 * @param {Object} page
			 */
			upCallback(page) {
				const app = this
				// 设置列表数据
				app.getTeamDataList(page.num)
					.then(list => {
						const curPageLen = list.data.length
						const totalSize = list.data.total
						app.mescroll.endBySize(curPageLen, totalSize)
					})
					.catch(() => app.mescroll.endErr())
			},

			getTeamDataList(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					TeamApi.getTeamData({
							page: pageNo
						}, {
							load: false
						})
						.then(result => {
							// 合并新数据
							const newList = result.data.list
							app.list.data = getMoreListData(newList, app.list, pageNo)
							resolve(newList)
						})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.team-container {
		.li {
			padding: 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #efefef;

			.left {
				width: 100rpx;
				height: 100rpx;
				margin-right: 30rpx;
				border-radius: 50%;
			}

			.mid {
				color: #9b9b9b;
				line-height: 50rpx;
				font-size: 28rpx;

				& :first-child {
					color: #242424;
					font-size: 32rpx;
					font-weight: 600;
				}
			}

			.right {
				float: right;
				margin-left: auto;
				color: #242424;
			}
		}
	}
</style>
