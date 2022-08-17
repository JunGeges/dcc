<template>
	<view class="detail-container">
		<view class="sub-container">
			<view class="title">中奖名单</view>
			<view class="sub-title">
				<view class="st">第一期所有奖项中奖名单</view>
				<view class="sb">
					<view class="line"></view>
					<view class="triangle"></view>
					<view class="line"></view>
				</view>
			</view>
			<view class="prize-box">

				<view class="leval">一等奖</view>

				<view class="info-title">
					<view class="">会员昵称</view>
					<view class="">奖券编号</view>
					<view class="">奖品</view>
				</view>

				<view class="info-box" v-for="(i,index) in one" :key="index">
					<view class="">{{ i.user.nick_name }}</view>
					<view class="">{{ i.order_no }}</view>
					<view class="">{{ i.money }}元</view>
				</view>

			</view>
			<view class="prize-box">

				<view class="leval">二等奖</view>

				<view class="info-title">
					<view class="">会员昵称</view>
					<view class="">奖券编号</view>
					<view class="">奖品</view>
				</view>

				<view class="info-box" v-for="(i,index) in two" :key="index">
					<view class="">{{ i.user.nick_name }}</view>
					<view class="">{{ i.order_no }}</view>
					<view class="">{{ i.money }}元</view>
				</view>

			</view>
			<view class="prize-box">

				<view class="leval">三等奖</view>

				<view class="info-title">
					<view class="">会员昵称</view>
					<view class="">奖券编号</view>
					<view class="">奖品</view>
				</view>

				<view class="info-box" v-for="(i,index) in three" :key="index">
					<view class="">{{ i.user.nick_name }}</view>
					<view class="">{{ i.order_no }}</view>
					<view class="">{{ i.money }}元</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import * as PrizeApi from '@/api/prize'
	export default {
		data() {
			return {
				one: [],
				two: [],
				three: []
			}
		},

		onLoad(options) {
			this.id = options.id
		},

		onShow() {
			PrizeApi.activityInfo({
				id: this.id
			}).then(res => {
				const { one, two, three } = res.data
				this.one = one
				this.two = two
				this.three =three
			})
		},

		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.detail-container {
		background-color: #ffa068;
		height: 100vh;
		padding: 2.5% 0 0 2.5%;
		box-sizing: border-box;

		.sub-container {
			width: 95%;
			height: 95%;
			background: white;
			border-radius: 10rpx;
			overflow: scroll;
			padding: 30rpx 0;
			box-sizing: border-box;

			.title {
				font-size: 60rpx;
				color: #343434;
				font-weight: 600;
				text-align: center;
				width: 300rpx;
				margin: 30rpx auto;
				position: relative;

				&::after {
					content: '';
					width: 100%;
					height: 20rpx;
					background-color: #ffc7a6;
					position: absolute;
					left: 0;
					bottom: 0;
					opacity: .8;
					// z-index: 9;
				}
			}

			.sub-title {
				display: flex;
				flex-flow: column wrap;
				align-items: center;

				.st {
					margin: 30rpx 0 10rpx 0;
				}

				.sb {
					display: flex;
					align-items: center;

					.triangle {
						margin: 0 5rpx;
						width: 0;
						height: 0;
						padding: 10rpx;

						border: 2rpx solid #343434 {
							top: 0 solid transparent;
							left: 0 solid transparent
						}

						transform: rotate(45deg);
					}


					.line {
						width: 200rpx;
						height: 2rpx;
						background-color: #343434;
					}
				}
			}

			.prize-box {
				border: 1rpx solid #343434;
				border-radius: 10rpx;
				width: 90%;
				margin: 80rpx 0 0 30rpx;
				position: relative;

				.leval {
					position: absolute;
					left: -20rpx;
					top: -40rpx;
					background-color: white;
					font-weight: 600;
					color: #343434;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50% 50% 0 50%;
					border: 1rpx solid #343434;
					text-align: center;
					line-height: 80rpx;
					font-size: 20rpx;

					&::after {
						content: '';
						width: 40rpx;
						height: 10rpx;
						background-color: #343434;
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						bottom: 10rpx;
					}
				}

				.info-title,
				.info-box {
					display: flex;
					align-items: center;
					justify-content: space-around;
					height: 60rpx;
					text-align: center;


					& view:first-child {
						width: 200rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						padding: 0 30rpx;
						box-sizing: border-box;
					}

					view {
						flex: 1;
					}
				}

				.info-title {
					color: #343434;
					font-weight: 600;

				}
			}
		}
	}
</style>
