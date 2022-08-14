<template>
	<view class="prize-container">
		<view class="li" @click="toPrizeDetail">
			<view class="top">
				<view>第二期</view>
				<view>待开奖</view>
			</view>
			<view class="mid">
				<view>内容：中奖名单公示</view>
				<view>开奖时间：2022-10-15 12:33:00</view>
			</view>
			<view class="bottom">
				<view class="">查看详情</view>
			</view>
		</view>
		<view class="li" @click="toPrizeDetail">
			<view class="top">
				<view>第一期</view>
				<view style="color:#a5a5a5">已开奖</view>
			</view>
			<view class="mid">
				<view>内容：中奖名单公示</view>
				<view>开奖时间：2022-10-15 12:33:00</view>
			</view>
			<view class="bottom">
				<view class="">查看详情</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toPrizeDetail() {
				this.$navTo('lucky/lucky/prizeDetail')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.prize-container {
		.li {
			margin: 30rpx 0 0 30rpx;
			box-shadow: 0 0 10rpx #efefef;
			background-color: white;
			width: 690rpx;
			border-radius: 10rpx;
			padding: 0 30rpx;
			box-sizing: border-box;

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 80rpx;

				& :first-child {
					color: #343434;
					font-weight: 600;
					font-size: 32rpx;
				}

				& :last-child {
					color: red;
				}
			}

			.mid {
				padding: 20rpx 0;
				line-height: 55rpx;

				border: {
					top: 1rpx solid #efefef;
					bottom: 1rpx solid #efefef
				}

			}

			.bottom {
				display: flex;
				justify-content: flex-end;
				padding: 10rpx 0;

				view {
					background-color: #fa2209;
					color: white;
					padding: 10rpx 20rpx;
					border-radius: 50rpx;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
