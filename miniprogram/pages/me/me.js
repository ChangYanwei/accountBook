// pages/me/me.js
const app = getApp()
const db = wx.cloud.database();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		avatarUrl: '../../images/user-unlogin.png',
		nickName:"未登录",
		userInfo:{},
		logged: false,
		isLogin:false,
		funs:[
			{
				name:"学习充电",
				imgPath:"../../images/knowledge.png",
				itemid:"knowledge"
			},
			{
				name:"附近银行",
				imgPath: "../../images/bank.png",
				itemid: "bank"
			},
			{
				name: "汇率计算器",
				imgPath: "../../images/calculator.png",
				itemid: "rate"
			},
			{
				name: "客服",
				imgPath: "../../images/service.png",
				itemid: "service"
			},
			{
				name: "意见反馈",
				imgPath: "../../images/feedback.png",
				itemid: "feedback"
			},

		]
	},

	fun:function(e){
		console.log("点击了客服",e)
	},

	navigateToDetail:function(e){
		let itemid = e.currentTarget.dataset.itemid;
		if (itemid == "knowledge") {
			wx.navigateTo({
				url: './knowledge/knowledge'
			})
		} else if (itemid == "bank") {
			wx.navigateTo({
				url: './map/map'
			})
		} else if(itemid == "rate") {
			wx.navigateTo({
				url: './rate/rate'
			})
		} else if (itemid == "service") {
			wx.navigateTo({
				url: './service/service'
			})
		} else if (itemid == "feedback"){
			wx.navigateTo({
				url: './feedback/feedback'
			})
		}
		
	},

	onGetUserInfo:function(e) {
		// 获取用户信息
		wx.getSetting({
			success : res=> {
				if (res.authSetting['scope.userInfo']) {
					console.log("已授权=====")
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					wx.getUserInfo({
						success: res =>{
							console.log("获取用户信息成功", res)
							wx.showLoading({
							        title: '登录中',
							})
							let tempUserInfo = res.userInfo;
							console.log("tempUserInfo:",tempUserInfo)
							
							// app.globalData.userInfo = res.userInfo
							db.collection("userInfo").add({
								data: {
									userInfo:res.userInfo
								}
							}).then(res => {
								this.setData({
									userInfo: tempUserInfo,
									isLogin:true
								})
								wx.showToast({
									title: '成功',
									icon: 'success',
									success: res => {
										setTimeout(function () {
											wx.hideLoading()
										}, 1000)
									}
								})
							}).catch(err => {
								wx.showToast({
									title: "失败！请重试！",
									icon: "none"
								})
								this.setData({
									isLogin:false
								})
								setTimeout(function () {
									wx.hideLoading()
								}, 1000)
								
							})
							// wx.setStorageSync('user',res.userInfo)
							
						},
						fail:res =>{
							wx.showModal({
								title: '提示',
								content: '登录失败，请重试',
							})
							this.setData({
								isLogin:false
							})
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
		}, 1000)

		db.collection("userInfo")
			.where({
				_openid:app.globalData.openid
			})
                        .get()
                        .then(res => {
				console.log("用户信息：", res.data)
				if(res.data.length > 0){
					this.setData({
						userInfo:res.data[0].userInfo,
						isLogin:true
					})
				}
				
                        }).catch(err => {
				this.setData({
					isLogin:false
				})
			})

		// let userInfo = app.globalData.userInfo
		// console.log(userInfo)
		// this.setData({
		// 	avatarUrl: userInfo.avatarUrl,
		// 	nickName:userInfo.nickName
		// })

		// 获取用户信息
		// wx.getSetting({
		// 	success: res => {
		// 		if (res.authSetting['scope.userInfo']) {
		// 			wx.getUserInfo({
		// 				success: res => {
		// 					this.setData({
		// 						// avatarUrl: res.userInfo.avatarUrl,
		// 						// nickName:res.userInfo.nickName
		// 						userInfo:res.userInfo
		// 					})
		// 				}
		// 			})
					
		// 		}
		// 	}
		// })
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
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return{
			title:"大学生记账本",
			desc:"方便快捷的记账小程序",
			path:"/pages/welcome/welcome"
		}
	}
})