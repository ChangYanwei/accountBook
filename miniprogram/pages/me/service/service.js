
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中',
		})

		setTimeout(function () {
			wx.hideLoading()
		}, 500)
	},


	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "大学生记账本",
			desc: "方便快捷的记账小程序",
			path: "/pages/welcome/welcome"
		}
	}
})