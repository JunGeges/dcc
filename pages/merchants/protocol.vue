<template>
	<view class="protocol-container">
		<view class="" v-html="protocol"></view>
	</view>
</template>

<script>
	import * as MerchantsApi from '@/api/merchants'
	export default {
		data() {
			return {
				protocol: '',
			}
		},
		
		onLoad() {
			MerchantsApi.getShopProtocol().then(res => {
				this.protocol = res.data.content
			})
		},
		
		methods: {
			
		}
	}
</script>

<style>
.protocol-container {
	background-color: white;
	height: 100vh;
	padding: 30rpx;
	font-size: 30rpx;
}
</style>
