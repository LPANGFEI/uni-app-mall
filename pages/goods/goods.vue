<template>
	<view>
		<!-- 状态栏  移动端 -->
		<Status />
		<!-- 头部 -->
		<GoodsHeader />
		<!-- 轮播图 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in goodsData.swiperList" :key="swiper.id"><image :src="swiper.img"></image></swiper-item>
			</swiper>
			<!-- 图片数量 -->
			<view class="indicator">{{ currentSwiper + 1 }}/{{ goodsData.swiperList.length }}</view>
		</view>
		<!-- 标题和价格 -->
		<view class="info-box goods-info">
			<view class="price">￥{{ goodsInfo.price }}</view>
			<view class="title">{{ goodsInfo.name }}</view>
		</view>
		<!-- 选择规格 -->
		<view class="info-box" @tap="spaceInfo.showSpace = true">
			<view class="row">
				<view class="text">选择</view>
				<view class="content">
					<view>选择规格:</view>
					<view class="sp">
						<view :class="{ on: item == goodsInfo.spec }" v-for="(item, index) in goodsData.spec" :key="index">{{ item }}</view>
					</view>
				</view>
				<!-- 箭头 -->
				<view class="arrow"><view class="icon iconfont">&#xe6a3;</view></view>
			</view>
		</view>
		<!-- 模态框 -->
		<PopupSpec :goodsData="goodsData" :goodsInfo="goodsInfo" :spaceInfo="spaceInfo" @hideSpec="hideSpec" @setSelectSpec="setSelectSpec" @sub="sub" @add="add" />
		<!-- 评价 -->
		<view class="info-box comments">
			<view class="row">
				<view class="text">商品评论({{ goodsData.comment.length }})</view>
				<view class="arrow" @tap="handleRatings">
					<view class="show">
						<text>查看全部</text>
						<view class="icon iconfont">&#xe6a3;</view>
					</view>
				</view>
			</view>
			<view class="comment" @tap="handleRatings">
				<view class="user-info">
					<view class="face"><image :src="goodsData.comment[0].face"></image></view>
					<view class="username">{{ goodsData.comment[0].username }}</view>
				</view>
				<view class="content">{{ goodsData.comment[0].content }}</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content">
				<!-- 代码块 -->
				<rich-text :nodes="goodsData.descriptionStr"></rich-text>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<!-- 分享 -->
				<view class="box">
					<view class="icon iconfont">&#xe7e0;</view>
					<view class="text">分享</view>
				</view>
				<!-- 收藏 -->
				<view class="box" @tap="keep">
					<view class="icon iconfont" v-if="isKeep">&#xe64b;</view>
					<view class="icon iconfont" v-else>&#xe64c;</view>
					<view class="text">{{ isKeep ? '已' : '' }}收藏</view>
				</view>
			</view>
			<!-- 按钮 -->
			<view class="btn">
				<view class="joinCart" @tap="joinCart">加入购物车</view>
				<view class="buy" @tap="handleBuy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
import interfaces from '../../utils/interfaces.js';
import GoodsHeader from './goodsHeader.vue';
import PopupSpec from './popupSpec.vue';
export default {
	data() {
		return {
			// 收藏
			isKeep: false,
			goodsData: {
				comment: [{ face: '', content: '', username: '' }],
				descriptionStr: '',
				spec: [],
				swiperList: []
			},
			goodsInfo: {
				name: '',
				price: '',
				number: 1,
				spec: ''
			},
			// 轮播图下标
			currentSwiper: 0,
			// 是否显示模态框
			spaceInfo: { showSpace: false }
		};
	},
	components: {
		GoodsHeader,
		PopupSpec
	},
	methods: {
		initData() {
			this.request({
				url: interfaces.getGoods,
				success: res => {
					this.goodsData = res.data;
					console.log(this.goodsData);
				}
			});
		},
		swiperChange(e) {
			this.currentSwiper = e.detail.current;
		},
		handleRatings() {
			// 本地存储
			uni.setStorageSync('comments', this.goodsData.comment);
			// 页面跳转
			uni.navigateTo({
				url: './Ratings'
			});
		},
		keep() {
			this.isKeep = !this.isKeep;
			if (this.isKeep) {
				uni.showToast({
					icon: 'success',
					title: '已收藏'
				});
			}
		},
		joinCart() {
			// 存储到本地
			// 1.先去本地存储中取
			uni.getStorage({
				key: 'goodsList',
				// 拿到数据
				success: res => {
					console.log('加入成功');
					let goodsList = res.data;
					// 查找商品是否存在
					let isExist = false;
					for (let goods of goodsList) {
						// 如果商品存在,修改商品数量
						if (goods.goods_id == this.goodsInfo.goods_id && goods.spec == this.goodsInfo.spec) {
							goods.number += this.goodsInfo.number;
							isExist = true;
						}
					}
					// 商品不存在
					if (!isExist) {
						goodsList.push(this.goodsInfo);
						// 更新本地存储
						this.setGoodsList(goodsList);
					}
				},
				// 没有拿到数据，存
				fail: err => {
					console.log('加入失败');
					let goodsList = [];
					goodsList.push(this.goodsInfo);
					// 王本地存储中存储数据
					this.setGoodsList(goodsList);
				}
			});
		},
		// 存储到本地存储中
		setGoodsList(goodsList) {
			console.log('存储到本地存储中');
			uni.setStorage({
				key: 'goodsList',
				data: goodsList,
				success() {
					uni.showToast({
						icon: 'success',
						title: '加入购物车成功'
					});
				}
			});
		},
		handleBuy() {
			let tempList = [];
			tempList.push(this.goodsInfo);
			uni.setStorage({
				key: 'confirmList',
				data: tempList,
				success: res => {
					uni.navigateTo({
						url: '../Order/Confirm'
					});
				}
			});
		},
		setSelectSpec(item) {
			this.goodsInfo.spec = item;
		},
		hideSpec() {
			this.spaceInfo.showSpace = false;
		},
		sub() {
			if (this.goodsInfo.number <= 1) {
				return;
			}
			this.goodsInfo.number--;
		},
		add() {
			this.goodsInfo.number++;
		}
	},
	onLoad(option) {
		this.goodsInfo = JSON.parse(option.goodsInfo);
		console.log(this.goodsInfo);
		// 动态修改 nav title
		uni.setNavigationBarTitle({
			title: this.goodsInfo.name
		});
		this.initData();
	}
};
</script>

