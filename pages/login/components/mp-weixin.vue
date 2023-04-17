<template>
  <view class="container">
    <view class="wechatapp">
      <view class="header">
        <!-- <open-data class="avatar" type="userAvatarUrl"></open-data> -->
        <image class="image"
          :src="storeInfo && storeInfo.image_url ? storeInfo.image_url : '/static/default-avatar.png'"></image>
      </view>
    </view>
    <!--    <view class="auth-title">申请获取以下权限</view>
    <view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view> -->
    <view class="enter-area">
      <view class="avatar-box">
        <view class="">头像</view>
        <button class="avatar-wrapper" hover-class="none" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image class="avatar" :src="selfEnterInfo.avatarUrl"></image>
        </button>
      </view>
      <view class="nickname-box">
        <view class="">昵称</view>
        <input :value="selfEnterInfo.nickName" type="nickname" class="weui-input" placeholder="请输入昵称"
          @blur="getNickname" />
      </view>
    </view>
    <view class="login-btn">
      <!-- 获取微信用户信息 -->
      <button class="button btn-normal" @click.stop="getUserProfile">登录</button>
    </view>
    <view class="no-login-btn">
      <button class="button btn-normal" @click="handleCancel">暂不登录</button>
    </view>
  </view>
</template>

<script>
  import * as UploadApi from '@/api/upload'
  import * as UserApi from '@/api/user'
  import store from '@/store'
  import { isEmpty } from '@/utils/util'
  import SettingModel from '@/common/model/Setting'

  export default {

    data() {
      return {
        // 商城基本信息
        storeInfo: undefined,
        // 微信小程序登录凭证 (code)
        // 提交到后端，用于换取openid
        code: '',
        selfEnterInfo: {
          avatarUrl: '/static/default-avatar.png',
          nickName: '',
          city: '',
          country: '',
          gender: '',
          language: '',
          province: '',
          avatar_id: ''
        },
        formData: {
          imageList: [{ path: '/static/default-avatar.png' }]
        },
      }
    },

    async created() {
      // 获取商城基本信息
      this.getStoreInfo()
      // 获取用户信息
      const code = await this.getCode()
      UserApi.getUserInfo({ code }).then(res => {
        const { userInfo } = res.data.info
        if (userInfo) {
          const { avatar_url, nick_name, avatar_id } = userInfo
          this.selfEnterInfo.avatarUrl = avatar_url
          this.selfEnterInfo.nickName = nick_name
          this.selfEnterInfo.avatar_id = avatar_id
        }
      })
    },

    methods: {

      // 获取商城基本信息
      getStoreInfo() {
        SettingModel.item('store').then(store => this.storeInfo = store)

        // SettingModel.h5Url(true)
      },

      // 获取code
      // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
      getCode() {
        return new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: res => {
              console.log('code', res.code)
              resolve(res.code)
            },
            fail: reject
          })
        })
      },

      onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        this.selfEnterInfo.avatarUrl = avatarUrl
        this.formData.imageList.splice(0, 1, { path: avatarUrl })
        this.uploadFile().then(() => {

        })
      },

      getNickname(e) {
        console.log(e);
        const { value } = e.detail
        this.selfEnterInfo.nickName = value
        console.log(value);
      },

      // 获取微信用户信息(新版)
      getUserProfile() {
        const app = this
        let { nickName, avatar_id, avatarUrl } = this.selfEnterInfo

        // return this.$toast('请完善信息~')
        if (!nickName.length) this.selfEnterInfo.nickName = '微信用户'
        if (avatarUrl === '/static/default-avatar.png') this.selfEnterInfo.avatarUrl = ''
				console.log('!!@!@',this.selfEnterInfo);
        app.onAuthSuccess(Object.assign({}, this.selfEnterInfo))
        // wx.canIUse('getUserProfile') && wx.getUserProfile({
        //   lang: 'zh_CN',
        //   desc: '获取用户相关信息',
        //   success({ userInfo }) {
        //     console.log('用户同意了授权')
        //     console.log('userInfo：', userInfo)
        //     // 授权成功事件
        //     app.onAuthSuccess(userInfo)
        //   },
        //   fail() {
        //     console.log('用户拒绝了授权')
        //   }
        // })
      },

      // 授权成功事件
      // 这里分为两个逻辑:
      // 1.将code和userInfo提交到后端，如果存在该用户 则实现自动登录，无需再填写手机号
      // 2.如果不存在该用户, 则显示注册页面, 需填写手机号
      // 3.如果后端报错了, 则显示错误信息
      async onAuthSuccess(userInfo) {
        const app = this
        // 提交到后端
        store.dispatch('LoginMpWx', {
            partyData: {
              code: await app.getCode(),
              oauth: 'MP-WEIXIN',
              userInfo
            },
            refereeId: store.getters.refereeId,
            agentId: store.getters.superiorRefereeId
          })
          .then(result => {
            // 一键登录成功
            app.$toast(result.message)
            // 跳转回原页面
            setTimeout(() => {
              app.onNavigateBack()
            }, 2000)
          })
          .catch(err => {
            const resultData = err.result.data
            // 显示错误信息
            if (isEmpty(resultData)) {
              app.$toast(err.result.message)
            }
            // 跳转回原页面
            if (resultData.isBack) {
              setTimeout(() => app.onNavigateBack(1), 2000)
            }
            // 判断还需绑定手机号
            if (resultData.isBindMobile) {
              app.onEmitSuccess(userInfo)
            }
          })
      },

      // 将oauth提交给父级
      // 这里要重新获取code, 因为上一次获取的code不能复用(会报错)
      async onEmitSuccess(userInfo) {
        const app = this
        app.$emit('success', {
          oauth: 'MP-WEIXIN', // 第三方登录类型: MP-WEIXIN
          code: await app.getCode(), // 微信登录的code, 用于换取openid
          userInfo // 微信用户信息
        })
      },

      // 上传图片
      uploadFile() {
        const app = this
        const {
          formData
        } = app
        // 整理上传文件路径
        const files = []
        if (formData.imageList.length) {
          const images = formData.imageList.map(image => image)
          console.log(images);
          files.push({
            formDataIndex: 0,
            images
          })
        }
        // 批量上传
        return new Promise((resolve, reject) => {
          Promise.all(files.map((file, index) => {
              return new Promise((resolve, reject) => {
                UploadApi.image(file.images)
                  .then((fileIds) => {
                    app.selfEnterInfo.avatar_id = fileIds[0]
                    resolve(fileIds)
                  })
                  .catch(reject)
              })
            }))
            .then(resolve, reject)
        })
      },

      /**
       * 暂不登录
       */
      handleCancel() {
        // 跳转回原页面
        this.onNavigateBack()
      },

      /**
       * 登录成功-跳转回原页面
       */
      onNavigateBack(delta = 1) {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          uni.navigateBack({
            delta: Number(delta || 1)
          })
        } else {
          this.$navTo('pages/index/index')
        }
      }

    }
  }
