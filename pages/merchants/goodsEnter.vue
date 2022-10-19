<template>
  <view class="goods-enter-container">
    <view>
      <van-cell-group title="商品信息" inset>
        <van-field :value="form.goods_name" @input="form.goods_name = $event.mp.detail" required clearable label="商品名称"
          placeholder="请输入商品名" :error-message="verify.goods_name" />

        <van-field :value="form.goods_price" @input="form.goods_price = $event.mp.detail" required clearable
          label="商品价格" placeholder="请输入商品价格" type="digit" :error-message="verify.goods_price" />

        <van-field :value="form.line_price" @input="form.line_price = $event.mp.detail" required clearable label="商品划线价"
          placeholder="请输入商品划线价" type="digit" :error-message="verify.line_price" />

        <van-field :value="form.selling_point" @input="form.selling_point = $event.mp.detail" required clearable
          label="商品简介" placeholder="请输入商品简介" autosize type="textarea" :error-message="verify.selling_point" />


      </van-cell-group>

      <van-cell-group title="请上传商品图(建议750*750)">
        <van-uploader upload-icon="plus" :file-list="fileList" @after-read="logoAfterRead" :max-count="1" @delete="deleteImg">
          <!-- <van-button icon="photo" type="primary">上传商品图</van-button> -->
        </van-uploader>
      </van-cell-group>
      <view class="tip">{{ verify.image_id }}</view>


      <van-button color="#fa2209" size="large" @click="save">保存</van-button>

    </view>
  </view>
</template>

<script>
  import * as UploadApi from '@/api/upload'
  export default {
    data() {
      return {
        // 文件id
        fileList: [],
        form: {
          // 商品名
          goods_name: '',
          // 商品价格
          goods_price: '',
          // 商品划线价
          line_price: '',
          // 商品简介
          selling_point: '',
          // 商品图id
          image_id: ''
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
            if (this.form[key].length) {
              this.$set(this.verify, key, '')
            }
          }
        }
      }
    },
    
    onLoad(options) {
      const { flag } = options
      uni.setNavigationBarTitle({
        title: flag? '编辑商品': '添加商品'
      })
    },

    methods: {
      // 提交保存
      save() {
        const result = this.checkField()
        if (result > 0) return
        // TODO 提交后台
      },

      // 验证表单
      checkField() {
        const form = this.form
        const conifg = {
          goods_name: '商品名称',
          goods_price: '商品价格',
          line_price: '划线价',
          selling_point: '商品简介',
          image_id: '商品图',
        }
        let index = 0
        for (let key in form) {
          if (!form[key].length) {
            index++
            this.$set(this.verify, key, `${conifg[key]}不能为空~`)
          }
        }

        return index
      },
      
      // 删除图片
      deleteImg() {
        this.fileList.splice(0,1)
        this.form.image_id = ''
      },
      
      // 文件长传回调
      logoAfterRead(file) {
        console.log(file);
        const { url: path, size } = file.detail.file
        this.fileList.push({ path, size, url: path,  })
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
                  .then((fileIds,result) => {
                    app.form.image_id = fileIds[0]
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
