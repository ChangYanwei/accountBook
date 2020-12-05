const db = wx.cloud.database()
const app = getApp()

Page({

        /**
         * 页面的初始数据
         */
        data: {
                totalBalance: 0,
                activeNames: [0],
                activeNamesMonth: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                activeNamesDay: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']

        },

        // VantUI组件的事件
        onItemChange: function(e) {
                this.setData({
                        activeNames: e.detail
                })
        },

        onItemChangeYear: function(e) {
                this.setData({
                        activeNamesYear: e.detail
                })
                console.log("年", e.detail)
        },

        onItemChangeMonth: function(e) {
                this.setData({
                        activeNamesMonth: e.detail
                })
                console.log("月", e.detail)
        },

        onItemChangeDay: function(e) {
                this.setData({
                        activeNamesDay: e.detail
                })
                console.log("日", e.detail)
        },

        // 获取在所有account账户中的所有记录
        async getAllAccountData() {
                const MAX_LIMIT = 20
                // 先取出集合记录总数
                let countResult = await db.collection("allAccount").where({
                        _openid: app.globalData.openid
                }).count()
                let total = countResult.total
                console.log("total", total)

                // 计算需分几次取
                let batchTimes = Math.ceil(total / 20)
                console.log("batchTimes", batchTimes)
                let tasks = []
                for (let i = 0; i < batchTimes; i++) {
                        await db.collection("allAccount").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
                                .then(res => {
                                        tasks = tasks.concat(res.data)
                                        console.log('第', i, '次', res.data)
                                })

                }
                this.setData({
                        allAccountData: tasks
                })

        },

        /**
         * 获取otherRecord集合中所有的记录
         * 小程序端在获取集合数据时服务器一次默认并且最多返回 20 条记录，
         */
        async getOtherRecord() {
                try {
                        await this.getAllAccountData()

                        const MAX_LIMIT = 20
                        // 先取出集合记录总数
                        let countResult = await db.collection("otherRecord").where({
                                _openid: app.globalData.openid
                        }).count()
                        let total = countResult.total
                        console.log("total", total)

                        // 计算需分几次取
                        let batchTimes = Math.ceil(total / 20)
                        console.log("batchTimes", batchTimes)
                        let tasks = []
                        for (let i = 0; i < batchTimes; i++) {
                                await db.collection("otherRecord").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
                                        .then(res => {
                                                tasks = tasks.concat(res.data)
                                                console.log('第', i, '次', res.data)
                                        })

                        }
                        console.log("数据", tasks)
                        let tempData = tasks.concat(this.data.allAccountData)

                        this.setData({
                                allData: tempData
                        })
                        console.log("最终的allData：", this.data.allData)
                       await this.getEachTime()
		       
                } catch (err) {

                }
        },


        // 定义数组的排序规则
        sortMonthRule: function(a, b) {
                return a.recordMonth - b.recordMonth
        },

        // 定义数组的排序规则
        sortDayRule: function(a, b) {
                return a.recordDay - b.recordDay
        },

        // 遍历allData数组，取出年 月 日
        getEachTime: function() {
		let data = this.data.allData
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
                        dayArray: dayArray,
                        activeNamesYear: yearArray
                })
                console.log("yearArray", yearArray)
                console.log("monthArray", monthArray)
                console.log("dayArray", dayArray)
		wx.hideLoading()

		// if (this.data.totalBalance == 0) {
		// 	wx.showModal({
		// 		title: '提示',
		// 		content: '检测到您的账户总额为0元，请查看[账户]或记一笔余额 ',
		// 		showCancel: false,
		// 		success(res) {
		// 			if (res.confirm) {
		// 				wx.switchTab({
		// 					url: '../account/account',
		// 				})
		// 			}
		// 		}
		// 	})
		// }
		
		
        },

        // 点击放大查看记录的图片
        viewImg: function(e) {

                wx.previewImage({
                        urls: e.currentTarget.dataset.recordimgpath
                })
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                /**
                 * 仅在页面第一次加载时显示loading，之后再进入页面不显示loading，
                 * 在onShow()函数中调用getOtherRecord()方法，重新获取数据，提升小程序的使用体验
                 */
                wx.showLoading({
                        title: '拼命加载中...'
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
                this.getOtherRecord()
                // this.getTotalBalance()

                this.setData({
                        totalBalance: app.globalData.totalBalance
                })
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