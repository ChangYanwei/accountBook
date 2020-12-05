Page({

        /**
         * 页面的初始数据
         */
        data: {

        },

        goto: function() {
                wx.openLocation({
                        latitude: this.data.latitude,
                        longitude: this.data.longitude,
                })
        },

        chooseMarker: function(e) {
                console.log("事件", e)
        },

        searchMore: function() {
                wx.chooseLocation({
                        success: res => {
                                console.log("你选择的位置", res)
                                let temp = {
                                        latitude: res.latitude,
                                        longitude: res.longitude,
                                        name: res.name,
                                        address: res.address,
                                        distance: ""
                                }
                                let nearBank = this.data.nearBank
                                nearBank.push(temp)
                                this.setData({
                                        nearBank
                                })
                                console.log("添加后：", nearBank)
                        }
                })
        },

        goHere: function(e) {
                let position = e.currentTarget.dataset
                console.log(position)
                let latitude = position.latitude
                let longitude = position.longitude
                let name = position.name
                let address = position.address
                let self_latitude = this.data.self_latitude
                let self_longitude = this.data.self_longitude
                wx.navigateTo({
                        url: './mapdetail/mapdetail?latitude=' + latitude + "&longitude=" + longitude + "&name=" + name + "&address=" + address + "&self_latitude=" + self_latitude + "&self_longitude=" + self_longitude,
                })

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                wx.showLoading({
                        title: '搜索中',
                })
                let flag = false // 数据加载出来再显示按钮
                wx.getLocation({
                        success: res => {
                                console.log(res)
                                let self_latitude = res.latitude
                                let self_longitude = res.longitude
                                this.setData({
                                        self_latitude,
                                        self_longitude
                                })
                                try {
                                        wx.request({
                                                url: 'https://apis.map.qq.com/ws/place/v1/search',
                                                data: {
                                                        keyword: encodeURI("银行"),
                                                        boundary: "nearby(" + self_latitude + "," + self_longitude + ",1000)",
                                                        key: "XHYBZ-HYZW3-VDF3D-YY2CM-W744Q-PKBDW",
                                                        page_size: "20",
                                                        orderby: "_distance"
                                                },
						timeout:10000,
                                                success: res => {
                                                        let result = res.data.data

                                                        let markers = []
                                                        let points = []
                                                        let nearBank = []
                                                        console.log(result)
                                                        for (let i = 0; i < result.length; i++) {
                                                                let temp = {
                                                                        id: result[i].id,
                                                                        latitude: result[i].location.lat,
                                                                        longitude: result[i].location.lng,
                                                                        title: result[i].title,
                                                                        iconPath: "../../../images/location.png",
                                                                        width: 30,
                                                                        height: 30
                                                                }
                                                                let temp2 = {
                                                                        latitude: result[i].location.lat,
                                                                        longitude: result[i].location.lng,
                                                                }

                                                                let temp3 = {
                                                                        latitude: result[i].location.lat,
                                                                        longitude: result[i].location.lng,
                                                                        name: result[i].title,
                                                                        address: result[i].address,
                                                                        distance: result[i]._distance
                                                                }

                                                                markers.push(temp)
                                                                points.push(temp2)
                                                                nearBank.push(temp3)
                                                        }
                                                        console.log("markers", markers)
                                                        console.log("nearBank", nearBank)
                                                        this.setData({
                                                                markers,
                                                                points,
                                                                nearBank
                                                        }, () => {
                                                                // setData中的回调函数
                                                                flag = true
                                                                this.setData({
                                                                        flag
                                                                })

                                                                wx.hideLoading()
                                                        })

                                                },
						fail:err => {
							wx.showModal({
								title: '获取失败',
								content: '请确保您的定位服务已打开，再试一次吧~',
							})
						}
                                        })
                                } catch (err) {
                                        wx.showModal({
						title: '获取失败',
						content: '请再试一次吧',
                                        })
                                }
                        },
                })
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