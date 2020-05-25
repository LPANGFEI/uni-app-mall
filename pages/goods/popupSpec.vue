<template>
	<view class="popup spec" v-show="spaceInfo.showSpace">
		<!-- 遮罩层 -->
		<view class="mask" @tap="hideSpec"></view>
		<view class="layer">
			<view class="content">
				<!-- 规格 -->
				<view class="title">选择规格:</view>
				<view class="sp">
					<view :class="{ on: item == goodsInfo.spec }" v-for="(item, index) in goodsData.spec" :key="index" @tap.stop="handleSpec(item)">{{ item }}</view>
				</view>
				<!-- 数量 -->
				<view class="length">
					<view class="text">数量</view>
					<!-- 数量组件 -->
					<Counter :goodsInfo="goodsInfo" @sub="sub" @add="add" />
				</view>
			</view>
			<!-- 确定按钮 -->
			<view class="btn"><view class="button" @tap="handleHideSpec">确定</view></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		goodsData: {
			type: Object,
			require: true
		},
		goodsInfo: {
			type: Object,
			require: true
		},
		spaceInfo: {
			type: Object,
			require: true
		}
	},
	methods: {
		// 关闭弹窗
		handleHideSpec() {
			// this.spaceInfo.showSpace = false;

			// 子级注册事件 父级执行事件
			this.$emit('hideSpec');
		},
		// 选择规格
		handleSpec(item) {
			// this.goodsInfo.spec = item;

			// 子级注册事件 父级执行事件
			this.$emit('setSelectSpec', item);
		},
		sub() {
			this.$emit('sub');
		},
		add() {
			this.$emit('add');
		}
	}
};
</script>

<style lang="scss">
.popup {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 20;

	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 21;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.layer {
		position: fixed;
		z-index: 22;
		bottom: 0;
		width: 92%;
		padding: 0 4%;
		height: 70%;
		border-radius: 20upx 20upx 0 0;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;

		.content {
			width: 100%;
			padding: 20upx 0;
		}

		.btn {
			width: 100%;
			height: 100upx;

			.button {
				width: 100%;
				height: 80upx;
				border-radius: 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f47952;
				font-size: 28upx;
			}
		}
	}

	&.spec {
		.title {
			font-size: 30upx;
			margin: 30upx 0;
		}

		.sp {
			display: flex;

			view {
				font-size: 28upx;
				padding: 5upx 20upx;
				border-radius: 8upx;
				margin: 0 30upx 20upx 0;
				background-color: #f6f6f6;

				&.on {
					padding: 3upx 18upx;
					border: solid 1upx #f47925;
				}
			}
		}

		.length {
			margin-top: 30upx;
			border-top: solid 1upx #aaa;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 20upx;

			.text {
				font-size: 30upx;
			}
		}
	}
}
</style>
