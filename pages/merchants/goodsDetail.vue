<template>
  <view class="goods-container" v-if="goodsInfo">
    <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
      :duration="duration">
      <swiper-item v-for="item,index in goodsInfo.goods_image" :key="index">
        <image :src="item" mode="aspectFit"></image>
      </swiper-item>
    </swiper>

    <view class="info-box">
      <view class="goods-title">{{ goodsInfo.goods_name }}</view>
      <view class="price-box">
        <view class="price">￥{{ goodsInfo.goods_price }}</view>
        <view class="o-price">￥{{ goodsInfo.line_price  }}</view>
      </view>
      <view class="desc">{{ goodsInfo.selling_point }}</view>
    </view>
  </view>
</template>

<script>
  import * as MerchantsApi from '@/api/merchants'
  export default {
    data() {
      return {
        goodsInfo: '',
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500
      }
    },

    onLoad(options) {
      this.form = { goods_id: options.goods_id }

    },
    
    onShow() {
      MerchantsApi.goodsInfo(this.form).then(res => {
        res.data.info.goods_image = [res.data.info.goods_image]
        this.goodsInfo = res.data.info
      })
    },

    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .goods-container {
    height: 100vh;
    overflow: scroll;
    background: #efefef;

    .swiper {
      width: 100vw;
      height: 750rpx;

      swiper-item {
        width: 100%;
        height: 100%;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .info-box {
      background-color: white;
      padding: 30rpx;
      box-sizing: border-box;

      .goods-title {
        font-weight: 600;
        color: #343434;
        font-size: 32rpx;
      }

      .price-box {
        display: flex;
        align-items: flex-end;
        color: #fa2209;
        font-size: 30rpx;
        margin: 30rpx 0;

        .o-price {
          text-decoration: line-through;
          color: #a5a5a5;
          font-size: 24rpx;
          margin-left: 20rpx;
        }
      }
    }
  }
</style>
