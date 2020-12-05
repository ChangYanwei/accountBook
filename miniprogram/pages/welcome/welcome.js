// miniprogram/pages/welcome/welcome.js
const app = getApp()
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
		wx.cloud.callFunction({
			name: 'login',
			data: {},
			success: res => {
				console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData.openid = res.result.openid
			},
			fail: err => {
				console.error('[云函数] [login] 调用失败', err)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.switchTab({
			url: "../account/account"
		})
		// wx.getSetting({
		// 	success: res => {
		// 		if (res.authSetting['scope.userInfo']) {
		// 			wx.switchTab({
		// 				url: "../account/account"
		// 			})
		// 		} else {
		// 			wx.navigateTo({
		// 				url: "../login/login"
		// 			})

		// 		}

		// 	}
		// })
	},

})