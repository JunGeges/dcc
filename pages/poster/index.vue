<template>
	<view>
		<view class='distribution-posters'>
			<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
			 @change="bindchange" previous-margin="10px" next-margin="10px">
				<block v-for="(item,index) in spreadData" :key="index" class="img-list">
					<swiper-item class="aaa">
						<div class="box">
							<view class="user-msg">
								<view class="user-code">
									<canvas :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="myCanvas" id="myCanvas"></canvas>
								</view>
							</view>
						</div>
					</swiper-item>
				</block>
			</swiper>
			<!-- #ifndef H5  -->
			<view class='keep bg-color' @click='savePosterPathMp()'>保存海报</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<div class="preserve acea-row row-center-wrapper">
				<div class="line"></div>
				<div class="tip">长按保存图片</div>
				<div class="line"></div>
			</div>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import AvatarImage from '@/components/avatar-image'
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	import * as UserApi from '@/api/user'
	import {
		checkLogin
	} from '@/core/app'
	export default {
		components: {
			AvatarImage,
		},
		data() {
			return {
				imgUrls: [],
				indicatorDots: false,
				posterImageStatus: true,
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				swiperIndex: 0,
				spreadList: [],
				userInfo: {},
				poster: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				spreadData: [{}], //新海报数据
				nickName: "",
				siteName: "",
				mpUrl: "",
				canvasImageUrl: '',
				posterImage: [],
				//二维码参数
				codeShow: false,
				cid: '1',
				ifShow: true,
				val: "", // 要生成的二维码值
				size: 200, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFF', // 背景色
				foreground: '#000', // 前景色
				pdground: '#32dbc6', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				codeSrc: "",
				canvasW: 0,
				canvasH: 0,
				SystemInfo:{},
				isLogin:true
			};
		},
		
		onShow() {
			this.getUserInfo();
			this.isLogin = checkLogin()
			this.userSpreadBannerList();
		},
		
		methods: {
			
			qrR(res) {
				this.codeSrc = res
			},
			
			getImageInfo(image) {
				return new Promise((req, rej) => {
					uni.getImageInfo({
						src: image,
						success: function(res) {
							req(res)
						},
					});
				})
			},
			
			getSystemInfo(){
				return new Promise((req, rej) => {
					uni.getSystemInfo({
						success: function (res) {
							req(res)
						}
					});
				})
			},
						
			async posterCanvas(bg,code,index){
				
				let systemInfo = await this.getSystemInfo();
				console.log(systemInfo)
			
				let goodsImg = await this.getImageInfo(bg)
        // console.log(goodsImg);
				let codeInfo = await this.getImageInfo(code)
				console.log('codeinfo',codeInfo,375-codeInfo/2,codeInfo/2)
				this.canvasH = systemInfo.windowHeight/1.5;//goodsImg.height + codeInfo.height + 50;  // 画布高度 = 主图高度+二维码高度 + 文字图片的间距（大概50）
				this.canvasW = systemInfo.windowWidth;
				
				const ctx = uni.createCanvasContext('myCanvas',this);
				
				let codex = 0.6506
				let codey = 0.7046
				let goodsy = 0.6845
				let codeSize = 0.21666
				let namex = 0.4283
				let namey = 0.7515
				let markx = 0.4283
				let marky = 0.8085
				
				ctx.fillStyle = '#fff';
				ctx.fillRect(0, 0, this.canvasW, this.canvasH);
							
				//ctx.drawImage(goodsImg.path, 0, 0, this.canvasW, this.canvasH-codeInfo.height+100) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
				// ctx.drawImage(codeInfo.path, this.canvasW-180, this.canvasH-codeInfo.height+110, codeInfo.width-200, codeInfo.height-200) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度,二维码的宽,高)
				// ctx.drawImage(goodsImg.path, 0, 0, this.canvasW, this.canvasH * goodsy) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
				ctx.drawImage(codeInfo.path, this.canvasW/2-codeInfo.width/2, 40, this.canvasW/2, this.canvasW/2) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度,二维码的宽,高)
				
				// 5、邀请信息
				if (this.canvasW < 270) {
					ctx.setFontSize(12);
				} else {
					ctx.setFontSize(14);
				}
				ctx.setFillStyle('#333')
        ctx.setTextAlign('center')
				ctx.fillText(this.spreadList.nickname+''+this.spreadList.mark,187.5, this.canvasH * namey+50);
				
				if (this.canvasW < 270) {
					ctx.setFontSize(12);
				} else {
					ctx.setFontSize(14);
				}
				ctx.setFillStyle('#b8b8b8')
        ctx.setTextAlign('center')
				ctx.fillText('长按或扫描识别二维码', 187.5, this.canvasH * marky+80);
				
				ctx.draw(true,(ret)=>{ // draw方法 把以上内容画到 canvas 中。
					console.log(ret) 
					uni.showToast({
						icon:'success',
						mask:true,
						title: '绘制完成',
					});
					uni.canvasToTempFilePath({ // 保存canvas为图片
						canvasId: 'myCanvas',
						quality: 1,
						complete: function(res) {
							// 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
							console.log(res)
							this.canvasImageUrl = res.tempFilePath
						} ,
					})
				});
			},
			//获取图片
			spreadMsg() {
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				for (let i = 0; i < this.poster.length; i++) {
					this.posterCanvas(this.poster[i].pic,this.spreadList.qrcode,this.poster[i].name)
				}
				uni.hideLoading();
			},
			
			bindchange(e) {
				let spreadList = this.spreadList;
				this.swiperIndex = e.detail.current;
			},
			
			savePosterPathMp() {
				uni.canvasToTempFilePath({
					fileType: "jpg",
					canvasId: 'myCanvas',
					success: function(res) {
						// 在H5平台下，tempFilePath 为 base64
						console.log(res.tempFilePath)
		
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: "图片已下载至【图库】，请打开【图库】查看", // res.tempFilePath
								});
							}
						});
					}
				})
			},
		
			userSpreadBannerList: function() {
				let that = this;
				uni.showLoading({
					title: '获取中',
					mask: true,
				})
				UserApi.spreadBanner({},{}).then(res => {
					uni.hideLoading();
					that.$set(that, 'spreadList', res.data);
					that.$set(that, 'poster', res.data.poster);
					that.spreadMsg();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			
			// 获取当前用户信息
			getUserInfo() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : UserApi.info({}, {
							
						})
						.then(result => {
							app.userInfo = result.data.userInfo
							resolve(app.userInfo)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #a3a3a3 !important;
	}

	.canvas {
		width: 100%;
		// height: 550px;
	}

	.box {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 18rpx;
		overflow: hidden;

		.user-msg {
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.user-code {
				width: 100%;
				// height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				justify-content: space-between;

				image {
					width: 100%;
				}
			}
		}
	}

	.img-list {
		margin-right: 40px;
	}

	.distribution-posters swiper {
		width: 100%;
		height: 1000rpx;
		position: relative;
		margin-top: 40rpx;
	}

	.distribution-posters .slide-image {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 15rpx;
	}

	.distribution-posters /deep/.active {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.distribution-posters /deep/ .quiet {
		transform: scale(0.8333333);
		transition: all 0.2s ease-in 0s;
	}

	.distribution-posters .keep {
		font-size: 30rpx;
		color: #fff;
		width: 600rpx;
		height: 80rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 80rpx;
		margin: 38rpx auto;
	}

	.distribution-posters .preserve {
		color: #fff;
		text-align: center;
		margin-top: 38rpx;
	}

	.distribution-posters .preserve .line {
		width: 100rpx;
		height: 1px;
		background-color: #fff;
	}

	.distribution-posters .preserve .tip {
		margin: 0 30rpx;
	}
</style>
