<template>
  <view class="search-container">
    <view class="search-box">
      <u-search placeholder="搜索" :clearabled="true" v-model="search" @search="commitSearch" @custom="commitSearch">
      </u-search>
    </view>
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true,auto:false }"
      @down="downCallback" :up="upOption" @up="upCallback">
      <view class="shop-box" v-if="list.data.length>0">
        <view class="shop-item" v-for="item,index in list.data" :key="index" @click="toShopDetail(item.shop_id)">
          <image :src="item.logo_image_url" mode="aspectFill"></image>
          <view class="shop-info">
            <view class="shop-title">{{ item.store_name }}</view>
            <view class="shop-desc">{{ item.store_info}}</view>
            <view class="shop-address">
              <van-icon name="location-o" />
              {{ item.detail }}
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>


<script>
  import * as MerchantsApi from '@/api/merchants'
  import MescrollBody from '@/components/mescroll-uni/mescroll-body'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  // 每页记录数量
  const pageSize = 15

  export default {
    data() {
      return {
        search: '',
        list: getEmptyPaginateObj(),
        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: false,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
          // 空布局
          empty: {
            tip: '亲，暂无数据'
          }
        }
      }
    },

    mixins: [MescrollMixin],

    components: {
      MescrollBody
    },


    methods: {

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getShopList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      // 获取店铺列表
      getShopList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          MerchantsApi.nearbyShopList({ search: app.search, page: pageNo })
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

      toShopDetail(shopid) {
        this.$navTo('pages/merchants/home', { shore_shop_id: shopid })
      },

      // 搜索关键词
      commitSearch() {
        if (!this.search) return this.$toast('搜点什么吧~')

        this.getShopList()
      },
    }
  }
</script>

<style scoped lang="scss">
  $nav-height: 30px;

  .search-container {

    .search-box {
      padding: 30rpx;
      box-sizing: border-box;
    }

    .shop-box {
      margin-top: 30rpx;


      .shop-item {
        // width: 50%; 
        padding: 10rpx;
        box-sizing: border-box;
        background-color: white;
        box-shadow: 0 0 10rpx #efefef;
        border-radius: 10rpx;
        margin-bottom: 30rpx;
        display: flex;
        width: 90%;
        margin-left: 5%;

        image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 10rpx 0 0 10rpx;
          margin-right: 20rpx;
        }

        .shop-info {
          padding: 20rpx 10rpx;
          box-sizing: border-box;
          width: 300rpx;
          flex: 1;

          .shop-title {
            font-size: 30rpx;
            color: #343434;
          }

          .shop-desc {
            margin: 15rpx 0;
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 28rpx;
          }
          
          .shop-address {
            color: #a5a5a5;
          }
        }

      }
    }

    .box-bg {
      background-color: #F5F5F5;
      padding: 5px 0;
    }

    .city {
      /* #ifndef APP-PLUS-NVUE */
      display: flex;
      /* #endif */
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      // width: 160rpx;
      margin-left: 4px;
    }

    .input-view {
      /* #ifndef APP-PLUS-NVUE */
      display: flex;
      /* #endif */
      flex-direction: row;
      // width: 500rpx;
      flex: 1;
      background-color: #f8f8f8;
      height: $nav-height;
      border-radius: 15px;
      padding: 0 15px;
      flex-wrap: nowrap;
      margin: 7px 0;
      line-height: $nav-height;
    }

    .input-uni-icon {
      line-height: $nav-height;
    }

    .nav-bar-input {
      height: $nav-height;
      line-height: $nav-height;
      /* #ifdef APP-PLUS-NVUE */
      width: 370rpx;
      /* #endif */
      padding: 0 5px;
      font-size: 12px;
      background-color: #f8f8f8;
    }
  }
</style>
