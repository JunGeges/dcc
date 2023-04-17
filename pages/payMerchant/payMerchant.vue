<template>
	<view class="pay-merchants-container">
		<view class="info-box">
			<view class="info">
				<view class="tip">付款给</view>
				<view class="shop-name">步步高超市</view>
			</view>
			<view class="input-content">
				<view class="tip">付款金额</view>
				<view class="input-box">
					<view class="flag">￥</view>
					<input placeholder="请输入付款金额~" focus placeholder-style="color:#a5a5a5" type="digit"
						confirm-type="done">
				</view>
			</view>
			<view class="pay-btn-box">
				<view class="pay-btn">确认付款</view>
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

		}
	}
</script>

<style lang="scss" scoped>
	.pay-merchants-container {
		height: 100vh;
		background-color: #efeff4;
		padding: 30rpx;
		box-sizing: border-box;

		.info-box {
			width: 100%;
			background-color: white;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-radius: 18rpx;

			.info {
				padding: 30rpx 0;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					background-color: #efefef;
					height: 1rpx;
					display: block;
				}

				.tip {
					font-size: 30rpx;
					color: #656565;
					margin-bottom: 30rpx;
				}

				.shop-name {
					color: #343434;
					font-size: 40rpx;
					font-weight: 600;
				}
			}

			.input-content {
				padding: 30rpx 0;

				.tip {
					font-size: 30rpx;
					color: #656565;
					margin-bottom: 30rpx;
				}

				.input-box {
					display: flex;
					align-items: center;

					input {
						color: #000;
						height: 100rpx;
						font-size: 60rpx;
						font-weight: 600;
						border-bottom: 1rpx solid #efefef;
					}

					.flag {
						color: #343434;
						font-size: 45rpx;
						font-weight: 600;
					}
				}

			}
			
			.pay-btn-box {
				height: 120rpx;
				.pay-btn {
					float: right;
					border-radius: 16rpx;
					background-color: #656565;
					color: white;
					padding: 0 20rpx;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					margin: 20rpx 20rpx 0 0;
				}
			}
		}
	}
</style>
