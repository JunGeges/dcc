<template>
	<view class="container">
		<view class="w-100 flex-c">
			<view class="w-100 flex-c fj-c fai-c bgc-home col-fff"
				style="padding: 30rpx 0 50rpx 0;background-color: #fa2209;">
				<view>提现金额</view>
				<view class="mgt-20">
					<span class="f-size21">￥</span>
					<span class="f-size36 f-weight-600">{{priceInfo.profit}}</span>
				</view>
			</view>
		</view>

		<view class="pd-2030">
			<view class="w-100 flex-r fj-b fai-c">
				<view class="col-000 f-size30 f-weight-600">提现金额</view>
				<view @click="selectAll(priceInfo.profit)">全部</view>
			</view>
			<view class="bgc-f7 mgt-20 w-100 flex-r fj-b fai-c" style="height: 80rpx;">
				<input class="inputv" v-model="param.money" placeholder="请输入金额" type="number" />
				<view class="mgr-30">元</view>
			</view>
			<view class="col-999 w-100 f-size21 mgt-20" style="text-align: right;">
				提现扣除{{setting.withdraw.service_fee_scale}}%手续费</view>
		</view>

		<view class="pd-2030">
			<view class="w-100 flex-r fj-b fai-c" @click="selectBank()">
				<view class="col-000 f-size30 f-weight-600">收款账户</view>
				<view>{{bankData.card_no?bankData.card_no:'选择账户'}}
					<image style="width: 10rpx; height: 20rpx;margin-left: 10rpx;" src="/static/icon_right_gray.png"
						mode="aspectFill"></image>
				</view>
			</view>
			<view v-if="bankData.card_no" class="mgt-20">
				<view style="position: relative;">
					<image class="imgbg" :src="getBankBg(bankData.bank_name)" />
					<view class="item-v">
						<view class="w-100 flex-r fj-b fai-c">
							<view class="top-v">
								<image class="imgbg-top" :src="getBankLogo(bankData.bank_name)" mode="" />
								<view class="title-v">{{bankData.bank_name}}</view>
							</view>
							<view class="col-fff"></view>
						</view>
						<view class="phone-v">{{bankData.phone.substring(0,3)}} ****
							{{bankData.phone.substring(bankData.phone.length-4,bankData.phone.length)}}
						</view>
						<view class="bankno-v">{{bankData.card_no.substring(0,4)}} **** ****
							{{bankData.card_no.substring(bankData.card_no.length-4,bankData.card_no.length)}}
						</view>
					</view>
				</view>
			</view>
		</view>


		<view class="w-100 flex-r fj-c fai-c mgt-30" style="flex-flow: column wrap">
			<view class="btn-commit" style="background: #fa2209" @click="applyWithdraw()">确认提现</view>
			<view class="tx-record" @click="toRecord">提现记录</view>
		</view>

		<view class="mgt-30">
			<view class="col-000 f-size30 f-weight-600 mgl-30">提现规则</view>
			<view class="mgl-30 mgt-30">
				<!-- <view>1.提现仅支持提现到绑定的银行账户；</view>
				<view class="mgt-10">2.提现1元起，必须为整数；</view>
				<view class="mgt-10">3.提现扣除5%手续费</view> -->
				<view>{{setting.withdraw.service_desc}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as BankApi from '@/api/bank'
	import * as UserApi from '@/api/user'
	import * as bkUtils from '@/utils/bankUtils'
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	export default {
		data() {
			return {
				priceInfo: {},
				showBankList: false,
				bankList: [],
				bankListNo: [],
				bankData: {},
				param: {
					money: '',
					bankId: ''
				},
				setting: {},
			}
		},
		components: {

		},
		mounted() {

		},
		onLoad() {

		},
		onShow() {
			this.getBankList()
			this.assets()
			this.getSetting()
		},

		methods: {
      toRecord() {
        this.$navTo('pages/withdraw/record')
      },
			assets() {
				UserApi.assets().then(res => {
					this.priceInfo = res.data.assets
					uni.setStorageSync('priceInfo', this.priceInfo)
				})
			},
			getBankList() {
				BankApi.list().then(res => {
					this.bankList = res.data.list
					for (var i = 0; i < this.bankList.length; i++) {
						this.bankListNo.push(this.bankList[i].bank_name + " " + this.bankList[i].card_no)
					}
				})
			},
			selectBank() {
				var app = this
				if (!app.bankList) {
					// app.$toast('暂未添加银行卡信息')
					return this.$navTo('pages/bank/bankList')
				}
				uni.showActionSheet({
					title: '请选择提现到账卡',
					itemList: app.bankListNo,
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						app.bankData = app.bankList[res.tapIndex]
						console.log('=====bankData=====', app.bankData)
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			selectAll(money) {
				this.param.money = money
			},
			applyWithdraw() {
				if (!this.param.money) {
					this.$toast('请输入提现金额')
					return
				}
				if (!this.bankData.bank_id) {
					this.$toast('请选择收款账户')
          this.timer =setTimeout(()=>{
            clearTimeout(this.timer)
            this.selectBank()
          },500)
					return
				}

				if (this.param.money < this.setting.withdraw.start_money) {
					this.$toast('提现金额不得低于' + this.setting.withdraw.start_money + "元")
					return
				}
				this.param.bankId = this.bankData.bank_id
				UserApi.applyWithdraw(this.param).then(res => {

					this.$toast(res.message)
					this.timer = setTimeout(() => {
						clearTimeout(this.timer)
						uni.navigateBack({})
					},500)
					if (res.status == 200) {
						this.param.money = ''
						this.assets()
					}
				})
			},
			getBankBg(name) {
				return bkUtils.getBankBg(name)
			},
			getBankLogo(name) {
				return bkUtils.getBankLogo(name)
			},
			// 获取商城设置
			getSetting() {
				const app = this
				return new Promise((resolve, reject) => {
					SettingModel.data().then(setting => {
						app.setting = setting
						resolve(setting)
					}).catch(err => reject(err))
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tx-record {
		margin-top: 30rpx;
		color: blue;
		text-decoration: underline;
	}
	.container {
		width: 100%;
		height: 100vh;
		background-color: #fff;
	}

	.inputv {
		border: 0;
		margin-left: 30rpx;
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
