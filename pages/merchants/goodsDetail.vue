<template>
  <view class="goods-container">
    <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
      :duration="duration">
      <swiper-item>
        <image src="../../static/6231189fbb513655.jfif" mode="aspectFit"></image>
      </swiper-item>
      <swiper-item>
        <image src="../../static/6231189fbb513655.jfif" mode="aspectFit"></image>
      </swiper-item>
    </swiper>

    <view class="info-box">
      <view class="goods-title ">swiper做左右拖动的长列表的专项问题</view>
      <view class="price-box">
        <view class="price">￥188.88</view>
        <view class="o-price">￥388</view>
      </view>
      <view class="desc">推荐使用HBuilderX，新建uni-app项目，选择hello uni-app模板，可直接体验完整示例。</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        background: ['color1', 'color2', 'color3'],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500
      }
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
