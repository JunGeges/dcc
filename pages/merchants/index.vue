<template>
  <view class="home-conatiner">

    <view class="search-box">
      <view class="city">
        <view>
          <select-region v-model="region" placeholder="全国" @change="getSelectArea" />
        </view>
        <uni-icons type="arrowdown" color="#666" size="18" />
      </view>
      <u-search placeholder="搜索" disabled :show-action="false" @click="toSearch">
      </u-search>
    </view>

    <mescroll-body ref="mescrollRef" @init="mescrollInit" :down="{ native: true,use:true }" @down="downCallback"
      :up="upOption" @up="upCallback">


      <u-tabs :list="cateList" :is-scroll="true" active-color="#fa2209" :current="currentCateIndex" @change="getCateId">
      </u-tabs>

      <u-notice-bar v-if="noticeList.length>0" mode="horizontal" color="#de8c17" :list="noticeList"></u-notice-bar>


      <view class="shop-box">
        <view class="shop-item" v-for="item,index in list.data" :key="index" @click="toShopDetail(item.store_shop_id)">
          <image :src="item.logo_image" mode="aspectFit"></image>
          <view class="shop-info">
            <view class="shop-title">{{ item.store_name }}</view>
            <view class="shop-desc">{{ item.store_info}}</view>
            <view class="shop-address">
              <van-icon name="location-o" />
              {{ item.regions }}
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import * as MerchantsApi from '@/api/merchants'
  import SelectRegion from '@/components/select-region/select-region'

  // 每页记录数量
  const pageSize = 15
  export default {
    data() {
      return {
        // 省市区
        region: '',
        // 城市
        city: '全国',
        // 滚动通知栏
        noticeList: [],
        currentCateIndex: 0,
        // 分类集合
        cateList: [],
        // 表单
        form: {
          category_id: 0,
          city: '',
          province: '',
          region: ''
        },
        // 文案列表数据
        list: getEmptyPaginateObj(),

        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
          // 空布局
          empty: {
            tip: '亲，暂无数据'
          }
        },
      }
    },

    components: {
      SelectRegion,
      MescrollBody,
    },

    mixins: [MescrollMixin],

    onShow() {
      this.getNoticeList()
    },

    methods: {
      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      async upCallback(page) {
        console.log('upcallback');
        const app = this
        await app.getCateList()
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
          MerchantsApi.getList({ page: pageNo, ...this.form })
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

      // 刷新订单列表
      onRefreshList() {
        this.list = getEmptyPaginateObj()
        this.getNoticeList()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 500)
      },

      // 跳转店铺详情
      toShopDetail(store_shop_id) {
        this.$navTo('pages/merchants/home', { store_shop_id })
      },


      // 获取当前分类ID
      getCateId(index) {
        this.currentCateIndex = index
        this.form.category_id = this.cateList[index].category_id

        this.onRefreshList()
      },

      // 获取选择的省市区
      getSelectArea(res) {
        this.form.province = res[0].value
        this.form.city = res[1].value
        this.form.region = res[2].value
        this.onRefreshList()
      },

      // 获取分类集合
      getCateList() {
        MerchantsApi.categoryList().then(res => {
          this.cateList = res.data.list.map(item => {
            return {
              name: item.category_name,
              category_name: item.category_name,
              category_id: item.category_id,
            }
          })

          this.cateList.unshift({
            name: '全部',
            category_name: '全部',
            category_id: 0,
          })
        })
      },

      getNoticeList() {
        MerchantsApi.notice().then(res => {
          this.noticeList = []
          this.noticeList.push(res.data.notice)
        })
      },

      toSearch() {
        this.$navTo('pages/merchants/search')
      }
    }
  }
</script>

<style lang="scss" scoped>
  $nav-height: 30px;

  .home-conatiner {
    .shop-box {
      // display: flex;
      // justify-content: space-around;
      // flex-wrap: wrap;
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
            overflow: hidden;
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

    .search-box {
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      box-sizing: border-box;
      background-color: white;

      /deep/ u-search {
        flex: 1;
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
        margin-right: 30rpx;

        /deep/ .oneline-hide {
          width: 100rpx;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }


  }
</style>
