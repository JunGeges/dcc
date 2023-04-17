<template>
	<view class="detail-container">
		<image class="banner" :src="list.image.external_url" mode="aspectFit"></image>
		<view class="item" v-for="item in list.goods" @click="toGoodsDetail(item)">
			<image class="left" :src="item.goods_image" mode=""></image>
			<view class="right">
				<view class="gtitle">{{ item.goods_name }}</view>
				<view class="price">{{ item.goods_price }}</view>
				<view class="line-price">￥{{ item.line_price }}</view>
				<view class="btn">去购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as GroupBuysApi from '@/api/groupBuy'
	import {
		navTo
	} from '@/core/app'
	export default {
		data() {
			return {
				list: {}
			}
		},

		onLoad(option) {
			const {
				active_id
			} = option
			GroupBuysApi.getActiveInfo({
				active_id
			}).then(res => {
				uni.setNavigationBarTitle({
					title: res.data.info.title
				})
				this.list = res.data.info
			})
		},

		methods: {
			// 商品详情
			toGoodsDetail(goods) {
				const {
					goods_id,
					tuan_goods_id
				} = goods
				navTo('pages/goods/detail', {
					goodsId: goods_id,
					tuanGoodsId: tuan_goods_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-container {
		height: 100vh;
		overflow-y: scroll;
		background-color: #fafafa;

		.banner {
			width: 100vw;
			height: 270rpx;
			margin-bottom: 20rpx;
			background-color: white;
		}

		.item {
			background-color: white;
			display: flex;
			align-items: center;
			width: 690rpx;
			margin-left: 30rpx;
			border-radius: 12rpx;
			box-shadow: 0 0 10rpx #efefef;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			margin-top: 30rpx;

			.left {
				width: 240rpx;
				height: 240rpx;
				margin-right: 30rpx;
				border-radius: 12rpx;
			}

			.right {
				height: 240rpx;
				display: flex;
				flex-flow: column nowrap;
				justify-content: space-around;
				flex: 1;

				.gtitle {
					font-size: 35rpx;
					font-weight: 600;
				}

				.price {
					color: #fa2209;
					font-size: 40rpx;
					font-weight: 600;

					&::before {
						content: "团购价￥";
						display: inline;
						font-size: 28rpx;
						font-weight: normal;
					}
				}

				.line-price {
					font-size: 30rpx;
					text-decoration: line-through;
				}

				.btn {
					align-self: flex-end;
					height: 70rpx;
					padding: 0 50rpx;
					box-sizing: border-box;
					line-height: 70rpx;
					text-align: center;
					color: white;
					font-size: 30rpx;
					border-radius: 8rpx;
					font-weight: 600;
					background: linear-gradient(to right, #fe5300, #fa2209);
				}
			}
		}
	}
</style>
