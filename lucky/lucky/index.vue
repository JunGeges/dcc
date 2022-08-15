<template>
  <view class="lucky-container">
    <!--    <LuckyWheel ref="myLucky" width="600rpx" height="600rpx" :blocks="blocks" :prizes="prizes" :buttons="buttons"
      :defaultStyle="defaultStyle" @start="startCallBack" @end="endCallBack" /> -->
    <image class="logo" src="https://bt.chongrongmd.com/uploads/img/xydzp.png" mode="aspectFit"></image>
    <image class="bg" src="https://bt.chongrongmd.com/uploads/img/zhuangshi.png" mode="aspectFit"></image>
    <view class="reduce-num">{{ num>0?`当前可以抽奖${num}次`:'您的抽奖次数不足~' }}</view>
    <lucky-grid ref="myLucky" :activeStyle="activeStyle" @end="endCallBack" @start="startCallBack" :blocks="blocks"
      :buttons="buttons" class="my-lucky" :defaultConfig="defaultConfig" :defaultStyle="defaultStyle" height="600rpx"
      id="lucky-grid" :prizes="prizes" width="600rpx"></lucky-grid>
    <navigator hover-class="none" url="/lucky/lucky/luckyRecord" class="zj-btn">
      我的中奖记录
    </navigator>
  </view>
</template>

<script>
  import LuckyWheel from '@/lucky/components/@lucky-canvas/uni/lucky-wheel'
  import LuckyGrid from '@/lucky/components/@lucky-canvas/uni/lucky-grid'
  import imgs from './img'

  import * as LuckyApi from '@/api/lucky'

  export default {
    components: {
      LuckyWheel,
      LuckyGrid
    },
    data() {
      return {
        prizes: [],
        blocks: [{
          padding: "15px",
          background: "#ffc27a",
          borderRadius: 28
        }, {
          padding: "4px",
          background: "#ff4a4c",
          borderRadius: 23
        }, {
          padding: "4px",
          background: "#ff625b",
          borderRadius: 20
        }],
        buttons: [{
          x: 1,
          y: 1,
          background: "linear-gradient(270deg, #FFDCB8, #FDC689)",
          shadow: "0 5 1 #e89b4f",
          imgs: [{
            src: imgs["button.png"],
            width: "70%",
            top: "20%"
          }]
        }],
        activeStyle: {
          background: "linear-gradient(270deg, #FFDCB8, #FDC689)",
          shadow: ""
        },
        defaultConfig: {
          gutter: 5
        },
        defaultStyle: {
          borderRadius: 15,
          fontColor: "#DF424B",
          fontSize: "14px",
          textAlign: "center",
          background: "#fff",
          shadow: "0 5 1 #ebf1f4"
        },
        num: 0
      }
    },

    onLoad(options) {
      this.code = options.code || 0
    },

    onShow() {
      LuckyApi.getLuckMoney().then(res => {
        let { num, list } = res.data
        // 金额备份
        this.moneyList = list
        // 未中奖的金额索引集合
        this.zeroMoneyList = list.map((item, index) => {
          if (item === 0) return index
        }).filter(Boolean)
        // 抽奖次数
        this.num = num
        list = list.map(item => {
          if (!item) return { name: '感谢参与', img: '/static/hb1.png' }
          return { name: `${item}元红包`, img: '/static/hb1.png' }
        })
        this.prizes = this.handlePrize(list)
      }).catch(err => {})
    },

    methods: {
      // 点击抽奖按钮触发回调
      startCallBack() {
        if (this.num <= 0) return this.$toast('抽奖次数不足~')
        LuckyApi.openLuck({ code: this.code }).then(res => {
          const { money } = res.data
          let prizeIndex = money ? this.moneyList.findIndex(item => item === money) : this.zeroMoneyList[Math.floor(
            Math.random() * this.zeroMoneyList.length)]
          // 先开始旋转
          this.$refs.myLucky.play()
          // 使用定时器来模拟请求接口
          setTimeout(() => {
            // 假设后端返回的中奖索引是0
            const index = prizeIndex
            // 调用stop停止旋转并传递中奖索引
            this.$refs.myLucky.stop(index)
            this.num = this.num - 1
          }, 3000)
        }).catch(err => {})
      },
      // 抽奖结束触发回调
      endCallBack(prize) {

        // 奖品详情
        this.$toast(prize.name === '感谢参与' ? prize.name : `恭喜您,抽中了${prize.name}`)
      },

      handlePrize(arr) {
        for (var a = [], n = arr, t = [
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 1],
            [2, 2],
            [1, 2],
            [0, 2],
            [0, 1]
          ], d = 0; d < 8; d++) {
          var i = n[d];
          a.push({
            name: i.name,
            index: d,
            x: t[d][0],
            y: t[d][1],
            fonts: [{
              text: i.name,
              top: "70%"
            }],
            imgs: [{
              src: i.img,
              width: "53%",
              top: "8%"
            }]
          });
        }

        return a
      }
    }
  }
</script>

<style>
  .lucky-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
    /* background-color: #dc415f; */
    background: linear-gradient(to bottom, #752ffa, #7e3dfb, #af89f8, #d8c9f4);
    /* background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='57' height='57' fill='%23ce3250'/%3E%3C/svg%3E"); */
    color: #fe95a8;
  }

  .reduce-num {
    background: linear-gradient(270deg, rgba(153, 115, 77, 0), rgba(154, 126, 93, .8) 50%, rgba(153, 115, 77, 0));
    text-align: center;
    margin-bottom: 50rpx;
    color: #fbb789;
  }

  .my-lucky {
    margin-top: 200rpx;
    width: 600rpx;
    /* position: absolute; */
    left: 50%;
    transform: translate(-50%);
  }

  .logo {
    width: 100vw;
    height: 300rpx;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vw;
  }

  .zj-btn {
    color: #dc415f;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: 200rpx;
    background: linear-gradient(to bottom, rgba(255, 194, 122), rgba(255, 194, 122, .8));
    box-shadow: 0 5rpx 10rpx #dc415f;
    height: 60rpx;
    border-radius: 16rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    line-height: 60rpx;

  }
</style>
