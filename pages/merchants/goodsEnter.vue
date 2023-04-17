<template>
	<view class="goods-enter-container">
		<view>
			<van-cell-group title="商品信息" inset>
				<van-field :value="form.goods_name" @input="form.goods_name = $event.mp.detail" required clearable
					label="商品名称" placeholder="请输入商品名" :error-message="verify.goods_name" />

				<van-field :value="form.goods_price" @input="form.goods_price = $event.mp.detail" required clearable
					label="商品价格" placeholder="请输入商品价格" type="digit" :error-message="verify.goods_price" />

				<van-field :value="form.line_price" @input="form.line_price = $event.mp.detail" required clearable
					label="商品划线价" placeholder="请输入商品划线价" type="digit" :error-message="verify.line_price" />

				<van-field :value="form.stock_total" @input="form.stock_total = $event.mp.detail" required clearable
					label="商品库存" placeholder="请输入商品库存" type="number" :error-message="verify.stock_total" />

				<van-field :value="form.category_name" required clearable label="商品分类" placeholder="请选择分类" readonly
					right-icon="arrow-down" :error-message="verify.category_id" @click-input="showCateList" />

				<van-field :value="form.content" @input="form.content = $event.mp.detail" required clearable
					label="商品简介" placeholder="请输入商品简介" autosize type="textarea" :error-message="verify.content" />


			</van-cell-group>

			<van-cell-group title="请上传商品图(建议750*750)">
				<van-uploader upload-icon="plus" :file-list="fileList" @after-read="logoAfterRead" @delete="deleteImg">
					<!-- <van-button icon="photo" type="primary">上传商品图</van-button> -->
				</van-uploader>
			</van-cell-group>
			<view class="tip">{{ verify.imagesIds }}</view>


			<van-button color="#fa2209" size="large" @click="save">保存</van-button>

		</view>
		<!-- 分类 -->
		<van-popup :show="showCate" @close="showCateList" position="bottom" closeable>
			<van-radio-group :value="form.category_id" @change="selectCate" direction="horizontal">
				<van-radio checked-color="#fa2209" :name="item.category_id" v-for="item,index in categoryList"
					:key="index">
					{{ item.name }}
				</van-radio>
			</van-radio-group>
		</van-popup>
	</view>
</template>

<script>
	import * as UploadApi from '@/api/upload'
	import * as MerchantsApi from '@/api/merchants'
	export default {
		data() {
			return {
				// 分类
				categoryList: [],
				// 是否显示分类
				showCate: false,
				// 文件id
				fileList: [],
				// 编辑加入的图片
				editFileList: [],
				form: {
					// 店铺id
					shop_id: '',
					// 商品名
					goods_name: '',
					// 商品价格
					goods_price: '',
					// 商品划线价
					line_price: '',
					// 商品库存
					stock_total: '',
					// 商品类别
					category_id: '',
					// 商品分类名
					category_name: '',
					// 商品简介
					content: '',
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
				store_shop_id,
				goods_id
			} = options
			uni.setNavigationBarTitle({
				title: flag ? '编辑商品' : '添加商品'
			})
			this.form.shop_id = store_shop_id
			this.form.goods_id = goods_id
			this.flag = flag


			this.getCategoryList()

			// 获取商品详情
			const form = {
				goods_id
			}
			if (flag) {
				MerchantsApi.goodsInfo(form).then(res => {
					const {
						goods_name,
						goods_price,
						line_price,
						content,
						imagesIds,
						stock_total,
						goods_image,
						category_id
					} = res.data.info
					this.form.goods_name = goods_name
					this.form.goods_price = goods_price
					this.form.line_price = line_price
					this.form.content = content
					this.form.stock_total = stock_total
					this.form.imagesIds = imagesIds
					this.form.category_id = category_id + ''
					this.form.category_name = this.categoryList.filter(item => item.category_id == category_id)[0].text

					Array.isArray(goods_image) && goods_image.forEach(item => {
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
				if (result > 0) return

				if (this.flag) {
					return MerchantsApi.editGoods(this.form).then(res => {
						this.$toast('编辑成功')
						let timer = setTimeout(() => {
							clearTimeout(timer)
							uni.navigateBack()
						}, 1000)
					})
				}

				// 添加商品
				MerchantsApi.addGoods(this.form).then(res => {
					this.$toast(res.message)
					let timer = setTimeout(() => {
						clearTimeout(timer)
						uni.navigateBack()
					}, 1000)
				})
			},

			// 显示分类
			showCateList(e) {
				this.showCate = !this.showCate
			},

			// 选择分类
			selectCate(e) {
				this.showCateList()
				const category_id = e.mp.detail + ''
				this.form.category_id = category_id
				this.form.category_name = this.categoryList.filter(item => item.category_id == category_id)[0].text
			},

			// 获取分类
			getCategoryList() {
				MerchantsApi.goodsCategoryList().then(res => {
					this.categoryList = res.data.list.map(({
						name,
						category_id
					}) => {
						return {
							text: name,
							category_id,
							name: name
						}
					})
				})
			},

			// 验证表单
			checkField() {
				const form = this.form
				const conifg = {
					goods_name: '商品名称',
					goods_price: '商品价格',
					line_price: '划线价',
					stock_total: '商品库存',
					category_id: '商品分类',
					content: '商品简介',
					imagesIds: '商品图',
				}
				let index = 0
				for (let key in form) {
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
	.goods-enter-container {
		
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
