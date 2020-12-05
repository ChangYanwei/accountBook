
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		countries:[
			{
				name:"人民币",
				imgPath:"../../../images/china.png"
			},
			{
				name:"港元",
				imgPath:"../../../images/HKG.png"
			},
			{
				name: "澳元",
				imgPath: "../../../images/Macao.png"
			},
			{
				name: "美元",
				imgPath: "../../../images/America.png"
			},
			{
				name: "欧元",
				imgPath: "../../../images/EU.png"
			},
			{
				name: "英镑",
				imgPath: "../../../images/England.png"
			},
			{
				name: "日元",
				imgPath: "../../../images/Japan.png"
			}
		],
		placeholderCNY:"100",
		placeholderHKD:"109.51",
		placeholderMOP:"114.78",
		placeholderUSD:"14.12",
		placeholderEUR:"12.79 ",
		placeholderGBP:"12.11",
		placeholderJPY:"1565.07",
	},

	// 人民币 --> 其它
	convertCNY:function(e){
		console.log("正在输入",e.detail.value)
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueHKD: "",
				valueMOP:"",
				valueUSD: "",
				valueEUR: "",
				valueGBP: "",
				valueJPY: "",
			})
		} else {
			let num = parseInt(temp)
			// toFixed用来保留4位小数，parseFloat将小数点最后几位是0的去掉
			this.setData({
				valueHKD: parseFloat((num * 1.0951).toFixed(4)),
				valueMOP: parseFloat((num * 1.1478).toFixed(4)),
				valueUSD : parseFloat((num * 0.1412).toFixed(4)),
				valueEUR: parseFloat((num * 0.1279).toFixed(4)),
				valueGBP: parseFloat((num * 0.1211).toFixed(4)),
				valueJPY: parseFloat((num * 15.6507).toFixed(4)),
			})
		}
		
	},

	// 港元 --> 其它
	convertHKD: function (e) {
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueCNY: "",
				valueMOP: "",
				valueUSD: "",
				valueEUR: "",
				valueGBP: "",
				valueJPY: "",
			})
		} else {
			// 先转换成人民币
			let numCNY = parseInt(temp) * 0.9131

			this.setData({
				valueCNY: parseFloat(numCNY.toFixed(4)),
				valueMOP: parseFloat((numCNY * 1.1478).toFixed(4)),
				valueUSD: parseFloat((numCNY * 0.1412).toFixed(4)),
				valueEUR: parseFloat((numCNY * 0.1279).toFixed(4)),
				valueGBP: parseFloat((numCNY * 0.1211).toFixed(4)),
				valueJPY: parseFloat((numCNY * 15.6507).toFixed(4)),
			})
		}

	},

	// 澳门元 --> 其它
	convertMOP: function (e) {
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueCNY: "",
				valueHKD: "",
				valueUSD: "",
				valueEUR: "",
				valueGBP: "",
				valueJPY: "",
			})
		} else {
			// 先转换成人民币
			let numCNY = parseInt(temp) * 0.8712 

			this.setData({
				valueCNY: parseFloat(numCNY.toFixed(4)),
				valueHKD: parseFloat((numCNY * 1.0951).toFixed(4)),
				valueUSD: parseFloat((numCNY * 0.1412).toFixed(4)),
				valueEUR: parseFloat((numCNY * 0.1279).toFixed(4)),
				valueGBP: parseFloat((numCNY * 0.1211).toFixed(4)),
				valueJPY: parseFloat((numCNY * 15.6507).toFixed(4)),
			})
		}

	},

	// 美元 --> 其它
	convertUSD: function (e) {
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueCNY: "",
				valueHKD: "",
				valueMOP: "",
				valueEUR: "",
				valueGBP: "",
				valueJPY: "",
			})
		} else {
			// 先转换成人民币
			let numCNY = parseInt(temp) * 7.0841

			this.setData({
				valueCNY: parseFloat(numCNY.toFixed(4)),
				valueHKD: parseFloat((numCNY * 1.0951).toFixed(4)),
				valueMOP: parseFloat((numCNY * 1.1478).toFixed(4)),
				valueEUR: parseFloat((numCNY * 0.1279).toFixed(4)),
				valueGBP: parseFloat((numCNY * 0.1211).toFixed(4)),
				valueJPY: parseFloat((numCNY * 15.6507).toFixed(4)),
			})
		}

	},

	// 欧元 --> 其它
	convertEUR: function (e) {
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueCNY: "",
				valueHKD: "",
				valueMOP: "",
				valueUSD: "",
				valueGBP: "",
				valueJPY: "",
			})
		} else {
			// 先转换成人民币
			let numCNY = parseInt(temp) * 7.8215

			this.setData({
				valueCNY: parseFloat(numCNY.toFixed(4)),
				valueHKD: parseFloat((numCNY * 1.0951).toFixed(4)),
				valueMOP: parseFloat((numCNY * 1.1478).toFixed(4)),
				valueUSD: parseFloat((numCNY * 0.1412).toFixed(4)),
				valueGBP: parseFloat((numCNY * 0.1211).toFixed(4)),
				valueJPY: parseFloat((numCNY * 15.6507).toFixed(4)),
			})
		}

	},

	// 英镑 --> 其它
	convertGBP: function (e) {
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueCNY: "",
				valueHKD: "",
				valueMOP: "",
				valueUSD: "",
				valueEUR: "",
				valueJPY: "",
			})
		} else {
			// 先转换成人民币
			let numCNY = parseInt(temp) * 8.2572

			this.setData({
				valueCNY: parseFloat(numCNY.toFixed(4)),
				valueHKD: parseFloat((numCNY * 1.0951).toFixed(4)),
				valueMOP: parseFloat((numCNY * 1.1478).toFixed(4)),
				valueUSD: parseFloat((numCNY * 0.1412).toFixed(4)),
				valueEUR: parseFloat((numCNY * 0.1279).toFixed(4)),
				valueJPY: parseFloat((numCNY * 15.6507).toFixed(4)),
			})
		}

	},

	// 日元 --> 其它
	convertJPY: function (e) {
		let temp = e.detail.value
		if (temp == "") {
			this.setData({
				valueCNY: "",
				valueHKD: "",
				valueMOP: "",
				valueUSD: "",
				valueEUR: "",
				valueGBP: "",
			})
		} else {
			// 先转换成人民币
			let numCNY = parseInt(temp) * 0.0639

			this.setData({
				valueCNY: parseFloat(numCNY.toFixed(4)),
				valueHKD: parseFloat((numCNY * 1.0951).toFixed(4)),
				valueMOP: parseFloat((numCNY * 1.1478).toFixed(4)),
				valueUSD: parseFloat((numCNY * 0.1412).toFixed(4)),
				valueEUR: parseFloat((numCNY * 0.1279).toFixed(4)),
				valueGBP: parseFloat((numCNY * 0.1211).toFixed(4)),
			})
		}

	},

	// 人民币获得焦点
	focusCNY:function(){
		this.setData({
			valueCNY:"",
			valueHKD:"",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY:100,
			placeholderHKD: parseFloat((100 * 1.0951).toFixed(4)),
			placeholderMOP: parseFloat((100 * 1.1478).toFixed(4)),
			placeholderUSD: parseFloat((100 * 0.1412).toFixed(4)),
			placeholderEUR: parseFloat((100 * 0.1279).toFixed(4)),
			placeholderGBP: parseFloat((100 * 0.1211).toFixed(4)),
			placeholderJPY: parseFloat((100 * 15.6507).toFixed(4))
		})
	},

	// 港元获得焦点
	focusHKD: function () {
		// 先转换成人民币
		let money = 100 * 0.9131
		this.setData({
			valueCNY: "",
			valueHKD: "",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY: parseFloat(money.toFixed(4)),
			placeholderHKD: 100,
			placeholderMOP: parseFloat((money * 1.1478).toFixed(4)),
			placeholderUSD: parseFloat((money * 0.1412).toFixed(4)),
			placeholderEUR: parseFloat((money * 0.1279).toFixed(4)),
			placeholderGBP: parseFloat((money * 0.1211).toFixed(4)),
			placeholderJPY: parseFloat((money * 15.6507).toFixed(4))
		})
	},

	// 澳门元获得焦点
	focusMOP: function () {
		// 先转换成人民币
		let money = 100 * 0.8712
		this.setData({
			valueCNY: "",
			valueHKD: "",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY: parseFloat(money.toFixed(4)),
			placeholderHKD: parseFloat((money * 1.0951).toFixed(4)),
			placeholderMOP: 100,
			placeholderUSD: parseFloat((money * 0.1412).toFixed(4)),
			placeholderEUR: parseFloat((money * 0.1279).toFixed(4)),
			placeholderGBP: parseFloat((money * 0.1211).toFixed(4)),
			placeholderJPY: parseFloat((money * 15.6507).toFixed(4))
		})
	},

	// 美元获得焦点
	focusUSD: function () {
		// 先转换成人民币
		let money = 100 * 7.0841
		this.setData({
			valueCNY: "",
			valueHKD: "",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY: parseFloat(money.toFixed(4)),
			placeholderHKD: parseFloat((money * 1.0951).toFixed(4)),
			placeholderMOP: parseFloat((money * 1.1478).toFixed(4)),
			placeholderUSD: 100,
			placeholderEUR: parseFloat((money * 0.1279).toFixed(4)),
			placeholderGBP: parseFloat((money * 0.1211).toFixed(4)),
			placeholderJPY: parseFloat((money * 15.6507).toFixed(4))
		})
	},

	// 欧元获得焦点
	focusEUR: function () {
		// 先转换成人民币
		let money = 100 * 7.8215
		this.setData({
			valueCNY: "",
			valueHKD: "",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY: parseFloat(money.toFixed(4)),
			placeholderHKD: parseFloat((money * 1.0951).toFixed(4)),
			placeholderMOP: parseFloat((money * 1.1478).toFixed(4)),
			placeholderUSD: parseFloat((money * 0.1412).toFixed(4)),
			placeholderEUR: 100,
			placeholderGBP: parseFloat((money * 0.1211).toFixed(4)),
			placeholderJPY: parseFloat((money * 15.6507).toFixed(4))
		})
	},

	// 英镑获得焦点
	focusGBP: function () {
		// 先转换成人民币
		let money = 100 * 8.2572
		this.setData({
			valueCNY: "",
			valueHKD: "",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY: parseFloat(money.toFixed(4)),
			placeholderHKD: parseFloat((money * 1.0951).toFixed(4)),
			placeholderMOP: parseFloat((money * 1.1478).toFixed(4)),
			placeholderUSD: parseFloat((money * 0.1412).toFixed(4)),
			placeholderEUR: parseFloat((money * 0.1279).toFixed(4)),
			placeholderGBP: 100,
			placeholderJPY: parseFloat((money * 15.6507).toFixed(4))
		})
	},

	// 日元获得焦点
	focusJPY: function () {
		// 先转换成人民币
		let money = 100 * 0.0639
		this.setData({
			valueCNY: "",
			valueHKD: "",
			valueMOP: "",
			valueUSD: "",
			valueEUR: "",
			valueGBP: "",
			valueJPY: "",
			placeholderCNY: parseFloat(money.toFixed(4)),
			placeholderHKD: parseFloat((money * 1.0951).toFixed(4)),
			placeholderMOP: parseFloat((money * 1.1478).toFixed(4)),
			placeholderUSD: parseFloat((money * 0.1412).toFixed(4)),
			placeholderEUR: parseFloat((money * 0.1279).toFixed(4)),
			placeholderGBP: parseFloat((money * 0.1211).toFixed(4)),
			placeholderJPY: 100
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '汇率计算器'
		})
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