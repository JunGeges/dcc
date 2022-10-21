<template>
  <view class="shop-container">
    <view class="my-shop" @click="goShop">我的店铺</view>
    <view class="head-box">
      <image class="bg-image" src="/static/background/user-header2.png" mode="scaleToFill"></image>
      <image class="logo" :src="shopInfo.logo_image" mode="aspectFit"></image>
      <view class="title">{{ shopInfo.store_name }}</view>
    </view>

    <view class="edit-box">
      <view class="item" v-for="(item, index) in items" :key="index" @click="go(item)">
        <van-icon class="iconfont3" class-prefix="icon" :name="item.icon"></van-icon>
        <view>{{ item.title }}</view>
      </view>
    </view>

    <view class="desc" v-if="shopInfo.store_info">
      {{ shopInfo.store_info }}
    </view>
  </view>
</template>

<script>
  import { navTo } from '@/core/app'
  import * as MerchantsApi from '@/api/merchants'
  const items = [
    { title: '店铺管理', icon: 'dianpuguanli', link: 'pages/merchants/merchantsEnter?flag=1' },
    { title: '商品管理', icon: 'shangpinguanli', link: 'pages/merchants/goodsEditList' },
    { title: '添加商品', icon: 'tianjiashangpin', link: 'pages/merchants/goodsEnter' }
  ]
  export default {
    data() {
      return {
        items,
        shopInfo: {}
      }
    },

    onShow() {
      MerchantsApi.detail().then(res => {
        this.shopInfo = res.data.info
      })
    },

    methods: {
      // 查看店铺详情
      goShop() {
        const url = `pages/merchants/home?store_shop_id=${this.shopInfo.store_shop_id}`
        navTo(url)
      },

      go(item) {
        const { link } = item
        navTo(link, { store_shop_id: this.shopInfo.store_shop_id })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shop-container {

    position: relative;

    .my-shop {
      position: absolute;
      right: 30rpx;
      top: 30rpx;
      text-decoration: underline;
      z-index: 999;
    }

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

    .desc {
      padding: 30rpx 50rpx;
      box-sizing: border-box;
      color: #343434;
      letter-spacing: 1.5rpx;
      text-indent: 30rpx;
    }

  }
</style>
