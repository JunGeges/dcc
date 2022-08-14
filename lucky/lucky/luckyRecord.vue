<template>
	<view class="record-cantiner">
		<view class="record-box">
			<view class="outside">
				<view class="inner"></view>
			</view>
			<view class="content">
				<view class="title-box">
					<view>奖券编号</view>
					<view>开奖时间</view>
					<view>所中奖品</view>
				</view>
				<scroll-view class="scroll" scroll-y="true">
					<view class="result" v-for="i in 20">
						<view class="">NO.123</view>
						<view class="">2022-03-19</view>
						<view class="">20元红包</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData
	} from '@/core/app'
	export default {
		data() {
			return {

			}
		},
		components: {
			MescrollBody
		},
		mixins: [MescrollMixin],
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.record-cantiner {
		background-color: #9270eb;
		height: 100vh;
		overflow: hidden;

		.record-box {
			.outside {
				width: 90%;
				margin: 50rpx 0 0 5%;
				background-color: #7250dd;
				height: 30rpx;
				border-radius: 15rpx;
				padding-top: 6rpx;
				box-sizing: border-box;

				.inner {
					width: 90%;
					margin: 0 0 0 5%;
					background-color: #3c2b6e;
					height: 20rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				width: 80%;
				margin: -15rpx 0 0 10%;
				// height: calc(100vh - 100rpx);
				padding: 0 20rpx 30rpx 20rpx;
				box-sizing: border-box;
				background: #fff;
				position: relative;
				
				.scroll {
					height: calc(100vh - 300rpx);
					
					::-webkit-scrollbar {
						width: 0;
						height: 0;
						color: transparent;
					}
				}

				&::after {
					content: ' ';
					width: 100%;
					position: absolute;
					left: 0;
					bottom: -12rpx;
					border-bottom: 25rpx dotted #9270eb;
					// height: 10rpx;
					z-index: 9999;
				}

				.title-box,
				.result {
					display: flex;
					align-items: center;
					height: 80rpx;
					justify-content: space-between;
				}
			}
		}
	}
</style>
