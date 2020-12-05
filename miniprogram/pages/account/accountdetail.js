const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

        /**
         * 页面的初始数据
         */
        data: {
                showActionsheet: false,
                isBorder: false,
                groups: [{
                                text: "支出"
                        },
                        {
                                text: "收入"
                        },
                        {
                                text: "转账"
                        },
                        {
                                text: "余额"
                        }
                ],
                activeNames: [0]

        },

        // 点击actionsheet中的某一项，然后跳转到对应的“记一笔”页面
        btnClick: function(e) {
                let menuIndex = e.detail.index;
                console.log(e.detail.index)
                wx.reLaunch({
                        url: '../record/record?menuIndex=' + menuIndex
                })
                this.setData({
                        showActionsheet: false
                })
        },

        // 点击“记一笔”按钮弹出actionsheet
        actionsheet: function(e) {
                this.setData({
                        showActionsheet: true
                })
        },

        // VantUI组件的事件
        onItemChange: function(e) {
                this.setData({
                        activeNames: e.detail
                })
        },

        onItemChangeYear: function(e) {
                this.setData({
                        activeNamesYear: e.detail,
                        activeNamesMonth: [],
                        activeNamesDay: []
                })
                console.log("年", e.detail)
        },

        onItemChangeMonth: function(e) {
                this.setData({
                        activeNamesMonth: e.detail,
                        activeNamesDay: []
                })
                console.log("月", e.detail)
        },

        onItemChangeDay: function(e) {
                this.setData({
                        activeNamesDay: e.detail
                })
                console.log("日", e.detail)
        },

        // 获取集合中的记录条数，暂时无用
        getCollectionCount: function() {
                wx.cloud.callFunction({
                        name: 'getCollectionCount',
                        data: {
                                collectionName: 'cashAccount'
                        }
                }).then(res => {
                        let count = res.result.countResult.total;
                        /**
                         * 当 wx:for 的值为字符串时，会将字符串解析成字符串数组
                         * 利用该特性，让视图层的wx:for循环指定的次数
                         */
                        let tempData = ''
                        for (let i = 1; i <= count; i++) {
                                tempData += 'a'
                        }
                        console.log("tempData", tempData)
                        this.setData({
                                tempData: tempData
                        })
                })
        },

        // 获取allAccount 和 otherRecord集合中涉及现在所展示的账户的记录
        async getAllRecord() {
                let recordAccount = this.data.recordAccount

                console.log("nowShowAccount:", recordAccount)
                let nowAccountData = []
                db.collection("allAccount")
                        .where({
                                recordAccount: recordAccount
                        })
                        .get()
                        .then(res => {
                                console.log("余额记录：", res.data)
                                nowAccountData = res.data
                        })

                /**
                 * 跨字段的 “或” 操作是条件 “或”，相当于可以传入多个 where 语句，满足其中一个即可
                 */
                db.collection("otherRecord")
                        .where(
                                _.or([{
                                                recordAccount: recordAccount
                                        },
                                        {
                                                recordFromAccount: recordAccount
                                        },
                                        {
                                                recordToAccount: recordAccount
                                        }
                                ])
                        )
                        .get()
                        .then(res => {
                                console.log("其他类记录：", res.data)

                                // concat方法会返回一个新数组
                                let tempData = nowAccountData.concat(res.data)
                                this.setData({
                                        nowAccountData: tempData
                                })

                                this.getEachTime()
                        })
        },

        // 获取在当前账户中的所有记录
        async getAllAccountData() {
                const MAX_LIMIT = 20

                let recordAccount = this.data.recordAccount

                // 先取出集合记录总数
                let countResult = await db.collection("allAccount").where({
                        _openid: app.globalData.openid,
                        recordAccount: recordAccount
                }).count()
                let total = countResult.total
                console.log("total", total)

                // 计算需分几次取
                let batchTimes = Math.ceil(total / 20)

                let tasks = []
                for (let i = 0; i < batchTimes; i++) {
                        await db.collection("allAccount").where({
                                        _openid: app.globalData.openid,
                                        recordAccount: recordAccount
                                })
                                .skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
                                .then(res => {
                                        tasks = tasks.concat(res.data)
                                        console.log('第', i, '次', res.data)
                                })

                }
                this.setData({
                        nowAccountData: tasks
                })

        },

        async getOtherRecord() {
                try {
                        await this.getAllAccountData()

                        let recordAccount = this.data.recordAccount

                        const MAX_LIMIT = 20
                        // 先取出集合记录总数
                        /**
                         * 跨字段的 “或” 操作是条件 “或”，相当于可以传入多个 where 语句，
			 * 满足其中一个即可
                         */
                        let countResult = await db.collection("otherRecord")
                                .where(
                                        _.or([{
                                                        recordAccount: recordAccount
                                                },
                                                {
                                                        recordFromAccount: recordAccount
                                                },
                                                {
                                                        recordToAccount: recordAccount
                                                }
                                        ])
                                ).count()
                        let total = countResult.total

                        // 计算需分几次取
                        let batchTimes = Math.ceil(total / 20)
                        let tasks = []
                        for (let i = 0; i < batchTimes; i++) {
                                await db.collection("otherRecord")
                                        .where(
                                                _.or([{
                                                                recordAccount: recordAccount
                                                        },
                                                        {
                                                                recordFromAccount: recordAccount
                                                        },
                                                        {
                                                                recordToAccount: recordAccount
                                                        }
                                                ])
                                        )
                                        .skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
                                        .then(res => {
                                                tasks = tasks.concat(res.data)
                                                console.log('第', i, '次', res.data)
                                        })

                        }
                        console.log("数据", tasks)
                        let tempData = tasks.concat(this.data.nowAccountData)

                        this.setData({
                                nowAccountData: tempData
                        })
                        console.log("最终的nowAccountData：", this.data.nowAccountData)
                        await this.getEachTime()

                } catch (err) {

                }
        },

        // 定义数组的排序规则
        sortMonthRule: function(a, b) {
                return a.recordMonth - b.recordMonth
        },

        sortDayRule: function(a, b) {
                return a.recordDay - b.recordDay
        },

        // 遍历nowAccountData数组，取出年 月 日
        getEachTime: function() {
                let data = this.data.nowAccountData
                let yearArray = []
                let monthArray = []
                let dayArray = []
                for (let i = 0; i < data.length; i++) {
                        if (yearArray.indexOf(data[i].recordYear) == -1) {
                                yearArray.push(data[i].recordYear)
                        }

                        let tempMonthData = {
                                recordYear: data[i].recordYear,
                                recordMonth: data[i].recordMonth
                        }

                        // 先将对象数组和该对象元素转化为字符串，使用JSON.stringify()，再来判断该对象是否在该数组中
                        if (JSON.stringify(monthArray).indexOf(JSON.stringify(tempMonthData)) == -1) {
                                monthArray.push(tempMonthData)
                        }

                        let tempDayData = {
                                recordYear: data[i].recordYear,
                                recordMonth: data[i].recordMonth,
                                recordDay: data[i].recordDay
                        }

                        if (JSON.stringify(dayArray).indexOf(JSON.stringify(tempDayData)) == -1) {
                                dayArray.push(tempDayData)
                        }
                }
                yearArray.sort()
                monthArray.sort(this.sortMonthRule)
                dayArray.sort(this.sortDayRule)
                this.setData({
                        yearArray: yearArray,
                        monthArray: monthArray,
                        dayArray: dayArray
                },() => {
			wx.hideLoading()
		})

        },

        // 点击放大查看记录的图片
        viewImg: function(e) {
                wx.previewImage({
                        urls: e.currentTarget.dataset.recordimgpath
                })
        },

        /**
         *  根据用户点击的不同账户，获取不同的数据，在onload函数中调用
         */
        getNowAccountDetail: function(accountid) {
                if (accountid == 'XJ') {
                        this.setData({
                                showAccount: "cashAccount",
                                recordAccount: "现金",
                                nowAccountBalance: app.globalData.cashAccountBalance
                        })
                } else if (accountid == 'XY01') {
                        this.setData({
                                showAccount: "huabeiAccount",
                                recordAccount: "花呗",
                                nowAccountBalance: app.globalData.huabeiAccountBalance
                        })
                } else if (accountid == 'XY02') {
                        this.setData({
                                showAccount: "jdAccount",
                                recordAccount: "京东白条",
                                nowAccountBalance: app.globalData.jdAccountBalance
                        })
                } else if (accountid == 'XY03') {
                        this.setData({
                                showAccount: "creditCardAccount",
                                recordAccount: "信用卡",
                                nowAccountBalance: app.globalData.creditCardBalance
                        })
                } else if (accountid == 'bankcard') {
                        this.setData({
                                showAccount: "bankCardAccount",
                                recordAccount: "银行卡",
                                nowAccountBalance: app.globalData.bankCardBalance
                        })
                } else if (accountid == 'XN01') {
                        this.setData({
                                showAccount: "wechatWallet",
                                recordAccount: "微信钱包",
                                nowAccountBalance: app.globalData.wechatBalance
                        })
                } else if (accountid == 'XN02') {
                        this.setData({
                                showAccount: "zhifubaoAccount",
                                recordAccount: "支付宝",
                                nowAccountBalance: app.globalData.zhifubaoBalance
                        })
                } else if (accountid == 'XN03') {
                        this.setData({
                                showAccount: "yuebaoAccount",
                                recordAccount: "余额宝",
                                nowAccountBalance: app.globalData.yuebaoBalance
                        })
                } else if (accountid == 'XN04') {
                        this.setData({
                                showAccount: "schoolCardAccount",
                                recordAccount: "校园卡",
                                nowAccountBalance: app.globalData.schoolCardBalance
                        })
                } else if (accountid == 'XN05') {
                        this.setData({
                                showAccount: "qqWallet",
                                recordAccount: "QQ钱包",
                                nowAccountBalance: app.globalData.qqBalance
                        })
                } else if (accountid == 'XN06') {
                        this.setData({
                                showAccount: "busCardAccount",
                                recordAccount: "公交卡",
                                nowAccountBalance: app.globalData.busCardBalance
                        })
                }
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
		wx.showLoading({
			title: '加载中...',
		})
                let accountid = options.accountid;

                this.getNowAccountDetail(accountid);
                this.setData({
                        accountid
                })
                // this.getAllRecord()
                this.getOtherRecord()
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
		
                // 跳转到账户详情页面时动态设置页面标题
                let accountid = this.data.accountid;
                if (accountid == 'XJ') {
                        wx.setNavigationBarTitle({
                                title: '现金账户'
                        })
                } else if (accountid == 'XY01') {
                        wx.setNavigationBarTitle({
                                title: '花呗账户'
                        })
                } else if (accountid == 'XY02') {
                        wx.setNavigationBarTitle({
                                title: '京东白条'
                        })
                } else if (accountid == 'XY03') {
                        wx.setNavigationBarTitle({
                                title: '信用卡账户'
                        })
                } else if (accountid == 'bankcard') {
                        wx.setNavigationBarTitle({
                                title: '银行卡'
                        })
                } else if (accountid == 'XN01') {
                        wx.setNavigationBarTitle({
                                title: '微信钱包'
                        })
                } else if (accountid == 'XN02') {
                        wx.setNavigationBarTitle({
                                title: '支付宝'
                        })
                } else if (accountid == 'XN03') {
                        wx.setNavigationBarTitle({
                                title: '余额宝'
                        })
                } else if (accountid == 'XN04') {
                        wx.setNavigationBarTitle({
                                title: '校园卡'
                        })
                } else if (accountid == 'XN05') {
                        wx.setNavigationBarTitle({
                                title: 'QQ钱包'
                        })
                } else if (accountid == 'XN06') {
                        wx.setNavigationBarTitle({
                                title: '公交卡'
                        })
                } else {
                        wx.setNavigationBarTitle({
                                title: '云记账'
                        })
                }
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
	
	onShareAppMessage: function () {
		return {
			title: "大学生记账本",
			desc: "方便快捷的记账小程序",
			path: "/pages/welcome/welcome"
		}
	}

})