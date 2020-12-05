const app = getApp()
const db = wx.cloud.database()
Page({

        /**
         * 页面的初始数据
         */
        data: {
		userInfo: ""
        },

        async onGetUserInfo(e) {
		let that = this;
		// 获取用户信息
		wx.getSetting({
			success : res=> {
				if (res.authSetting['scope.userInfo']) {
					console.log("已授权=====")
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					wx.getUserInfo({
						success: res =>{
							console.log("获取用户信息成功", res)
							this.setData({
								userInfo: res.userInfo
							})
							app.globalData.userInfo = res.userInfo
							wx.showLoading({
							        title: '登录中',
							})
							wx.switchTab({
								url: "../account/account"
							})
						},
						fail(res) {
							console.log("获取用户信息失败", res)
						}
					})
				} else {
					console.log("未授权=====")
					wx.showModal({
						title: '提示',
						content: '为保证您的正常使用，请授权！',
					})
				}
			}
		})

		
                // console.log("用户信息：", e.detail.userInfo)
                // if (!this.data.logged && e.detail.userInfo) {
                //         this.setData({
                //                 logged: true,
                //                 avatarUrl: e.detail.userInfo.avatarUrl,
                //                 userInfo: e.detail.userInfo
                //         })
		// 	console.log("userInfo", e.detail.userInfo)
                //         app.globalData.userInfo = e.detail.userInfo
                // }

        },


        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {

		// 调用云函数
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

                // wx.getSystemInfo({
                //         success: function(res) {
                //                 // 状态栏的高度，单位px
                //                 app.globalData.statusBarHeight = res.statusBarHeight
                //                 console.log(res)
                //         },
                // })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                wx.getSetting({
                        success: res => {
                                if (res.authSetting['scope.userInfo']) {
                                        wx.switchTab({
                                                url: "../account/account"
                                        })
				} 

                        } 
                })
        },

})