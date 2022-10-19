<template>
  <view class="home-container">
    <image class="m-bg" src="../../static/background/user-header2.png" mode="widthFix"></image>
    <!-- 店铺信息 -->
    <view class="m-info">
      <image src="../../static/default-avatar.png" mode=""></image>
      <view class="">张三的店铺</view>
    </view>
    <view class="m-desc">
      <view class="">店铺简介：</view>
      <view class="">本店商品均属正品，假一罚十信誉保证</view>
    </view>
    <!-- 店铺地址 -->
    <view class="m-address">
      <van-icon class="iconfont3" class-prefix="icon" name="ditu_dingwei_o"></van-icon>
      <view class="address">北京市东城区天安门广场东南角一号楼24层1201</view>
      <view class="dh">
        <van-icon class="iconfont3" class-prefix="icon" name="daohang"></van-icon>
        <view class="">导航</view>
      </view>
    </view>
    <!-- 店铺商品 -->
    <view class="goods-box">
      <image src="../../static/6231189fbb513655.jfif" mode="aspectFit"></image>
      <view class="goods-info">
        <view class="">圆角正方形三件套</view>
        <view class="price-box">
          <view class="price">￥200</view>
          <view class="o-price">￥300</view>
        </view>
      </view>
    </view>
    <!-- 店铺详情 -->
    <view class="detail">
      <view class="">欢迎光临本店，本店新开张，诚信经营，只赚信誉不赚钱，谢谢，本店商品均属正品，假一罚十信誉保证。 欢迎广大顾客前来放心选购，我们将竭诚为您服务!</view>
      <image src="../../static/order/status/wait_receipt.png" mode="widthFix"></image>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @mixin p {
    padding: 0 30rpx;
    box-sizing: border-box;
    background-color: white;
  }

  .home-container {
    color: #343434;
    background: #efefef;

    .m-bg {
      width: 100vw;
      display: block;
    }

    .m-info {
      @include p;
      display: flex;
      align-items: center;
      height: 200rpx;
      font-weight: 600;
      // border-bottom: 1rpx solid #efefef;

      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
    }

    .m-desc {
      @include p;
      padding: 30rpx;
      display: flex;
      align-items: flex-start;


      border: {
        top: 1rpx solid #efefef;
        bottom: 1rpx solid #efefef;
      }

      & view:last-child {
        flex: 1;
      }
    }

    .m-address {
      @include p;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;

      .address {
        flex: 1;
        font-size: 26rpx;
        margin: 0 30rpx;
      }

      .dh {
        // float: right;
        margin-left: auto;
        margin-right: 30rpx;
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        font-size: 20rpx;
      }
    }

    .goods-box {
      display: flex;
      align-items: center;
      padding: 10rpx;
      box-sizing: border-box;
      
      width: 90%;
      margin: 30rpx auto;
      border-radius: 10rpx;
      background-color: white;
      box-shadow: 0 0 10rpx #efefef;

      image {
        width: 200rpx;
        height: 200rpx;
        margin-right: 20rpx;
        border-radius: 10rpx 0 0 10rpx;
      }

      .goods-info {
        padding: 20rpx;
        box-sizing: border-box;
        font-size: 30rpx;
        flex: 1;

        .price-box {
          font-weight: 600;
          margin-top: 20rpx;
          display: flex;
          align-items: center;
          color: #fa2209;
          font-size: 32rpx;


          & :last-child {
            font-weight: normal;
            color: #a5a5a5;
            font-size: 24rpx;
            margin-left: 20rpx;
            text-decoration: line-through;
          }
        }
      }
    }

    .detail {
      background-color: white;
      font-size: 30rpx;
      padding: 30rpx;
      box-sizing: border-box;

      view {
        letter-spacing: 1.5rpx;
      }
    }

  }
</style>
