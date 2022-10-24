<template>

  <view class="team-container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">
      <view class="li" v-for="(item,index) in list.data" :key="index">
        <image class="left" :src="item.avatar_url" mode="aspectFit"></image>
        <view class="mid">
          <view class="nick_name">{{ item.nick_name }}</view>
          <view v-if="item.grade_id > 0 && item.grade" class="user-grade">
            <view class="user-grade_icon">
              <image class="image"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA0lBMVEUAAAD/tjL/tzH/uDP/uC7/tjH/tzH/tzL/tTH+tTL+tjP/tDD/tTD+tzD/tjL/szD/uDH/tjL/tjL+tjD/tjT/szb/tzL/tTL+uTH+tjL/tjL/tjL/tTT/tjL/tjL+tjH/uTL/vDD/tjL/tjH/tzL9uS//tTL/nBr/sS7/tjH/ujL/szD/uTv+rzf/tzL+tzH+vDP+uzL+tjP+ry7+tDL9ki/7szf/sEX/tTL/tjL+tjL/tTH/tTT/tzH/tzL/tjP/sTX/uTP/wzX+rTn/vDX9vC8m8ckhAAAAOXRSTlMAlnAMB/vjxKWGMh0S6drMiVxPRkEY9PLy0ru0sKagmo5+dGtgVCMgBP716eXWyMGxqJGRe2o5KSmFNjaYAAABP0lEQVQ4y8XS13KDMBAF0AWDDe4t7r3ETu9lVxJgJ/n/X8rKAzHG5TE+Twz3zki7I/g/KXdghIbGJewrU4yzn08Ebgl6TuZzzuOC6W5es3HX6qsSz3NFShRU0MpucytDmOSpu3yULx3CA9RD1HjVedc0jSjqm6ZzhUjDsFDQhSp/OKj5GQvg0+ZCOixsbtDLAeTTOm/yGi8GyIphIVsgH737FEDV44LJa88IRKK/SetrwT9G/GUIr6vXjoy4GXn7+RboVXnghuSjaoGecwQxL2su3CwAKlO+QFoqxI4FMctHQhQd2OhxTu184jWUlI+rMTBTn1/IQcJHQ6GQdZ7pWiDaNdhTt330efISeiqYwQEzQpTlsURJLhzkEmpCPsERfeIUVyXr6MNuIyp5uziW6xURtt7hhGwzmMNJExfO4Bd9X0ZPqAxdNwAAAABJRU5ErkJggg==">
              </image>
            </view>
            <view class="user-grade_name">
              <text>{{ item.grade.name }}</text>
            </view>
          </view>
          <!-- <view class="">{{ item. }}</view> -->
        </view>
        <view class="right">推荐人数：{{ item.zt_cnt }}</view>
      </view>
    </mescroll-body>
  </view>
</template>
<script>
  const pageSize = 15
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import {
    getEmptyPaginateObj,
    getMoreListData
  } from '@/core/app'
  import * as TeamApi from '@/api/team'
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
          page: {
            size: pageSize
          },
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
        app.getTeamDataList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      getTeamDataList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          TeamApi.getTeamData({
              page: pageNo
            }, {
              load: false
            })
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .team-container {
    .li {
      padding: 30rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #efefef;

      .left {
        width: 100rpx;
        height: 100rpx;
        margin-right: 30rpx;
        border-radius: 50%;
      }

      .mid {
        // color: #9b9b9b;
        // line-height: 50rpx;
        // font-size: 28rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #c59a46;

        .nick_name {
          color: #242424;
          font-size: 32rpx;
          font-weight: 600;
          max-width: 270rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-grade {
          align-self: baseline;
          display: flex;
          align-items: center;
          background: #3c3c3c;
          margin-top: 12rpx;
          border-radius: 10rpx;
          padding: 4rpx 12rpx;

          .user-grade_icon .image {
            display: block;
            width: 32rpx;
            height: 32rpx;
          }

          .user-grade_name {
            margin-left: 5rpx;
            font-size: 26rpx;
            color: #EEE0C3;
          }

        }
      }

      .right {
        float: right;
        margin-left: auto;
        color: #242424;
      }
    }
  }
</style>
