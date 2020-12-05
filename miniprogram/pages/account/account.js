const app = getApp()

const db = wx.cloud.database();
Page({

        /**
         * 页面的初始数据
         */
        data: {
                statusBarHeight: app.globalData.statusBarHeight,
                cards_account: [{
                                name: "花呗",
                                accountid: "XY01",
                                imgPath: "../../images/huabei.png",
                                balance: 0
                        },
                        {
                                name: "京东白条",
                                accountid: "XY02",
                                imgPath: "../../images/jdbaitiao.png",
                                balance: 0
                        },
                        {
                                name: "信用卡",
                                accountid: "XY03",
                                imgPath: "../../images/credit_card.png",
                                balance: 0
                        }
                ],
                virtual_acount: [{
                                name: "微信钱包",
                                accountid: "XN01",
                                imgPath: "../../images/wechat_wallet.png",
                                balance: 0
                        },
                        {
                                name: "支付宝",
                                accountid: "XN02",
                                imgPath: "../../images/zhifu.png",
                                balance: 0
                        },
                        {
                                name: "余额宝",
                                accountid: "XN03",
                                imgPath: "../../images/yuebao.png",
                                balance: 0
                        },
                        {
                                name: "校园卡",
                                accountid: "XN04",
                                imgPath: "../../images/school_card.png",
                                balance: 0
                        },
                        {
                                name: "QQ钱包",
                                accountid: "XN05",
                                imgPath: "../../images/qq_wallet.png",
                                balance: 0
                        },
                        {
                                name: "公交卡",
                                accountid: "XN06",
                                imgPath: "../../images/bus_card.png",
                                balance: 0
                        }
                ],
                cashAccountBalance: 0,
                bankCardAccount: 0
        },

        // 跳转到对应的账户界面
        navigateToDetail: function(e) {
                let accountid = e.currentTarget.dataset.accountid;
                wx.navigateTo({
                        url: './accountdetail?accountid=' + accountid,
                })
        },

        /**
         * 在小程序端获取所有账户的数据
        */
        async getAccountsData() {

                const MAX_LIMIT = 20
                // 先取出集合记录总数
                let countResult = await db.collection("allAccount").where({
                        _openid: app.globalData.openid
                }).count()
                let total = countResult.total

                // 计算需分几次取
                let batchTimes = Math.ceil(total / 20)
                let tasks = []
                for (let i = 0; i < batchTimes; i++) {
                        await db.collection("allAccount").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
                                .then(res => {
                                        tasks = tasks.concat(res.data)
                                        console.log('第', i, '次', res.data)
                                })

                }

                let oldDataArray = tasks
                let finalAccountData = []
                for (let i = 0; i < oldDataArray.length; i++) {
                        let tempData = {
                                recordAccount: oldDataArray[i].recordAccount,
                                recordAmount: oldDataArray[i].recordAmount
                        }
                        if (oldDataArray[i].recordAccount == "现金") {
                                finalAccountData[0] = tempData
                        } else if (oldDataArray[i].recordAccount == "花呗") {
                                finalAccountData[1] = tempData
                        } else if (oldDataArray[i].recordAccount == "京东白条") {
                                finalAccountData[2] = tempData
                        } else if (oldDataArray[i].recordAccount == "信用卡") {
                                finalAccountData[3] = tempData
                        } else if (oldDataArray[i].recordAccount == "银行卡") {
                                finalAccountData[4] = tempData
                        } else if (oldDataArray[i].recordAccount == "微信钱包") {
                                finalAccountData[5] = tempData
                        } else if (oldDataArray[i].recordAccount == "支付宝") {
                                finalAccountData[6] = tempData
                        } else if (oldDataArray[i].recordAccount == "余额宝") {
                                finalAccountData[7] = tempData
                        } else if (oldDataArray[i].recordAccount == "校园卡") {
                                finalAccountData[8] = tempData
                        } else if (oldDataArray[i].recordAccount == "QQ钱包") {
                                finalAccountData[9] = tempData
                        } else if (oldDataArray[i].recordAccount == "公交卡") {
                                finalAccountData[10] = tempData
                        }

                }
		console.log("前finalAccountData", finalAccountData)

		// if (finalAccountData.length < 11){
			let array = [
				{ "recordAccount": "现金", "recordAmount": "0" },
				{ "recordAccount": "花呗", "recordAmount": "0" },
				{ "recordAccount": "京东白条", "recordAmount": "0" },
				{ "recordAccount": "信用卡", "recordAmount": "0" },
				{ "recordAccount": "银行卡", "recordAmount": "0" },
				{ "recordAccount": "微信钱包", "recordAmount": "0" },
				{ "recordAccount": "支付宝", "recordAmount": "0" },
				{ "recordAccount": "余额宝", "recordAmount": "0" },
				{ "recordAccount": "校园卡", "recordAmount": "0" },
				{ "recordAccount": "QQ钱包", "recordAmount": "0" },
				{ "recordAccount": "公交卡", "recordAmount": "0" },

			]
			for (let i = 0; i < 11; i++){
				if(finalAccountData[i] == null){
					finalAccountData[i] = array[i]
				}
			}
		// }

                console.log("后finalAccountData", finalAccountData)
                this.getBalance(finalAccountData)

        },


        // 在getAccountsData()函数中调用，获取每一个账户的余额
        getBalance: function(data) {

                try {
                        let finalAccountData = data
                        // let array = [
			// 	{ "recordAccount": "现金", "recordAmount": "0" },
			// 	{ "recordAccount": "花呗", "recordAmount": "0" },
			// 	{ "recordAccount": "京东白条", "recordAmount": "0" },
			// 	{ "recordAccount": "信用卡", "recordAmount": "0" },
			// 	{ "recordAccount": "银行卡", "recordAmount": "0" },
			// 	{ "recordAccount": "微信钱包", "recordAmount": "0" },
			// 	{ "recordAccount": "支付宝", "recordAmount": "0" },
			// 	{ "recordAccount": "余额宝", "recordAmount": "0" },
			// 	{ "recordAccount": "校园卡", "recordAmount": "0" },
			// 	{ "recordAccount": "QQ钱包", "recordAmount": "0" },
			// 	{ "recordAccount": "公交卡", "recordAmount": "0" },
	
                        // ]
                        // console.log("前", finalAccountData)
			// let accountLength = finalAccountData.length
			// if(accountLength < 11) {
			// 	finalAccountData = finalAccountData.concat(array.slice(accountLength))
			// }

			// console.log("后", finalAccountData)
                        
                        app.globalData.cashAccountBalance = finalAccountData[0].recordAmount
                        app.globalData.huabeiAccountBalance = finalAccountData[1].recordAmount
                        app.globalData.jdAccountBalance = finalAccountData[2].recordAmount
                        app.globalData.creditCardBalance = finalAccountData[3].recordAmount
                        app.globalData.bankCardBalance = finalAccountData[4].recordAmount
                        app.globalData.wechatBalance = finalAccountData[5].recordAmount
                        app.globalData.zhifubaoBalance = finalAccountData[6].recordAmount
                        app.globalData.yuebaoBalance = finalAccountData[7].recordAmount
                        app.globalData.schoolCardBalance = finalAccountData[8].recordAmount
                        app.globalData.qqBalance = finalAccountData[9].recordAmount
                        app.globalData.busCardBalance = finalAccountData[10].recordAmount

                        let totalBalance = 0
                        // 获取所有账户的总额
                        for (let i = 0; i < finalAccountData.length; i++) {
				console.log(i, " : ", parseFloat(finalAccountData[i].recordAmount))
				totalBalance = totalBalance + parseFloat(finalAccountData[i].recordAmount)
                        }
                        app.globalData.totalBalance = totalBalance
			console.log("账户的总额", totalBalance)

                        this.setData({
                                cashAccountBalance: finalAccountData[0].recordAmount,
                                'cards_account[0].balance': finalAccountData[1].recordAmount,
                                'cards_account[1].balance': finalAccountData[2].recordAmount,
                                'cards_account[2].balance': finalAccountData[3].recordAmount,
                                bankCardAccount: finalAccountData[4].recordAmount,
                                'virtual_acount[0].balance': finalAccountData[5].recordAmount,
                                'virtual_acount[1].balance': finalAccountData[6].recordAmount,
                                'virtual_acount[2].balance': finalAccountData[7].recordAmount,
                                'virtual_acount[3].balance': finalAccountData[8].recordAmount,
                                'virtual_acount[4].balance': finalAccountData[9].recordAmount,
                                'virtual_acount[5].balance': finalAccountData[10].recordAmount
                        })
                } catch (e) {
                        console.log("失败", e)
                }
                wx.hideLoading()
        },

        onGetOpenid: function() {
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
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                wx.showLoading({
                	title: '加载中...',
                	mask: true
                })
                this.onGetOpenid()

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                // this.getBalance()
                this.getAccountsData()
        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {

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