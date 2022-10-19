<template>
  <view class="list-container">
    <view class="goods-item">
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
      <view class="edit-btns">
        <view @click="toGoodsDetail">查看详情</view>
        <view @click="toEditGoods">编辑</view>
      </view>
    </view>
  </view>
</template>

<script>
  import { navTo } from '@/core/app'
  export default {
    data() {
      return {

      }
    },
    methods: {
      // 查看商品详情
      toGoodsDetail() {
        navTo('pages/merchants/goodsDetail')
      },

      // 编辑商品
      toEditGoods() {
        navTo('pages/merchants/goodsEnter', { flag: 1 })
      }
    }
  }
</script>

<style scoped lang="scss">
  .list-container {
    .goods-item {
      width: 90%;
      margin: 30rpx auto;
      border-radius: 10rpx;
      background-color: white;
      box-shadow: 0 0 10rpx #efefef;

      .goods-box {
        display: flex;
        align-items: center;
        padding: 10rpx;
        box-sizing: border-box;

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

      .edit-btns {
        display: flex;
        justify-content: flex-end;
        padding: 20rpx 30rpx;
        box-sizing: border-box;
        border-top: 1rpx solid #Efefef;

        view {
          margin-left: 30rpx;
        }
      }
    }
  }
</style>
