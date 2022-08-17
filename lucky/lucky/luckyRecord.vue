<template>
  <view class="record-container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">

      <!-- 用户列表 -->
      <view class="item" v-for="(item, index) in list.data" :key="index">
        <view class="top">
          <view class="tl">
            <view class="">{{ item.describe }}</view>
          </view>
          <view class="tr">￥{{ item.money }}</view>
        </view>
        <view class="mid">
          <view class="">{{ item.create_time }}</view>
        </view>
<!--        <view class="bottom">
          <view class="bi">
            <text>实际到账</text>
            <text>￥{{ item.fee }}</text>
          </view>
          <view class="bi">
            <text>手续费</text>
            <text>￥{{ item.service_fee }}</text>
          </view>
        </view> -->
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import * as UserApi from '@/api/user'

  const pageSize = 15
  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 优惠券列表数据
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
            tip: '亲，暂无记录了'
          }
        }
      }
    },

    onShow() {
      this.getWithdrawList(1);
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
        app.getWithdrawList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      getWithdrawList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          UserApi.myLuckRecord({ page: pageNo }, { load: false })
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

      onRefreshList() {
        this.list = getEmptyPaginateObj()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 120)
      },

    }
  }
</script>

<style lang="scss" scoped>
  .record-container {
    background-color: #f3f3f3;

    .item {
      background: white;
      box-shadow: 0 0 10rpx #efefef;
      border-radius: 10rpx;
      margin: 30rpx 0 0 30rpx;
      width: 690rpx;
      padding: 0 30rpx;
      box-sizing: border-box;

      .top {
        display: flex;
        align-items: center;
        height: 80rpx;
        justify-content: space-between;

        .tl {
          display: flex;
          height: 100%;
          align-items: center;

          image {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            margin-right: 10rpx;
          }
        }

        .tr {
          font-weight: 600;
          font-size: 32rpx;
          color: #fa2209;
        }
      }

      .mid {
        text-align: center;
        line-height: 50rpx;
        padding: 20rpx 0;

        & :first-child {
          color: #626480;
        }
      }

      .bottom {
        .bi {
          border-bottom: 1rpx solid #efefef;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60rpx;
        }

        & .bi:last-child {
          border: none;
        }

      }
    }
  }
</style>
