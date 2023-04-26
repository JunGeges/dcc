<template>
	<view class="merchants-enter-container">

		<van-cell-group title="请上传店铺LOGO">
			<van-uploader upload-icon="plus" :file-list="fileLogoList" @after-read="logoAfterRead" :max-count="1"
				@delete="deleteImg(0)" />
			<view class="tip">{{ verify.logo_image_id }}</view>
		</van-cell-group>
		<van-cell-group title="请上传营业执照">
			<van-uploader upload-icon="plus" :file-list="fileZzList" @after-read="zzAfterRead" :max-count="1"
				@delete="deleteImg(1)" />
			<view class="tip">{{ verify.business_image_id }}</view>
		</van-cell-group>
		<van-cell-group title="其它补充材料(比如食品许可)">
			<van-uploader upload-icon="plus" :file-list="fileQtList" @after-read="qtAfterRead" :max-count="1"
				@delete="deleteImg(2)" />
		</van-cell-group>

		<view>
			<van-cell-group title="商户信息" inset>

				<van-field :value="form.shop_type_name" required clearable label="店铺类型" placeholder="店铺类型" readonly
					right-icon="arrow" :error-message="verify.shop_type" @click-input="showShopType" />

				<van-field :value="form.category_name" required clearable label="店铺分类" placeholder="请选择分类" readonly
					right-icon="arrow" :error-message="verify.category_id" @click-input="showCateList" />
				<van-field :value="form.store_name" @input="form.store_name = $event.mp.detail" required clearable
					label="店铺名称" placeholder="请输入店铺名称" :error-message="verify.store_name" />

				<van-field :value="form.store_info" @input="form.store_info = $event.mp.detail" required clearable
					label="店铺简介" placeholder="请输入店铺简介" autosize type="textarea" :error-message="verify.store_info" />
				<van-field :value="form.name" @input="form.name = $event.mp.detail" required clearable label="联系人"
					placeholder="请输入联系人" :error-message="verify.name" />
				<van-field :value="form.phone" @input="form.phone = $event.mp.detail" required clearable label="联系方式"
					placeholder="请输入联系方式" type="number" :error-message="verify.phone" />

				<!--        <van-field :value="form.category_name" required clearable label="店铺分类" placeholder="请选择分类" readonly
          right-icon="arrow-down" :error-message="verify.category_id" @click-input="showCateList" /> -->

				<!--        <van-field :value="getPcr" required clearable label="店铺地址" placeholder="请选择省市区" readonly right-icon="arrow-down"
          :error-message="verify.region" @click-input="showAreaList"> -->

				</van-field>
				<van-cell required title="店铺地址" center>
					<select-region v-model="form.region" />
				</van-cell>
				<van-field :value="form.detail" @input="form.detail = $event.mp.detail" required clearable label="详细地址"
					placeholder="街道门牌、楼层等信息" :border="false" :error-message="verify.detail" />

				<van-checkbox :value="checked" iconSize="15"  checkedColor="red" shape="square" @change="onChangeChecked">
				  <text @click.stop="toProtocol" style="color: blue;text-decoration: underline;">店铺入驻协议</text>
				</van-checkbox>

			</van-cell-group>
			

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

		<!-- 店铺类型 -->
		<van-action-sheet :show="isShowShopType" :actions="shop_type_action" @close="showShopType"
			@select="selectShopType" />



	</view>
</template>

