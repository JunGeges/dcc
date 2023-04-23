<template>
	<view class="send-article-container">
		<view>
			<van-cell-group title="信息" inset>
				<van-field :value="form.user_name" @input="form.user_name = $event.mp.detail" required clearable label="联系人"
					placeholder="请输入联系人" :error-message="verify.user_name" />
					
				<van-field :value="form.phone" @input="form.phone = $event.mp.detail" required clearable label="联系方式"
					placeholder="请输入联系方式" type="number" :error-message="verify.phone" />

				<van-field :value="form.address" @input="form.address = $event.mp.detail" required clearable
					label="地址" placeholder="请输入详细地址" :error-message="verify.address" />

				<van-field :value="form.intro" @input="form.intro = $event.mp.detail" required clearable label="详情"
					placeholder="请输入详情" autosize type="textarea" :error-message="verify.intro" />
					
				<van-field :value="form.exchange_desc" @input="form.exchange_desc = $event.mp.detail" required clearable label="我想换"
					placeholder="换什么东西" autosize type="textarea" :error-message="verify.exchange_desc" />

			</van-cell-group>

			<van-cell-group title="请上传介绍图(建议750*750)">
				<van-uploader upload-icon="plus" :file-list="fileList" @after-read="logoAfterRead" @delete="deleteImg" max-count="9">
					<!-- <van-button icon="photo" type="primary">上传商品图</van-button> -->
				</van-uploader>
			</van-cell-group>
			<view class="tip">{{ verify.imagesIds }}</view>


			<van-button color="#fa2209" size="large" @click="save">保存</van-button>

		</view>
	</view>
</template>

<script>
	import * as UploadApi from '@/api/upload'
	import * as PublishsApi from '@/api/publish'
	import * as Utils from '@/utils/verify'
	export default {
		data() {
			return {
				// 文件id
				fileList: [],
				// 编辑加入的图片
				editFileList: [],
				form: {
					// 联系人
					user_name: '',
					// 电话
					phone: '',
					// 互换商品
					exchange_desc: '',
					// 简介
					intro: '',
					// 商品图id
					imagesIds: [],
					// 类型
					type: 20
				},
				verify: {}
			}
		},

		watch: {
			// 检测表单输入
			form: {
				deep: true,
				immediate: true,
				handler(newV) {
					for (let key in this.form) {
						if ((this.form[key] + '').length) {
							this.$set(this.verify, key, '')
						}
					}
				}
			}
		},

		onLoad(options) {
			const {
				flag,
				id
			} = options
			uni.setNavigationBarTitle({
				title: flag ? '编辑' : '发布'
			})
			this.flag = flag


			if (flag) {
			// 获取消息详情
				StationsApi.getStationNewsInfo({ id }).then(res => {
					const {
						phone,
						intro,
						address,
						imagesIds,
						id,
						images
					} = res.data.info
					this.form.phone = phone
					this.form.id = id
					this.form.intro = intro
					this.form.address = address
					this.form.imagesIds = imagesIds

					Array.isArray(images) && images.forEach(item => {
						this.fileList.push({
							path: item,
							url: item
						})
					})
				})
			}
		},


		methods: {
			// 提交保存
			save() {
				const result = this.checkField()
				if (result) return

				if (this.flag) {
					return StationsApi.editStationNews(this.form).then(res => {
						this.$toast('编辑成功')
						let timer = setTimeout(() => {
							clearTimeout(timer)
							uni.navigateBack()
						}, 1000)
					})
				}

				// 添加商品
				PublishsApi.newsPublish(this.form).then(res => {
					this.$toast(res.message)
					let timer = setTimeout(() => {
						clearTimeout(timer)
						uni.navigateBack()
					}, 1000)
				})
			},

			// 验证表单
			checkField() {
				const form = this.form
				const conifg = {
					user_name: '联系人',
					phone: '联系方式',
					address: '地址',
					intro: '详情',
					exchange_desc: '互换内容',
					imagesIds: '介绍图',
				}
				let index = 0
				let reg = ""
				for (let key in form) {
					if (key === "phone"&& !Utils.isPhone(form[key])) {
						index++
						this.$set(this.verify, key, `手机格式不对~`)
						continue
					}
					if (!(form[key] + '').length) {
						index++
						this.$set(this.verify, key, `${conifg[key]}不能为空~`)
					}
				}

				return index
			},

			// 删除图片
			deleteImg(e) {
				const {
					index
				} = e.detail
				this.fileList.splice(index, 1)
				this.form.imagesIds.splice(index, 1)
			},

			// 文件长传回调
			logoAfterRead(file) {
				console.log(file);
				const {
					url: path,
					size
				} = file.detail.file
				this.editFileList.push({
					path,
					size,
					url: path
				})
				this.fileList.push({
					path,
					size,
					url: path
				})
				this.uploadFile()
			},

			// 上传图片
			uploadFile() {
				const app = this
				// 整理上传文件路径
				const files = []
				const uploadFileList = this.flag ? this.editFileList : this.fileList
				const images = uploadFileList.map(image => image)
				files.push({
					formDataIndex: 0,
					images
				})

				// 批量上传
				return new Promise((resolve, reject) => {
					Promise.all(files.map((file, index) => {
							return new Promise((resolve, reject) => {
								UploadApi.image(file.images)
									.then((fileIds, result) => {
										app.form.imagesIds = app.form.imagesIds.concat(fileIds)
										resolve(fileIds)
									})
									.catch(reject)
							})
						}))
						.then(resolve, reject)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.send-article-container {

		/deep/ .van-popup {
			padding: 30rpx;
			box-sizing: border-box;
		}

		/deep/ .van-radio {
			margin-bottom: 20rpx;
		}

		/deep/ .van-button--large {
			width: 80%;
			margin: 50rpx 0 0 10%;
		}

		/deep/ .van-uploader {
			padding-left: 30rpx;
		}

		.tip {
			color: #ee0a24;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			font-size: 24rpx;
		}
	}
</style>