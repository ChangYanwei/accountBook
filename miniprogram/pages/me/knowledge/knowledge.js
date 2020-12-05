const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardCur: 0
	},

	DotStyle(e) {
		this.setData({
			DotStyle: e.detail.value
		})
	},

	// cardSwiper
	cardSwiper(e) {
		this.setData({
			cardCur: e.detail.current
		})
	},

	getData:function(){
		wx.showLoading({
			title: '加载中',
		})
		setTimeout(function () {
			wx.hideLoading()
		}, 1000)
		db.collection("knowDetail")
		.get()
		.then(res => {
			console.log(res.data)
			this.setData({
				commonSense : res.data
			})
			let tempData = res.data
			let swiperList = []
			for (let i = 0; i < tempData.length; i++) {
				let temp = {
					id : tempData[i]._id,
					type : "image",
					url : tempData[i].picture
				}
				swiperList.push(temp)
			}
			this.setData({
				swiperList
			})
		})
		.catch(err => {
			wx.showToast({
				title: '请重试',
			})
		})
	},

	toDetail:function(e){
		let id = e.currentTarget.dataset.id
		let title = e.currentTarget.dataset.title
		console.log(id)
		wx.navigateTo({
			url: './knowledge-detail/knowledge-detail?id=' + id + "&title=" + title,
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '学习充电',
		})
		this.getData()
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