<template>
	<view class="send-article-container">
		<view>
			<van-cell-group title="团购信息" inset>
				<van-field :value="form.phone" @input="form.phone = $event.mp.detail" required clearable label="站长电话"
					placeholder="请输入站长电话" type="number" :error-message="verify.phone" />

				<van-field :value="form.address" @input="form.address = $event.mp.detail" required clearable
					label="团购地址" placeholder="请输入团购详细地址" :error-message="verify.address" />

				<van-field :value="form.intro" @input="form.intro = $event.mp.detail" required clearable label="团购详情"
					placeholder="请输入团购详情" autosize type="textarea" :error-message="verify.intro" />

			</van-cell-group>

			<van-cell-group title="请上传团购商品图(建议750*750)">
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
	import * as StationsApi from '@/api/station'
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
					phone: '',
					// 团购地址
					address: '',
					// 简介
					intro: '',
					// 商品图id
					imagesIds: []
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
				title: flag ? '编辑' : '发布本地团购'
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
				StationsApi.stationPublish(this.form).then(res => {
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
					phone: '联系人',
					address: '团购地址',
					intro: '团购详情',
					imagesIds: '商品图',
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
