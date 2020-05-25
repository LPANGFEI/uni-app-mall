<template>
	<view>
		<view class="header">
			<view :class="['target', { on: target.selected }]" v-for="(target, index) in filterByList" :key="index" @tap="handleSelect(index)">{{ target.text }}</view>
		</view>
		<!-- 占位 tabBar -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="goods in goodsList" :key="goods.id" @tap="handleGoods(goods)">
					<image :src="goods.img" mode="widthFix"></image>
					<view class="name">{{ goods.name }}</view>
					<view class="info">
						<view class="price">
							<text>￥</text>
							{{ goods.price }}
						</view>
						<view class="slogan">
							{{ goods.slogan }}
							<text>人付款</text>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
	</view>
</template>

<script>
import { getGoodsList } from '../../utils/interfaces.js';
export default {
	data() {
		return {
			// 商品列表大数组
			goodsList: [],
			// 默认选择
			filterBy: 'all',
			page: 1,
			size: 6,
			loadingText: '正在加载...',
			filterByList: [
				{
					text: '全部',
					selected: true,
					filterBy: 'all'
				},
				{
					text: '口碑',
					selected: false,
					filterBy: 'public'
				},
				{
					text: '热门',
					selected: false,
					filterBy: 'hot'
				}
			]
		};
	},
	methods: {
		loadData() {
			this.request({
				url: `${getGoodsList}/${this.filterBy}/${this.page}/${this.size}`,
				success: res => {
					console.log(res.data);
					let data = res.data;
					if (data.length > 0) {
						for (let item of data) {
							this.goodsList.push(item);
						}
					} else {
						this.loadingText = '到底了';
					}
				}
			});
		},
		handleSelect(index) {
			this.filterByList[index].selected = true;
			// 其他为false
			for (let i in this.filterByList) {
				if (i != index) {
					this.filterByList[i].selected = false;
				}
			}

			// 改变请求类型
			this.filterBy = this.filterByList[index].filterBy;
			this.page = 1;
			this.loadingText = '加载中...';
			this.goodsList = [];
			this.loadData();
		},
		handleGoods(goods) {
			// 页面跳转 商品详情
			uni.navigateTo({
				url: './goods?goodsInfo=' + JSON.stringify(goods)
			});
		}
	},
	onLoad(option) {
		console.log(option);
		// 动态修改 nav title
		uni.setNavigationBarTitle({
			title: option.name
		});

		// 加载数据
		this.loadData();
	},
	// 下拉刷新
	onPullDownRefresh() {
		setTimeout(() => {
			this.page = 1;
			this.loadingText = '加载中...';
			this.goodsList = [];
			this.loadData();
			uni.stopPullDownRefresh();
		}, 1000);
	},
	// 上拉加载
	onReachBottom() {
		this.page++;
		this.loadData();
	}
};
</script>

<style lang="scss">
.header {
	width: 92%;
	padding: 0 4%;
	height: 79upx;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	position: fixed;
	z-index: 10;
	background-color: #fff;
	border-bottom: solid 1upx #eee;

	.target {
		width: 20%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-bottom: -2upx;
		color: #aaa;

		&.on {
			color: #555;
			border-bottom: 4upx solid #f06c7a;
			font-weight: 600;
			font-size: 30upx;
		}

		.icon {
			font-size: 26upx;
		}
	}
}

.place {
	background-color: #ffffff;
	height: 100upx;
}

.goods-list {
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}

	.product-list {
		width: 92%;
		padding: 0 4% 3vw 4%;
		column-count: 2;
		column-gap: 1em;

		.product {
			break-inside: avoid;
			border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

			image {
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}

			.name {
				width: 92%;
				padding: 6upx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 30upx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;

				.price {
					color: #e65339;
					font-size: 30upx;
					font-weight: 600;
				}

				.slogan {
					color: #807c87;
					font-size: 24upx;
				}
			}
		}
	}
}
</style>
