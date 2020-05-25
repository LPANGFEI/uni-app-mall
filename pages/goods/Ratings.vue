<template>
	<view>
		<video id="video" class="myVideo" :src="videoSrc" @fullscreenchange="videoControl" v-show="showVideo"></video>
		<view class="content">
			<!-- 评价选项 -->
			<view class="label">
				<view :class="{ on: index == labelIndex }" v-for="(label, index) in labelList" :key="index" @tap="handleRatings(index)">{{ label.name }}({{ label.number }})</view>
			</view>
			<!-- 评论信息 -->
			<view class="list">
				<view class="ratings" v-for="(item, index) in ratingList" :key="index">
					<view class="left">
						<view class="face"><image :src="item.face"></image></view>
					</view>
					<view class="right">
						<!-- 用户名 + 时间 -->
						<view class="name-date">
							<view class="username">{{ item.username }}</view>
							<view class="date">{{ item.date }}</view>
						</view>
						<!-- 规格 -->
						<view class="spec">{{ item.spec }}</view>
						<!-- 媒体信息 -->
						<view class="medias">
							<view class="content">{{ item.content }}</view>
							<view class="img-video">
								<!-- video -->
								<view class="box" v-for="video in item.video" :key="video.path" @tap="playVideo(video.path)">
									<image :src="video.img" mode="aspectFill"></image>
									<view class="playbtn"><view class="icon iconfont">&#xe7e9;</view></view>
								</view>
								<!-- img -->
								<view class="box" v-for="(img, index) in item.img" :key="index" @tap="showBigImg(img, item.img)"><image :src="img" mode="aspectFill"></image></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showVideo: true,
			videoSrc: '',
			videoContext: null,
			ratingList: [],
			// 当前评论下标
			labelIndex: 0,
			labelList: [
				{
					name: '全部',
					number: 25,
					type: 'all'
				},
				{
					name: '好评',
					number: 23,
					type: 'good'
				},
				{
					name: '中评',
					number: 1,
					type: 'secondary'
				},
				{
					name: '差评',
					number: 1,
					type: 'poor'
				},
				{
					name: '有图',
					number: 12,
					type: 'img'
				},
				{
					name: '视频',
					number: 2,
					type: 'video'
				},
				{
					name: '追加',
					number: 2,
					type: 'append'
				}
			]
		};
	},
	methods: {
		handleRatings(img) {
			this.labelIndex = index;
		},
		showBigImg(img, imgs) {
			// 预览大图
			uni.previewImage({
				current: img,
				urls: imgs
			});
		},
		playVideo(path) {
			this.videoSrc = path;
			// 全屏播放
			this.$nextTick(() => {
				this.videoContext.requestFullScreen({
					direction: 0
				});
			});
			// #ifdef MP
			this.showVideo = false;
			// #endif
		},
		videoControl(e) {
			// 如果全屏
			if (e.detail.fullScreen) {
				// 自动播放
				this.videoContext.play();
			} else {
				// 停止播放
				// this.videoContext.pause();
				// this.videoContext.stop();
				this.videoPause();
			}
		},
		videoPause() {
			this.videoSrc = '';
			// #ifdef MP
			this.showVideo = false;
			// #endif
		}
	},
	onLoad() {
		// #ifdef MP
		this.showVideo = false;
		// #endif
		try {
			const comments = uni.getStorageSync('comments');
			if (comments) {
				this.ratingList = comments;
			}
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}
	},
	onReady() {
		// 生成video上下文对象
		this.videoContext = uni.createVideoContext('video');
	}
};
</script>

<style lang="scss">
.content {
	view {
		display: flex;
	}

	width: 94%;
	padding: 0 3%;

	.label {
		width: 100%;
		flex-wrap: wrap;

		view {
			padding: 0 20upx;
			height: 50upx;
			border-radius: 40upx;
			border: solid 1upx #ddd;
			align-items: center;
			color: #555;
			font-size: 26upx;
			background-color: #f9f9f9;
			margin: 10upx 20upx 10upx 0;

			&.on {
				border: solid 1upx #f06c7a;
				color: #f06c7a;
			}
		}
	}
}

.list {
	width: 100%;
	flex-wrap: wrap;
	padding: 20upx 0;

	.ratings {
		width: 100%;
		margin-top: 30upx;

		.left {
			width: 10vw;
			flex-shrink: 0;
			margin-right: 10upx;

			.face {
				width: 100%;

				image {
					width: 10vw;
					height: 10vw;
					border-radius: 100%;
				}
			}
		}

		.right {
			width: 100%;
			flex-wrap: wrap;

			.name-date {
				width: 100%;
				justify-content: space-between;
				align-items: baseline;

				.username {
					font-size: 32upx;
					color: #555;
				}

				.date {
					font-size: 28upx;
					color: #aaa;
				}
			}

			.spec {
				width: 100%;
				color: #aaa;
				font-size: 26upx;
			}

			.medias {
				width: 100%;
				flex-wrap: wrap;

				.content {
					font-size: 30upx;
				}

				.img-video {
					width: 100%;
					flex-wrap: wrap;

					.box {
						width: calc((84.6vw - 50upx) / 4);
						height: calc((84.6vw - 50upx) / 4);
						margin: 5upx 5upx;
						position: relative;
						justify-content: center;
						align-items: center;

						image {
							position: absolute;
							width: 100%;
							height: 100%;
							border-radius: 10upx;
						}

						.playbtn {
							position: absolute;

							.icon {
								font-size: 80upx;
								color: rgba(255, 255, 255, 0.9);
							}
						}
					}
				}
			}
		}
	}
}

.myVideo {
	position: fixed;
	top: 50%;
	right: 100%;
	// #ifdef  MP
	top: 0;
	right: 0;
	z-index: 99;
	width: 100%;
	height: 100%;
	// #endif
}
</style>