</script>

<style lang="scss" scoped>
  .container {
    padding: 0 60rpx;
    font-size: 32rpx;
    background: #fff;
    min-height: 100vh;
  }

  .wechatapp {
    padding: 80rpx 0 48rpx;
    border-bottom: 1rpx solid #e3e3e3;
    margin-bottom: 72rpx;
    text-align: center;

    .header {
      width: 190rpx;
      height: 190rpx;
      border: 4rpx solid #fff;
      margin: 0 auto 0;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 2rpx 0 10rpx rgba(50, 50, 50, 0.3);

      .image {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .auth-title {
    color: #585858;
    font-size: 34rpx;
    margin-bottom: 40rpx;
  }

  .auth-subtitle {
    color: #888;
    margin-bottom: 88rpx;
    font-size: 28rpx;
  }

  .enter-area {
    .avatar-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100rpx;
      border-bottom: 1rpx solid #efefef;

      button {
        margin: 0;
        padding: 0;
      }

      .avatar-wrapper {
        height: 80rpx;
        width: 80rpx !important;
        border-radius: 8px;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          display: block;
        }
      }
    }
  }

  .nickname-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100rpx;
    border-bottom: 1rpx solid #efefef;

    input {
      margin-left: 30rpx;
      flex: 1;
      text-align: right;
    }
  }

  .login-btn {
    padding: 0 20rpx;
    margin-top: 100rpx;

    .button {
      height: 88rpx;
      background: #04be01;
      color: #fff;
      font-size: 30rpx;
      border-radius: 999rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }


  .no-login-btn {
    margin-top: 20rpx;
    padding: 0 20rpx;

    .button {
      height: 88rpx;
      background: #dfdfdf;
      color: #fff;
      font-size: 30rpx;
      border-radius: 999rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
