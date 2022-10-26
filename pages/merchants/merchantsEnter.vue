<template>
  <view class="merchants-enter-container">

    <van-cell-group title="请上传店铺LOGO">
      <van-uploader upload-icon="plus" :file-list="fileList" @after-read="logoAfterRead" :max-count="1"
        @delete="deleteImg" />
      <view class="tip">{{ verify.logo_image_id }}</view>
    </van-cell-group>

    <view>
      <van-cell-group title="商户信息" inset>
        <van-field :value="form.store_name" @input="form.store_name = $event.mp.detail" required clearable label="店铺名称"
          placeholder="请输入店铺名称" :error-message="verify.store_name" />

        <van-field :value="form.store_info" @input="form.store_info = $event.mp.detail" required clearable label="店铺简介"
          placeholder="请输入店铺简介" autosize type="textarea" :error-message="verify.store_info" />
        <van-field :value="form.phone" @input="form.phone = $event.mp.detail" required clearable label="联系方式"
          placeholder="请输入联系方式" type="number" :error-message="verify.phone" />

        <van-field :value="form.category_name" required clearable label="店铺分类" placeholder="请选择分类" readonly
          right-icon="arrow-down" :error-message="verify.category_id" @click-input="showCateList" />

        <!--        <van-field :value="getPcr" required clearable label="店铺地址" placeholder="请选择省市区" readonly right-icon="arrow-down"
          :error-message="verify.region" @click-input="showAreaList"> -->

        </van-field>
        <van-cell required title="店铺地址" center>
          <select-region v-model="form.region" />
        </van-cell>
        <van-field :value="form.store_address" @input="form.store_address = $event.mp.detail" required clearable
          label="详细地址" placeholder="街道门牌、楼层等信息" :border="false" :error-message="verify.store_address" />

      </van-cell-group>



      <van-button color="#fa2209" size="large" @click="save">保存</van-button>

    </view>

    <!-- 分类 -->
    <van-popup :show="showCate" @close="showCateList" position="bottom" closeable>
      <van-radio-group :value="form.category_id" @change="selectCate" direction="horizontal">
        <van-radio checked-color="#fa2209" :name="item.category_id" v-for="item,index in categoryList" :key="index">
          {{ item.name }}
        </van-radio>
      </van-radio-group>

    </van-popup>



  </view>
</template>

<script>
  import * as UploadApi from '@/api/upload'
  import { areaList } from '@/utils/area'
  import { navTo } from '@/core/app'
  import { debounce } from '@/utils/util'
  import * as MerchantsApi from '@/api/merchants'
  import SelectRegion from '@/components/select-region/select-region'

  var QQMapWX = require('@/utils/qqmap-wx-jssdk.js');


  var qqmapsdk = new QQMapWX({
    key: '4LIBZ-MVDCU-OYAVZ-2PFQA-V345K-YUFBJ'
  });


  export default {
    data() {
      return {
        fileList: [],
        showArea: false,
        showCate: false,
        // 分类
        categoryList: [],
        form: {
          // 店铺名称
          store_name: '',
          // 店铺简介
          store_info: '',
          // 联系方式
          phone: '',
          // 省市区
          region: '',
          // 经度
          lng: '',
          // 纬度
          lat: '',
          // 店铺详细地址
          store_address: '',
          // 分类ID
          category_id: '',
          // 分类名
          category_name: '',
          // logoID
          logo_image_id: ''
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
          if (this.form['region'].length && this.form['store_address'].length) {
            const address = `${this.getPcr}${this.form['store_address']}`
            // 防抖
            debounce(this.getLatLng(address), 3000)
          }
        }
      }
    },

    computed: {
      // 获取省市区
      getPcr() {
        return this.form.region ? this.form.region[0].label + this.form.region[1].label + this.form.region[2].label : ''
      }
    },

    onLoad(options) {
      const { flag } = options
      uni.setNavigationBarTitle({
        title: flag ? '编辑店铺' : '店铺入驻'
      })

      this.getCategoryList()

      if (flag) {
        // 获取店铺详情
        MerchantsApi.detail().then(res => {
          const {
            store_name,
            store_address,
            phone,
            store_info,
            logo_image_id,
            category_id,
            logo_image,
            lat,
            lng,
            province,
            province_id,
            city_id,
            region_id,
            city,
            regions
          } = res.data.info
          this.form.store_name = store_name
          this.form.store_info = store_info
          this.form.phone = phone
          this.form.store_address = store_address
          this.form.lat = lat
          this.form.lng = lng
          this.form.logo_image_id = logo_image_id
          this.form.logo_image = logo_image
          this.form.category_id = category_id + ''
          this.form.category_name = this.categoryList.filter(item => item.category_id == category_id)[0].text
          this.form.region = [
            { label: province, value: province_id },
            { label: city, value: city_id },
            { label: regions, value: region_id }
          ]

          this.fileList.push({ url: logo_image })
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
            const { lng, lat } = res.result.location
            app.form.lng = lng + ''
            app.form.lat = lat + ''
          }
        })
      },

      // 显示省市区选择
      showAreaList() {
        this.showArea = !this.showArea
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
        const { values } = res.detail
        this.form.region = values.map(item => item.name)
        this.form.region = values.map((item, index) => { return { value: index + 1, label: item.name } })
        this.showAreaList()
      },

      // 选择分类
      selectCate(e) {
        this.showCateList()
        const category_id = e.mp.detail + ''
        this.form.category_id = category_id
        this.form.category_name = this.categoryList.filter(item => item.category_id == category_id)[0].text
      },

      // LOGO上传
      logoAfterRead(file) {
        console.log(file);
        const { url: path, size } = file.detail.file
        this.fileList.push({ path, size })
        this.uploadFile()
      },

      // 提交保存
      save() {
        const result = this.checkField()
        console.log(result, '~~~~');
        if (result > 0) return
        // 提交后台
        MerchantsApi.add(this.form).then(res => {
          this.$toast('保存成功')
          let timer = setTimeout(() => {
            clearTimeout(timer)
            uni.navigateBack()
          }, 1000)
        })
      },

      // 获取分类
      getCategoryList() {
        MerchantsApi.categoryList().then(res => {
          this.categoryList = res.data.list.map(({ category_name, category_id }) => {
            return {
              text: category_name,
              category_id,
              name: category_name
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
          category_id: '店铺分类',
          store_address: '详细地址',
          phone: '联系方式',
          region: '省市区',
          logo_image_id: '店铺LOGO',
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
      deleteImg() {
        this.fileList.splice(0, 1)
        this.form.logo_image_id = ''
      },

      // 文件长传回调
      logoAfterRead(file) {
        console.log(file);
        const { url: path, size } = file.detail.file
        this.fileList.push({ path, size, url: path, })
        this.uploadFile()
      },

      // 上传图片
      uploadFile() {
        const app = this
        // 整理上传文件路径
        const files = []
        const images = this.fileList.map(image => image)
        files.push({ formDataIndex: 0, images })

        // 批量上传
        return new Promise((resolve, reject) => {
          Promise.all(files.map((file, index) => {
              return new Promise((resolve, reject) => {
                UploadApi.image(file.images)
                  .then((fileIds, result) => {
                    app.form.logo_image_id = fileIds[0] + ''
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
