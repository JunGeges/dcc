<template>

  <view class="prize-container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">
      <view class="li" @click="toPrizeDetail(item.id)" v-for="(item,index) in list.data" :key="index">
        <view class="top">
          <view>{{ item.title }}</view>
          <view style="color:#a5a5a5">已开奖</view>
        </view>
        <view class="mid">
          <view>内容：中奖名单公示</view>
          <view>开奖时间：{{ item.open_time }}</view>
        </view>
        <view class="bottom">
          <view class="">查看详情</view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>
<script>
  const pageSize = 15
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import * as PrizeApi from '@/api/prize'
  export default {
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

    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],

    mounted() {
      // PrizeApi.luckyActivity().then(res => {
      //   console.log(res);
      // })
      // PrizeApi.activityInfo({ id: 1 }).then(res => {
      //   console.log(res);
      // })
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
        app.getActivityList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      getActivityList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          PrizeApi.luckyActivity({ page: pageNo }, { load: false })
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },
      toPrizeDetail(id = -1) {
        this.$navTo('lucky/lucky/prizeDetail', { id })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .prize-container {
    .li {
      margin: 30rpx 0 0 30rpx;
      box-shadow: 0 0 10rpx #efefef;
      background-color: white;
      width: 690rpx;
      border-radius: 10rpx;
      padding: 0 30rpx;
      box-sizing: border-box;

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80rpx;

        & :first-child {
          color: #343434;
          font-weight: 600;
          font-size: 32rpx;
        }

        & :last-child {
          color: red;
        }
      }

      .mid {
        padding: 20rpx 0;
        line-height: 55rpx;

        border: {
          top: 1rpx solid #efefef;
          bottom: 1rpx solid #efefef
        }

      }

      .bottom {
        display: flex;
        justify-content: flex-end;
        padding: 10rpx 0;

        view {
          background-color: #fa2209;
          color: white;
          padding: 10rpx 20rpx;
          border-radius: 50rpx;
          font-size: 28rpx;
        }
      }
    }
  }
</style>
