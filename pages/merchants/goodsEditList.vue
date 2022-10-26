<template>
  <view class="list-container" v-if="goodsList.length">
    <van-dialog id="van-dialog" />
    <view class="goods-item" v-for="item,index in goodsList" :key="index">
      <view class="goods-box">
        <image :src="item.goods_image[0]" mode="aspectFit"></image>
        <view class="goods-info">
          <view class="">{{ item.goods_name }}</view>
          <view class="price-box">
            <view class="price">￥{{ item.goods_price }}</view>
            <view class="o-price">￥{{ item.line_price }}</view>
          </view>
        </view>
      </view>
      <view class="edit-btns">
        <view @click="toGoodsDetail(item)">查看详情</view>
        <view @click="deleteGoods(item)">删除</view>
        <view @click="toEditGoods(item)">编辑</view>
      </view>
    </view>
  </view>
  <view class="no-goods" v-else>
    暂无商品~
  </view>
</template>

<script>
  import { navTo } from '@/core/app'
  import * as MerchantsApi from '@/api/merchants'
  import Dialog from '@/wxcomponents/vant/dialog/dialog';
  export default {
    data() {
      return {
        goodsList: []
      }
    },

    onLoad(options) {
      this.form = { shop_id: options.store_shop_id }
    },

    onShow() {
      this.getData()
    },

    methods: {
      // 查看商品详情
      toGoodsDetail(goods) {
        const { goods_id } = goods
        navTo('pages/merchants/goodsDetail', { goods_id })
      },

      // 编辑商品
      toEditGoods(goods) {
        const { goods_id } = goods
        navTo('pages/merchants/goodsEnter', { flag: 1, goods_id })
      },

      // 删除商品
      deleteGoods(goods) {
        const { goods_id } = goods
        Dialog.confirm({
            title: '警告',
            message: '您确认删除此商品吗?',
          })
          .then(() => {
            MerchantsApi.delGoods({ goods_id }).then(res => {
              this.$toast(res.message)
              this.getData()
            })
          })
          .catch(() => {
            // on cancel
          });

      },

      getData() {
        MerchantsApi.goodsList(this.form).then(res => {
          this.goodsList = res.data.list
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .no-goods {
    text-align: center;
    color: #a5a5a5;
    margin-top: 150rpx;
    font-size: 35rpx;
  }

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
