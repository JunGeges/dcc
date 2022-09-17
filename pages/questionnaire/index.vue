<template>
	<view class="question-container">
		<u-form :model="form" ref="uForm" :rules="rules">
			<u-form-item label="姓名" prop="username">
				<u-input v-model="form.username" placeholder="请输入姓名" />
			</u-form-item>
			<u-form-item label="电话" prop="phone">
				<u-input v-model="form.phone" placeholder="请输入电话" />
			</u-form-item>
			<u-form-item label="地址" prop="address">
				<u-input v-model="form.address" placeholder="请输入地址" />
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
	</view>
</template>

<script>
	import * as QuestionApi from '@/api/questionnaire.js'
	export default {
		data() {
			return {
				form: {
					username: '',
					phone: '',
					address: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					address: [{
						required: true,
						message: '请输入地址',
						trigger: ['blur', 'change']
					}],
				}
			}
		},

		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},

		methods: {
			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						await this.commitInfo()
						this.timer = setTimeout(() => {
							clearTimeout(this.timer)
							uni.navigateBack({})
						}, 1000)
					} else {
						console.log('验证失败');
					}
				})
			},

			commitInfo() {
				return QuestionApi.collectUserInfo(this.form).then(res => {
					this.$toast(res.message)
					return true
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.question-container {
		padding: 0 30rpx;

		u-button {
			background-color: #fa2209;
		}
	}
</style>
