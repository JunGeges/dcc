<template>
  <view class="merchants-enter-container">

    <van-cell-group title="请上传店铺LOGO" inset>
      <van-uploader upload-icon="plus" :file-list="fileList" @after-read="logoAfterRead" :max-count="1" />
    </van-cell-group>

    <view>
      <van-cell-group title="商户信息" inset>
        <van-field :value="store_name" @input="form.store_name = $event.mp.detail" required clearable label="店铺名称"
          placeholder="请输入用户名" />

        <van-field :value="store_info" @input="form.store_info = $event.mp.detail" required clearable label="店铺简介"
          placeholder="请输入用户名" autosize type="textarea" />
        <van-field :value="merchantsPca" required clearable label="店铺分类" placeholder="请选择分类" readonly
          right-icon="arrow-down" />
        <van-field :value="merchantsPca" required clearable label="店铺地址" placeholder="请选择省市区" readonly
          right-icon="arrow-down" />
        <van-field :value="store_address" @input="form.store_address = $event.mp.detail" required clearable label="详细地址"
          placeholder="请填写详细地址" :border="false" />

      </van-cell-group>



      <van-button color="#fa2209" size="large" @click="save">保存</van-button>

    </view>



    <!-- <van-area :area-list="areaList" value="110102" /> -->

  </view>
</template>

<script>
  import * as UploadApi from '@/api/upload'
  import { areaList } from '@/utils/area'
  import { navTo } from '@/core/app'

  export default {
    data() {
      return {
        fileList: [],
        form: {
          // 店铺名称
          store_name: '',
          // 店铺简介
          store_info: '',
          // 省
          province: '',
          // 市
          city: '',
          // 区
          region: '',
          // 经度
          lng: '',
          // 纬度
          lat: '',
          // 店铺详细地址
          store_address: '',
          // 分类ID
          category_id: '',
          // logoID
          logo_image_id: ''
        },
        // 省市区
        areaList
      }
    },

    created() {
      console.log('areaList', areaList);
    },

    methods: {
      // 编辑商品，新增商品
      toGoodsEnter() {
        console.log('click');
        navTo('pages/merchants/goodsEnter')
      },
      logoAfterRead(file) {
        console.log(file);
        const { url: path, size } = file.detail.file
        this.fileList.push({ path, size })
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
                  .then(fileIds => {
                    // app.formData[index].uploaded = fileIds
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
    /deep/ .van-button--large {
      width: 80%;
      margin: 50rpx 0 0 10%;
    }

    /deep/ .van-uploader {
      padding-left: 30rpx;
    }
  }
</style>
