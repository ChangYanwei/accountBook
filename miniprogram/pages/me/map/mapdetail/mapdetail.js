
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	routePlan: function () {
		let plugin = requirePlugin('routePlan');
		let key = 'XHYBZ-HYZW3-VDF3D-YY2CM-W744Q-PKBDW';  //使用在腾讯位置服务申请的key
		let referer = '大学生记账本';   //调用插件的app的名称
		let endPoint = JSON.stringify({  //终点
			'name': this.data.to_name,
			'latitude': parseFloat(this.data.to_latitude),
			'longitude': parseFloat(this.data.to_longitude)
		});
		wx.navigateTo({
			url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
		});
	},

	navigate:function(){
		wx.openLocation({
			latitude: parseFloat(this.data.to_latitude),
			longitude: parseFloat(this.data.to_longitude),
			name: this.data.to_name,
			address: this.data.to_address
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let self_latitude = options.self_latitude
		let self_longitude = options.self_longitude
		let to_latitude = options.latitude
		let to_longitude = options.longitude

		let polyline = [{
			points: [{
				longitude: self_longitude,
				latitude: self_latitude
			}, {
				longitude: to_longitude,
				latitude: to_latitude
			}],
			color: "#FF0000DD",
			width: 2,
			dottedLine: true
		}]

		let markers = [
			{
				id: 1,
				latitude: self_latitude,
				longitude: self_longitude,
				name: "我的位置",
				iconPath: "../../../../images/location.png",
				width: 30,
				height: 30,
				callout:{
					content:"我的位置",
					color:"black",
					display: "ALWAYS",
					padding:5,
					borderRadius:5,
					bgColor:"white"
				}
				
               	 	},
			{
				id: 2,
				latitude: to_latitude,
				longitude: to_longitude,
				name: options.name,
				iconPath: "../../../../images/location.png",
				width: 30,
				height: 30,
				callout: {
					content: options.name,
					color: "black",
					display: "ALWAYS",
					padding: 6,
					borderRadius: 5,
					bgColor: "white"
				}
			}
		]

		let includePoints = [
			{
				latitude: self_latitude,
				longitude: self_longitude
			},
			{
				latitude: to_latitude,
				longitude: to_longitude
			}
		]
		this.setData({
			self_latitude,
			self_longitude,
			to_latitude,
			to_longitude,
			to_name:options.name,
			to_address:options.address,
			polyline,
			markers,
			includePoints
		})
		console.log(options)
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