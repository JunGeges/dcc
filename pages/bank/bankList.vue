<template>
	<view class="container">

		<view v-for="(item,index) in itemData" :key="index">
			<view class="w-100 flex-c">
				<view style="position: relative;">
					<image class="imgbg" :src="getBankBg(item.bank_name)" />
					<view class="item-v">
						<view class="w-100 flex-r fj-b fai-c">
							<view class="top-v">
								<image class="imgbg-top" :src="getBankLogo(item.bank_name)" mode="" />
								<view class="title-v">{{item.bank_name}}</view>
							</view>
							<view class="col-fff" @click.stop="edit(item.bank_id)">编辑</view>
						</view>
						<view class="phone-v">{{item.phone.substring(0,3)}} ****
							{{item.phone.substring(item.phone.length-4,item.phone.length)}}</view>
						<view class="bankno-v">{{item.card_no.substring(0,4)}} **** ****
							{{item.card_no.substring(item.card_no.length-4,item.card_no.length)}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="center-item pd-2030" style="margin: 20rpx 20rpx 0 20rpx;">
			<view class="w-100 flex-r fj-c fai-c" @click="addBank()">
				<span class="f-size36 f-weight-600 col-home">+</span>
				<span class="mgl-10">添加银行卡</span>
			</view>
		</view>
	</view>
</template>

<script>
	import * as BankApi from '@/api/bank'
	import * as bkUtils from '@/utils/bankUtils.js'
	export default {
		data() {
			return {
				itemData: []
			}
		},
		components: {

		},
		mounted() {

		},
		onLoad() {
			
		},
		onShow() {
			this.getList()
		},

		methods: {
			getList(){
				BankApi.list().then(res=>{
					this.itemData = res.data.list
				})
			},
			addBank() {
				uni.navigateTo({
					url: "./addBank"
				})
			},
			edit(id){
				uni.navigateTo({
					url:'./addBank?bank_id='+id
				})
			},
			getBankBg(name){
				return bkUtils.getBankBg(name)
			},
			getBankLogo(name){
				return bkUtils.getBankLogo(name)
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		background-color: #f7f7f7;
	}

	.imgbg {
		width: 100%;
		height: 300rpx;
	}

	.imgbg-top {
		width: 50rpx;
		height: 50rpx;
	}

	.item-v {
		margin-top: 15rpx;
		border-radius: 15rpx;
		width: 94%;
		height: auto;
		margin-left: 3%;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: left;
		position: absolute;
		margin-top: -280rpx;
		z-index: 99;
		color: #FFFFFF;
	}

	.title-v {
		font-size: 32rpx;
		font-weight: bold;
		margin-left: 15rpx;
	}

	.phone-v {
		font-size: 28rpx;
		margin-top: 30rpx;
	}

	.bankno-v {
		font-size: 32rpx;
		margin-top: 40rpx;
		width: 100%;
		font-weight: bold;
		text-align: center;
	}

	.top-v {
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
	}
</style>
