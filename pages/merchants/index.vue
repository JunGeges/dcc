<template>
  <view class="home-conatiner">
    <uni-nav-bar>
      <block slot="left">
        <view class="city">
          <view>
            <text class="uni-nav-bar-text">{{ city }}</text>
          </view>
          <uni-icons type="arrowdown" color="#666" size="18" />
        </view>
      </block>
      <view class="input-view">
        <uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
        <input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词" @confirm="confirm" />
      </view>
      <block slot="right">
        <view class="city">
          搜索
        </view>
      </block>
    </uni-nav-bar>
    <u-sticky bgColor="#fff">
      <u-tabs :list="list1" :is-scroll="false" :current="current" @change="change"></u-tabs>
    </u-sticky>
    <u-notice-bar mode="horizontal" :list="list"></u-notice-bar>

    <view class="shop-box">
      <view class="shop-item" v-for="item in 4">
        <image src="../../static/6231189fbb513655.jfif" mode="aspectFit"></image>
        <view class="shop-info">
          <view class="shop-title">包图小店</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        city: '长沙',
        list: ['uView UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用'],
        current: 0,
        list1: [{
          name: '关注',
        }, {
          name: '推荐',
        }, {
          name: '电影'
        }, {
          name: '科技'
        }, {
          name: '音乐'
        }, {
          name: '美食'
        }, {
          name: '文化'
        }, {
          name: '财经'
        }, {
          name: '手工'
        }]
      }
    },
    methods: {
      change(index) {
        this.current = index
      }
    }
  }
</script>

<style lang="scss" scoped>
  $nav-height: 30px;

  .home-conatiner {
    .shop-box {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-top: 30rpx;

      .shop-item {
        // width: 50%; 
        padding: 10rpx;
        box-sizing: border-box;
        background-color: white;
        box-shadow: 0 0 10rpx #efefef;
        border-radius: 10rpx;
        margin-bottom: 30rpx;

        image {
          width: 300rpx;
          height: 300rpx;
          border-radius: 10rpx 10rpx 0 0;
        }

        .shop-info {
          padding: 20rpx 0;
          box-sizing: border-box;
          width: 300rpx;
          .shop-title {
            font-size: 30rpx;
            color: #343434;
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
