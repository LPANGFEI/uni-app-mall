// 封装请求
module.exports = (params) => {
	// let {
	// 	url,
	// 	method,
	// 	header,
	// 	data
	// } = params;

	let url = params.url,
		method = params.method,
		header = params.header || {},
		data = params.data || {};

	// 请求方式:GET/POST
	if (method) {
		// 转成大写
		method = method.toUpperCase();
		if (method == 'POST') {
			header = {
				'content-type': 'application/x-www-form-urlencoded'
			}
		}
	}

	// 发起请求，加载动画
	if (!params.hideLoading) {
		uni.showLoading({
			title: '加载中...'
		});
	}

	// 发起网络请求
	uni.request({
		url,
		method: method || 'GET',
		header,
		data,
		// 请求成功
		success(res) {
			// api错误
			if (res.statusCode && res.statusCode != 200) {
				uni.showModal({
					content: res.msg,
				});
				return;
			}
			typeof params.success == "function" && params.success(res.data);
		},
		// 请求失败
		fail(err) {
			uni.showModal({
				content: err.msg
			});
			typeof params.fail == "function" && params.fail(err.data);
		},
		// 请求完成，无论成功还是失败
		complete() {
			console.log('请求完成');
			// 取消加载转圈
			uni.hideLoading();
			typeof params.complete == "function" && params.complete(err.data);
			return;
		}
	});
}
