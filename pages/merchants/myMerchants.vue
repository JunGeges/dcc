<template>
  <view class="shop-container">
    <view class="head-box">
      <image class="bg-image" src="/static/background/user-header2.png" mode="scaleToFill"></image>
      <image class="logo" src="../../static/default-avatar.png" mode="aspectFit"></image>
      <view class="title">张三的店</view>
    </view>

    <view class="edit-box">
      <view class="item" v-for="(item, index) in items" :key="index" @click="go(item.link)">
        <van-icon class="iconfont3" class-prefix="icon" :name="item.icon"></van-icon>
        <view>{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<script>
  import { navTo } from '@/core/app'
  const items = [
    { title: '店铺管理', icon: 'dianpuguanli', link: 'pages/merchants/merchantsEnter' },
    { title: '商品管理', icon: 'shangpinguanli', link: 'pages/merchants/goodsEditList' },
    { title: '添加商品', icon: 'tianjiashangpin', link: 'pages/merchants/goodsEnter' }
  ]
  export default {
    data() {
      return {
        items
      }
    },
    methods: {
      go(link) {
        navTo(link)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shop-container {

    .head-box {
      width: 100%;
      height: 280rpx;
      position: relative;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      font-size: 35rpx;
      font-weight: 600;
      color: #c59a46;

      .logo {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin-bottom: 20rpx;
      }

      .bg-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    }

    .edit-box {
      display: flex;

      .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column wrap;
        padding: 30rpx 0;
        font-size: 32rpx;
        border-right: 1rpx solid #efefef;

        view {
          margin-top: 20rpx;
        }
      }

      & .item:last-child {
        border: none;
      }
    }

  }
</style>
