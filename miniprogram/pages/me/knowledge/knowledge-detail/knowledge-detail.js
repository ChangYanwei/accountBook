const db = wx.cloud.database()

Page({

        /**
         * 页面的初始数据
         */
        data: {

        },

	getOneData: function () {
		
	},

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
		wx.showLoading({
			title: options.title
		})
		wx.setNavigationBarTitle({
			title: "学习充电"
		})
		db.collection("knowDetail")
			.where({
				_id: options.id
			})
			.get()
			.then(res => {
				this.setData({
					artileData: res.data[0]
				},() => {
					wx.hideLoading()
				})
				console.log(res.data)
			})
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

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {
		return {
			title: "大学生记账本",
			desc: "方便快捷的记账小程序",
			path: "/pages/welcome/welcome"
		}
        }
})