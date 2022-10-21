<template>
	<view class="container">
		
		<view class="center-item"  style="margin: 20rpx 20rpx 0 20rpx;" >
			<view class="w-100 flex-r fj-b fai-c pd-2030">
				<view>真实姓名</view>
				<input style="text-align: right;" v-model="param.user_name" :placeholder="bankInfo.user_name" type="text"/>
			</view>
			<view style="width: 100%;height: 1rpx;background-color: #f7f7f7;"/>
			<view class="w-100 flex-r fj-b fai-c pd-2030">
				<view>银行卡号</view>
				<input style="text-align: right;" v-model="param.card_no" :placeholder="bankInfo.card_no" type="text"/>
			</view>
			<view style="width: 100%;height: 1rpx;background-color: #f7f7f7;"/>
			<view class="w-100 flex-r fj-b fai-c pd-2030">
				<view>银行名称</view>
				<input style="text-align: right;" v-model="param.bank_name" :placeholder="bankInfo.bank_name" type="text"/>
			</view>
		</view>
		
		<view class="center-item"  style="margin: 20rpx 20rpx 0 20rpx;" >
			<view class="w-100 flex-r fj-b fai-c pd-2030">
				<view>手机号</view>
				<input style="text-align: right;" v-model="param.phone" :placeholder="bankInfo.phone" type="text"/>
			</view>
			<!-- <view style="width: 100%;height: 1rpx;background-color: #f7f7f7;"/>
			<view class="w-100 flex-r fj-b fai-c pd-2030">
				<view class="flex-r fai-c">
					<view>验证码</view>
					<input style="text-align: right;" placeholder="请输入验证码" type="text"/>
				</view>
				<view style="color: #ED8207;">获取验证码</view>
			</view> -->
		</view>
		
		<view class="w-100 flex-c fj-c fai-c mgt-100">
			<view class="btn-commit" @click="add()"> 确认</view>
			<view v-if="bank_id" class="btn-cancel mgt-50" @click="del()">删除</view>
		</view>
	</view>	
</template>

<script>
	import * as BankApi from '@/api/bank'
	export default {
		data() {
			return {
				param:{
					user_name:'',
					bank_name:'',
					card_no:'',
					phone:'',
				},
				bank_id:'',
				bankInfo:{
					user_name:'请输入真实姓名',
					bank_name:'请输入银行及支行名称',
					card_no:'请输入银行卡号',
					phone:'请输入银行绑定手机号',
				},
			}
		},
		components:{
			
		},
		mounted() {
			
		},
		onLoad(options) {
			this.bank_id = options.bank_id
			if(this.bank_id){
				this.detail()
			}
		},
		onShow() {
			
		},
	
		methods: {
			detail(){
				var app = this
				BankApi.detail(app.bank_id).then(res=>{
					app.bankInfo = res.data.detail
				})
			},
			add(){
				var app = this
				if(this.bank_id){//编辑
					var obj = {
						user_name : app.param.user_name?app.param.user_name:app.bankInfo.user_name,
						bank_name : app.param.bank_name?app.param.bank_name:app.bankInfo.bank_name,
						card_no : app.param.card_no?app.param.card_no:app.bankInfo.card_no,
						phone : app.param.phone?app.param.phone:app.bankInfo.phone,
					}
					BankApi.edit(app.bank_id,obj).then(res=>{
						app.$toast(res.message)
						setTimeout(function(){
							uni.navigateBack({
								delta:-1
							})
						})
					})
				}else{//添加
					if(!this.param.user_name){
						this.$toast('请输入真实姓名')
						return
					}
					if(!this.param.card_no){
						this.$toast('请输入银行卡号')
						return
					}
					if(!this.param.bank_name){
						this.$toast('请输入银行名称')
						return
					}
					if(!this.param.phone){
						this.$toast('请输入手机号')
						return
					}
					BankApi.add(this.param).then(res=>{
						app.$toast(res.message)
						setTimeout(function(){
							uni.navigateBack({
								delta:-1
							})
						})
					})
				}
			},
			del(){
				var app = this
				uni.showModal({
				  title: '温馨提示',
				  content: '确定删除该银行卡~',
				  confirmText: "确定",
				  cancelText: "取消",
				  success: res => {
				    if (res.confirm) {
						app.remove()
				    }
				  }
				})
			},
			remove(){
				var app = this
				BankApi.remove(app.bank_id).then(res=>{
					app.$toast(res.message)
					if(res.status==200){
						setTimeout(function(){
							uni.navigateBack({
								delta:-1
							})
						},1000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
