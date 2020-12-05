const db = wx.cloud.database()
var util = require('../../../utils/util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                value: 4
        },

        onChange(event) {
                this.setData({
                        value: event.detail
                });
        },

        rateSubmit: function(e) {
                console.log(e.detail.value.rate)
                db.collection("grade").add({
                        data: {
                                grade: e.detail.value.rate,
                                rateTime: this.data.nowTime,
                                nickName: this.data.nickName,
                                avatarUrl: this.data.avatarUrl
                        }
                }).then(res => {
                        wx.showToast({
                                title: '感谢您的评价',
                        })
                }).catch(err => {
                        wx.showToast({
                                title: "失败！请重试！",
                                icon: "none"
                        })
                })

        },

        async getGrade() {
                const MAX_LIMIT = 20
                // 先取出集合记录总数
                let countResult = await db.collection("grade").count()
                let total = countResult.total

                // 计算需分几次取
                let batchTimes = Math.ceil(total / 20)
                let tasks = []
                for (let i = 0; i < batchTimes; i++) {
                        await db.collection("grade").skip(i * MAX_LIMIT).limit(MAX_LIMIT)
                                .field({
                                        grade: true
                                })
                                .get()
                                .then(res => {
                                        tasks = tasks.concat(res.data)
                                        console.log('第', i, '次', res.data)
                                })
                }
                let sum = 0
		for (let i = 0; i < total; i++) {
                        sum += tasks[i].grade
                }
		let averageGrade = (sum / total).toFixed(1)
                this.setData({
			count: total,
                        averageGrade
                },() => {
			wx.hideLoading()
		})
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
		wx.showLoading({
			title: '加载中...'
		})
                let nowTime = util.formatTime(new Date());
                this.setData({
                        nowTime
                })

                //获取评分
                this.getGrade()
                // db.collection("grade")
                //         .field({
                //                 grade: true
                //         })
                //         .get()
                //         .then(res => {
                //                 let temp = res.data
                // 		let count = temp.length
                // 		let sum = 0
                // 		for(let i = 0; i < count; i++){
                // 			sum += temp[i].grade
                // 		}
                // 		let averageGrade = (sum / count).toFixed(1)
                // 		this.setData({
                // 			count,
                // 			averageGrade
                // 		})
                //         })

                wx.getSetting({
                        success: res => {
                                if (res.authSetting['scope.userInfo']) {
                                        wx.getUserInfo({
                                                success: res => {
                                                        this.setData({
                                                                avatarUrl: res.userInfo.avatarUrl,
                                                                nickName: res.userInfo.nickName
                                                        })
                                                }
                                        })

                                }
                        }
                })


        },


})