<script>
	import * as UploadApi from '@/api/upload'
	import {
		areaList
	} from '@/utils/area'
	import {
		navTo
	} from '@/core/app'
	import {
		debounce
	} from '@/utils/util'
	import * as MerchantsApi from '@/api/merchants'
	import SelectRegion from '@/components/select-region/select-region'

	var QQMapWX = require('@/utils/qqmap-wx-jssdk.js');


	var qqmapsdk = new QQMapWX({
		key: 'DGEBZ-ZWJW3-IQP32-OA4MW-YOVS3-QVFRY'
	});

	// 线上店铺 线下店铺
	const ONLINE = 10,
		OFFLINE = 20
	const shop_type_action = [{
		name: '线上店铺',
		type: ONLINE

	}, {
		name: '线下店铺',
		type: OFFLINE
	}]
	export default {
		data() {
			return {
				// 勾选协议
				checked: false,
				// 店铺类型
				shop_type_action,
				isShowShopType: false,
				fileLogoList: [],
				fileZzList: [],
				fileQtList: [],
				showArea: false,
				showCate: false,
				// 分类
				categoryList: [],
				form: {
					// 店铺名称
					store_name: '',
					// 店铺简介
					store_info: '',
					// 联系人
					name: '',
					// 联系方式
					phone: '',
					// 省市区
					region: '',
					// 经度
					longitude: '',
					// 纬度
					latitude: '',
					// 店铺详细地址
					detail: '',
					// 分类ID
					category_id: '',
					// 分类名
					category_name: '',
					// logoID
					logo_image_id: '',
					// 营业执照
					business_image_id: '',
					// 其它材料
					license_image_id: '',
					// 店铺类型
					shop_type: '',
					// 店铺类型名
					shop_type_name: ''
				},
				verify: {},
				// 省市区
				areaList,
			}
		},

		components: {
			SelectRegion
		},

		watch: {
			// 检测表单输入
			form: {
				deep: true,
				immediate: true,
				handler(newV) {
					for (let key in this.form) {
						if (this.form[key].length) {
							this.$set(this.verify, key, '')
						}
					}

					// 是否填写了地址
					if (this.form['region'].length && this.form['detail'].length) {
						const address = `${this.getPcr}${this.form['detail']}`
						// 防抖
						debounce(this.getLatLng(address), 3000)
					}
				}
			}
		},

		computed: {
			// 获取省市区
			getPcr() {
				return this.form.region ? this.form.region[0].label + this.form.region[1].label + this.form.region[2]
					.label : ''
			}
		},

		onLoad(options) {
			const {
				flag
			} = options
			this.flag = flag
			uni.setNavigationBarTitle({
				title: flag ? '编辑店铺' : '店铺入驻'
			})

			this.getCategoryList()

			if (flag) {
				// 获取店铺详情
				MerchantsApi.detail().then(res => {
					const {
						store_name,
						store_info,
						logo_image_id,
						shop_type,
						category_id,
						category: {
							name: cname
						},
						logo_image_url,
						business_image_id,
						business_image_url,
						license_image_id,
						license_image_url
					} = res.data.info
					const {
						detail,
						phone,
						name,
						latitude,
						longitude,
						province_id,
						city_id,
						region_id,
						region: {
							province,
							city,
							region
						}
					} = res.data.info.address
					this.form.store_name = store_name
					this.form.name = name
					this.form.store_info = store_info
					this.form.phone = phone
					this.form.detail = detail
					this.form.latitude = latitude
					this.form.longitude = longitude
					this.form.logo_image_id = logo_image_id
					this.form.business_image_id = business_image_id
					this.form.license_image_id = license_image_id || ''
					this.form.shop_type = shop_type
					this.form.shop_type_name = this.handleShopType(shop_type)
					this.form.category_id = category_id + ''
					this.form.category_name = cname
					this.form.region = [{
							label: province,
							value: province_id
						},
						{
							label: city,
							value: city_id
						},
						{
							label: region,
							value: region_id
						}
					]

					this.fileLogoList.push({
						url: logo_image_url
					})
					this.fileZzList.push({
						url: business_image_url
					})
					license_image_id && this.fileQtList.push({
						url: license_image_url
					})
				})
			}
		},

		methods: {
			// 获取经纬度
			getLatLng(address) {
				var app = this
				qqmapsdk.geocoder({
					address,
					success(res, data) {
						const {
							lat,
							lng
						} = res.result.location
						app.form.longitude = lng + ''
						app.form.latitude = lat + ''
					}
				})
			},
			
			// 电子协议
			onChangeChecked(e) {
				this.checked = e.detail
			},
			
			toProtocol() {
				uni.navigateTo({
					url: 'protocol',
				})
			},

			handleShopType(shop_type) {
				let result = ''
				shop_type_action.forEach(item => {
					if (item.type === shop_type) {
						result = item.name
					}
				})
				return result
			},

			// 显示省市区选择
			showAreaList() {
				this.showArea = !this.showArea
			},

			// 显示店铺类型
			showShopType() {
				this.isShowShopType = !this.isShowShopType
			},

			// 选择店铺类型
			selectShopType(event) {
				const {
					name,
					type
				} = event.detail
				this.form.shop_type = type
				this.form.shop_type_name = name
			},

			// 显示分类
			showCateList(e) {
				this.showCate = !this.showCate
			},

			// 选择省市区
			selectPcr(res) {
				// 0: {code: "110000", name: "北京市"}
				// 1: {code: "110100", name: "北京市"}
				// 2: {code: "110101", name: "东城区"}
				const {
					values
				} = res.detail
				this.form.region = values.map(item => item.name)
				this.form.region = values.map((item, index) => {
					return {
						value: index + 1,
						label: item.name
					}
				})
				this.showAreaList()
			},

			// 选择分类
			selectCate(e) {
				this.showCateList()
				const category_id = e.mp.detail + ''
				this.form.category_id = category_id
				this.form.category_name = this.categoryList.filter(item => item.category_id == category_id)[0].text
			},

			// 提交保存
			save() {
				const result = this.checkField()
				if (result > 0) return
				if(!this.checked) return this.$toast('请勾选店铺入驻协议~')
				// 提交后台
				MerchantsApi[this.flag ? "edit" : "add"](this.form).then(res => {
					this.$toast('保存成功')
					let timer = setTimeout(() => {
						clearTimeout(timer)
						uni.navigateBack()
					}, 1000)
				})
			},

			// 获取分类
			getCategoryList() {
				MerchantsApi.getShopCategory().then(res => {
					this.categoryList = res.data.list.map(({
						name,
						category_id
					}) => {
						return {
							text: name,
							category_id,
							name
						}
					})
				})
			},

			// 验证表单
			checkField() {
				const form = this.form
				const conifg = {
					store_name: '店铺名称',
					store_info: '店铺简介',
					shop_type: '店铺类型',
					category_id: '店铺分类',
					detail: '详细地址',
					name: '联系人',
					phone: '联系方式',
					region: '省市区',
					logo_image_id: '店铺LOGO',
					business_image_id: '营业执照'
				}
				let index = 0
				for (let key in form) {
					// license_image_id 不必填
					if (key !== 'license_image_id' && !(form[key] + '').length) {
						index++
						this.$set(this.verify, key, `${conifg[key]}不能为空~`)
					}
				}

				return index
			},

			// 删除图片
			deleteImg(index) {
				const configList = ['fileLogoList', 'fileZzList', 'fileQtList']
				const configId = ['logo_image_id', 'business_image_id', 'license_image_id']
				this[`${ configList[index] }`].splice(0, 1)
				this.form[`${configId[index]}`] = ''
			},

			// 文件长传回调
			logoAfterRead(file) {
				const {
					url: path,
					size
				} = file.detail.file
				this.fileLogoList.push({
					path,
					size,
					url: path,
				})
				this.uploadFile(0)
			},

			zzAfterRead(file) {
				const {
					url: path,
					size
				} = file.detail.file
				this.fileZzList.push({
					path,
					size,
					url: path,
				})
				this.uploadFile(1)
			},

			qtAfterRead(file) {
				const {
					url: path,
					size
				} = file.detail.file
				this.fileQtList.push({
					path,
					size,
					url: path,
				})
				this.uploadFile(2)
			},



			// 上传图片
			uploadFile(idx) {
				const app = this
				const configList = ['fileLogoList', 'fileZzList', 'fileQtList']
				const configId = ['logo_image_id', 'business_image_id', 'license_image_id']
				// 整理上传文件路径
				const files = []
				const images = this[`${ configList[idx] }`].map(image => image)
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
										app.form[`${ configId[idx] }`] = fileIds[0] + ''
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
	.merchants-enter-container {
		height: 100vh;
		
		/deep/ .van-checkbox {
			justify-content: center;
			margin-top: 30rpx;
		}

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
