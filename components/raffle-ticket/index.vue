<template>
  <view class="ticket-container">
    <view class="ticket-box">
      <view class="left">
        <view>奖券编号：{{ ticket.order_no }}</view>
        <view>抽奖券</view>
      </view>
      <view class="right">
        <view :style="ticket.is_use?'opacity:.4':''" @click="goLucky">{{ ticket.is_use?'已使用':'去抽奖' }}</view>
      </view>
    </view>
  </view>

</template>

<script>
  export default {
    name: 'RaffleTicket',
    props: ['ticket'],
    methods: {
      goLucky() {
        if (this.ticket.is_use) return
        this.$navTo('lucky/lucky/index', { code: this.ticket.order_no })
      }
    }
  }
</script>

<style scoped lang="scss">
  .ticket-container {
    width: 100vw;
    display: flex;
    flex-direction: column wrap;
    align-items: center;
    justify-content: center;

    .ticket-box {
      display: flex;
      align-items: center;
      margin-top: 30rpx;

      .left {
        position: relative;
        background: #fa2209;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 350rpx;
        height: 150rpx;
        text-align: center;
        color: #fff;
        font-size: 26rpx;
        border-radius: 8rpx 0 0 8rpx;
        line-height: 40rpx;

        &::after {
          content: ' ';
          width: 0;
          height: 100%;
          position: absolute;
          border-right: 6rpx dotted white;
          right: -3rpx;
          top: 0;
        }
      }

      .right {
        height: 150rpx;
        background-color: white;
        width: 250rpx;
        border-radius: 0 8rpx 8rpx 0;
        display: flex;
        align-items: center;
        justify-content: center;

        view {
          height: 40rpx;
          text-align: center;
          background-color: #fa2209;
          border-radius: 30rpx;
          line-height: 40rpx;
          color: white;
          padding: 0 20rpx;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