<style lang="scss">
/*  修改状态栏样式 */
.status {
	/* #ifdef APP-PLUS */
	opacity: 0;
	/* #endif */
}

.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;

	swiper {
		width: 100%;
		height: 100vw;

		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}

	.indicator {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		height: 40upx;
		border-radius: 40upx;
		font-size: 22upx;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}

.info-box {
	width: 92%;
	padding: 20upx 4%;
	background-color: #fff;
	margin-bottom: 20upx;
}

.goods-info {
	.price {
		font-size: 46upx;
		font-weight: 600;
		color: #f47925;
	}

	.title {
		font-size: 30upx;
	}
}

.row {
	width: 100%;
	display: flex;
	align-items: center;
	margin: 0 0 30upx 0;

	.text {
		font-size: 28upx;
		color: #a2a2a2;
		margin-right: 20upx;
	}

	.content {
		font-size: 28upx;
		display: flex;
		flex-wrap: wrap;

		.serviceitem {
			margin-right: 10upx;
		}

		.sp {
			width: 100%;
			display: flex;

			view {
				background-color: #f6f6f6;
				padding: 10upx;
				color: #999;
				margin-right: 10upx;
				font-size: 20upx;
				border-radius: 5upx;

				&.on {
					border: solid 1upx #f47952;
					padding: 4upx 8upx;
				}
			}
		}
	}

	.arrow {
		position: absolute;
		right: 4%;

		.icon {
			color: #ccc;
		}
	}
}

.comments {
	.row {
		width: 100%;
		height: 40upx;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;

		.text {
			font-size: 30upx;
		}

		.arrow {
			font-size: 28upx;
			position: absolute;
			right: 4%;
			color: #17e6a1;

			.show {
				display: flex;
				align-items: center;

				.icon {
					color: #17e6a1;
				}
			}
		}
	}

	.comment {
		width: 100%;

		.user-info {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;

			.face {
				width: 40upx;
				height: 40upx;
				margin-right: 8upx;

				image {
					width: 40upx;
					height: 40upx;
					border-radius: 100%;
				}
			}

			.username {
				font-size: 24upx;
				color: #999;
			}
		}

		.content {
			margin-top: 10upx;
			font-size: 26upx;
		}
	}
}

.description {
	.title {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #999;
	}
}

.footer {
	position: fixed;
	bottom: 0upx;
	width: 92%;
	padding: 0 4%;
	height: 99upx;
	border-top: solid 1upx #eee;
	background-color: #fff;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.icons {
		display: flex;
		height: 80upx;
		margin-left: -4%;

		.box {
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.icon {
				font-size: 40upx;
				color: #828282;
			}

			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}

	.btn {
		height: 80upx;
		border-radius: 40upx;
		overflow: hidden;
		display: flex;
		margin-right: -2%;

		.joinCart,
		.buy {
			height: 80upx;
			padding: 0 40upx;
			color: #fff;
			display: flex;
			align-items: center;
			font-size: 28upx;
		}

		.joinCart {
			background-color: #f0b46c;
		}

		.buy {
			background-color: #f06c7a;
		}
	}
}
</style>
