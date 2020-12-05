//获取应用实例
const app = getApp()
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();

var util = require('../../utils/util.js');

import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

//获取数据库引用 
const db = wx.cloud.database();

Page({
        data: {

                recordTime: "",
                navData: ['支出', '收入', '转账', '余额', '借贷'],
                currentTab: 0,
                navScrollLeft: 0,
                windowWidth: 0,

                recordState: false,
                speakBtnType: "primary",

                index: 0,

                payAmount: '0.00',
                incomeAmount: '0.00',
                transferAmount: '0.00',
                balanceAmount: '0.00',
                borrowAmount: '0.00',

                payDate: "",
                incomeDate: "",
                borrowDate: "",
                transferDate: "",
                yueDate: "",

                remarkPayText: "...",
                remarkIncomeText: "...",
                remarkBorrowText: "请输入债权人的姓名",
                remarkTransferText: "...",
                remarkBalanceText: "...",

                remarkPayContent: "",
                remarkIncomeContent: "",
                remarkBorrowContent: "",
                remarkTransferContent: "",
                remarkBalanceContent: "",

                tempPayImgPath: [],
                // tempIncomeImgPath: "",
                // tempBorrowImgPath: "",
                // tempTransferImgPath: "",
                // tempBalanceImgPath: "",

                // 【支出】
                multiArray: [
                        ['【食】品', '【交】通', '【购】物', '【寝】室', '【娱】乐', '【学】习', '【恋】爱', '【人】情', '【通】讯', '【数】码', '【网】游', '【医】疗', '【其】他', ],
                        ['食堂三餐', '外卖', '外出吃饭', '饮料', '零食', '水果']
                ],
                payAccountArray: [
                        ['现金账户', '信用卡', '金融账户', '虚拟账户'],
                        ['现金']
                ],
                multiIndex: [0, 0],
                payAccountIndex: [0, 0],

                // 【收入】
                incomeArray: ['生活费', '兼职收入', '红包收入', '利息收入', '理财收入', '奖学金', '赞助'],
                incomeIndex: 0,
                incomeAccountArray: [
                        ['现金账户', '信用卡', '金融账户', '虚拟账户'],
                        ['现金']
                ],
                incomeAccountIndex: [0, 0],

                // 【转账】 选择两个账户
                multiTransferIndex: [0, 0],
                multiTransferArray: [
                        ['现金', '花呗', '京东白条', '信用卡', '银行卡', '微信钱包', '支付宝', '余额宝', '校园卡', 'QQ钱包', '公交卡'],
                        ['现金', '花呗', '京东白条', '信用卡', '银行卡', '微信钱包', '支付宝', '余额宝', '校园卡', 'QQ钱包', '公交卡']
                ],

                // 【余额】
                balanceIndex: [0, 0],
                balanceArray: [
                        ['现金账户', '信用卡', '金融账户', '虚拟账户'],
                        ['现金']
                ],

                // 【借贷】
                borrowIndex: [0, 0],
                borrowArray: [
                        ['现金账户', '信用卡', '金融账户', '虚拟账户'],
                        ['现金']
                ],
                borrowManArray: ['家人', '亲戚', '朋友', '同学', '陌生人', '银行'],
                borrowManIndex: 0,

                /**
                 *  **************************************************
                 *  表单提交时将picker选择器的下标改成具体的值
                 */

                payType1: "",
                payType2: "",
                payAccount: "",

                incomeType: "",
                incomeAccount: "",

                transferAccountType1: "",
                transferAccountType2: "",

                balanceAccount: "",

                borrowInAccount: "",
                borrowFormMan: "",

                /**
                 * ***************************************************
                 */

                userAccountData: 0,
                cashAccountId: "",
                fileList: [],
                realImgs: [],
		payAccountCount:0
        },

        //事件处理函数
        onLoad: function(options) {

                var nowTime = util.formatTime(new Date());
                this.setData({
                        nowTime,
                        payDate: nowTime,
                        incomeDate: nowTime,
                        transferDate: nowTime,
                        yueDate: nowTime,
                        borrowDate: nowTime
                });
                this.dateEmpty()

                this.initRecord();

                wx.setNavigationBarTitle({
                        title: '记一笔',
                })

                // 获取系统信息：宽、高
                // wx.getSystemInfo({
                //         success: (res) => {
                //                 this.setData({
                //                         windowWidth: res.windowWidth
                //                 })
                //         },
                // })

                // 从accountdetail页面跳转过来
                let menuIndex = options.menuIndex;
                this.setData({
                        /**
                         * 如果仅仅加载record页面，不是从accountdetail页面跳转过来，
                         * menuIndex是undefined。需要menuIndex一开始是0
                         */
                        currentTab: menuIndex == undefined ? 0 : menuIndex
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                // 调用云函数
                wx.cloud.callFunction({
                        name: 'login',
                        data: {},
                        success: res => {
                                console.log("记一笔页面拿到的：", res.result.openid)
                                app.globalData.openid = res.result.openid
                        },
                        fail: err => {
                                console.error('[云函数] [login] 调用失败', err)
                        }
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {

        },

        // 实现顶部导航切换
        switchNav(event) {
                var cur = event.currentTarget.dataset.current;
                //每个tab选项宽度占1/5
                var singleNavWidth = this.data.windowWidth / 5;
                //tab选项居中                            
                this.setData({
                        navScrollLeft: (cur - 2) * singleNavWidth
                })
                if (this.data.currentTab == cur) {
                        return false;
                } else {
                        this.setData({
                                currentTab: cur
                        })
                }
        },

        switchTab(event) {
                var cur = event.detail.current;
                var singleNavWidth = this.data.windowWidth / 5;
                this.setData({
                        currentTab: cur,
                        navScrollLeft: (cur - 2) * singleNavWidth
                });
        },

        //选择照片
        // chooseImg: function(event) {
        //         count: 1,
        //         wx.chooseImage({
        //                 success: res => {
        //                         const tempImgPath = res.tempFilePaths[0]
        //                         let currentTab = this.data.currentTab;

        //                         // 选择完图片就将其上传到云存储空间
        //                         wx.cloud.uploadFile({
        //                                 cloudPath: `recordImgs/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}` + tempImgPath.match(/\.[^.]+?$/)[0],
        //                                 filePath: tempImgPath
        //                         }).then(res => {
        //                                 switch (currentTab) {
        //                                         case 0:
        //                                                 this.setData({
        //                                                         tempPayImgPath: res.fileID
        //                                                 })
        //                                                 break;
        //                                         case 1:
        //                                                 this.setData({
        //                                                         tempIncomeImgPath: res.fileID
        //                                                 })
        //                                                 break;
        //                                         case 2:
        //                                                 this.setData({
        //                                                         tempTransferImgPath: res.fileID
        //                                                 })
        //                                                 break;
        //                                         case 4:
        //                                                 this.setData({
        //                                                         tempBorrowImgPath: res.fileID
        //                                                 })
        //                                                 break;
        //                                 }
        //                                 console.log(res.fileID)
        //                         }).catch(error => {
        //                                 console.log('[上传文件] 失败：error', error)
        //                         })
        //                 }

        //         })
        // },

        /**
         *  ***********************************************************
         */

        //【支出】数字输入框获取焦点
        payInputFocus: function(event) {
                console.log(event.detail.value)
                this.setData({
                        payAmount: ""
                })
        },

        //【支出】数字输入框失去焦点时判断是否有内容
        payInputBlur: function(event) {
                let num = event.detail.value;
                if (num == "") {
                        this.setData({
                                payAmount: "0.00"
                        })
                }
        },


        // 【支出】选择分类
        bindPickerChange: function(event) {
                let multiArray = this.data.multiArray;
                let multiIndex = event.detail.value;
                this.setData({
                        multiIndex: multiIndex,
                        // 提交表单时把下标改成值
                        payType1: multiArray[0][multiIndex[0]],
                        payType2: multiArray[1][multiIndex[1]]
                })
        },
        bindMultiPickerColumnChange: function(e) {
                var data = {
                        multiArray: this.data.multiArray,
                        multiIndex: this.data.multiIndex
                }
                data.multiIndex[e.detail.column] = e.detail.value
                switch (data.multiIndex[0]) {
                        case 0:
                                data.multiArray[1] = ['食堂三餐', '外卖', '外出吃饭', '饮料', '零食', '水果']
                                break;
                        case 1:
                                data.multiArray[1] = ['公共交通', '打出租车', '自行车', '火车', '高铁', '飞机']
                                break;
                        case 2:
                                data.multiArray[1] = ['日用品', '衣服裤子', '化妆饰品', '鞋帽包包', '运动装备', '剁手']
                                break;
                        case 3:
                                data.multiArray[1] = ['房租', '电费', '水费', '洗澡沐浴', '洗衣服']
                                break;
                        case 4:
                                data.multiArray[1] = ['聚会吃饭', '电影', 'KTV', '休闲玩乐', '运动健身', '旅游度假', "社团费用", "宠物宝贝"]
                                break;
                        case 5:
                                data.multiArray[1] = ['文具', '打印复印', '班费', '教材资料', '学杂费', '培训进修', '书报杂志', '考试报名']
                                break;
                        case 6:
                                data.multiArray[1] = ['一起吃饭', '一起看电影', '一起旅游', '红包', '送礼物']
                                break;
                        case 7:
                                data.multiArray[1] = ['送礼请客', '孝敬家长', '慈善捐助', '礼金红包', ]
                                break;
                        case 8:
                                data.multiArray[1] = ['手机话费', '上网费', '邮寄费']
                                break;
                        case 9:
                                data.multiArray[1] = ['数码配件', '智能手机', '电脑平板', '手表', '相机']
                                break;
                        case 10:
                                data.multiArray[1] = ['视频会员', 'QQ专区', '网游充值']
                                break;
                        case 11:
                                data.multiArray[1] = ['药品费', '治疗费', '门诊费']
                                break;
                        case 12:
                                data.multiArray[1] = ['其他支出', '意外丢失']
                                break;
                }
                this.setData(data);
        },

        //【支出】支出账户
        bindPayAccountChange: function(event) {
                let payAccountArray = this.data.payAccountArray;
                let payAccountIndex = event.detail.value;
                this.setData({
                        payAccountIndex: payAccountIndex,
                        payAccount: payAccountArray[1][payAccountIndex[1]]
                })
        },
        bindPayAccountColumnChange: function(e) {
                var data = {
                        payAccountArray: this.data.payAccountArray,
                        payAccountIndex: this.data.payAccountIndex
                }
                data.payAccountIndex[e.detail.column] = e.detail.value
                switch (data.payAccountIndex[0]) {
                        case 0:
                                data.payAccountArray[1] = ['现金']
                                break;
                        case 1:
                                data.payAccountArray[1] = ['花呗', '京东白条', '信用卡']
                                break;
                        case 2:
                                data.payAccountArray[1] = ['银行卡']
                                break;
                        case 3:
                                data.payAccountArray[1] = ['微信钱包', '支付宝', '余额宝', '校园卡', 'QQ钱包', '公交卡']
                                break;
                }
                this.setData(data);
        },

        //选择支出日期
        bindPayDateChange: function(event) {
                wx.cloud.callFunction({
                        name: "getdate",
                        data: {
                                dateTime: event.detail.value
                        }
                }).then(res => {
                        this.setData({
                                payDate: event.detail.value,
                                recordYear: res.result.recordYear,
                                recordMonth: res.result.recordMonth,
                                recordDay: res.result.recordDay
                        })
                })

        },

        // 如果用户没有点击日期选择框
        dateEmpty: function() {
                wx.showLoading({
                        title: '加载中',
                })
                let nowTime = this.data.nowTime;
                console.log("nowTime", nowTime)
                wx.cloud.callFunction({
                        name: "getdate",
                        data: {
                                dateTime: nowTime
                        }
                }).then(res => {
                        console.log(res.result)
                        this.setData({
                                recordYear: res.result.recordYear,
                                recordMonth: res.result.recordMonth,
                                recordDay: res.result.recordDay
                        })
                })
                wx.hideLoading()

        },

        //备注获取焦点
        remarkFocus: function(event) {
                let text = event.detail.value;
                let currentTab = this.data.currentTab;
                switch (currentTab) {
                        case 0:
                                this.setData({
                                        remarkPayText: ""
                                })
                                break;
                        case 1:
                                this.setData({
                                        remarkIncomeText: ""
                                })
                                break;
                        case 2:
                                this.setData({
                                        remarkTransferText: ""
                                })
                                break;
                        case 3:
                                this.setData({
                                        remarkBalanceText: ""
                                })
                                break;
                        case 4:
                                if (text == "") {
                                        this.setData({
                                                remarkBorrowText: ""
                                        })
                                }
                                break;
                }

        },

        //备注失去焦点
        remarkBlur: function(event) {
                let text = event.detail.value;
                let currentTab = this.data.currentTab;
                switch (currentTab) {
                        case 0:
                                if (text == "") {
                                        this.setData({
                                                remarkPayText: "..."
                                        })
                                }
                                break;
                        case 1:
                                if (text == "") {
                                        this.setData({
                                                remarkIncomeText: "..."
                                        })
                                }
                                break;
                        case 2:
                                if (text == "") {
                                        this.setData({
                                                remarkTransferText: "..."
                                        })
                                }
                                break;
                        case 3:
                                if (text == "") {
                                        this.setData({
                                                remarkBalanceText: "..."
                                        })
                                }
                                break;
                        case 4:
                                if (text == "") {
                                        this.setData({
                                                remarkBorrowText: "..."
                                        })
                                }
                                break;
                }

        },

        //选择照片
        async afterRead(e) {
                let fileList = this.data.fileList;
                let realImgs = this.data.realImgs

                fileList.push(e.detail.file)

                let tempImgPath = e.detail.file.path
                await wx.cloud.uploadFile({
                        cloudPath: `recordImgs/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}` + tempImgPath.match(/\.[^.]+?$/)[0],
                        filePath: tempImgPath
                }).then(res => {
                        console.log(res.fileID)
                        realImgs.push(res.fileID)
                })

                this.setData({
                        fileList,
                        realImgs
                })
        },

        //删除选择的某张照片
        deleteImg: function(e) {
                console.log(e.detail.index)
                let index = e.detail.index

                let fileList = this.data.fileList;
                let realImgs = this.data.realImgs;

                fileList.splice(index, 1)
                realImgs.splice(index, 1)

                this.setData({
                        fileList,
                        realImgs
                })
        },

        /**
         * 支出表单提交时调用
         * 判断账单的类型，不同类型，上传不同的图标，最后在页面上显示不同的图标
         */
        uploadPayIcon: function(billType) {
                let recordIcon = ''
                if (billType == "食堂三餐") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/dormFood.png?sign=00d45331f91a37ea38caeb06627a51c9&t=1585204700"
                } else if (billType == "外卖") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/takeout.png?sign=469a9bf0df8a4bb07696580a77a1d92f&t=1585204765"
                } else if (billType == "外出吃饭") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/eatOut.png?sign=665a7e6e2538df49df1a53190aa0a533&t=1585204792"
                } else if (billType == "饮料") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/drinks.png?sign=bad1249a7b198fc9d6a4fa752589ee90&t=1585204821"
                } else if (billType == "零食") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/snacks.png?sign=1f29093a0798161204b15f980dd16348&t=1585204846"
                } else if (billType == "水果") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/fruits.png?sign=a2e0799b889d8d7926066c5f431f3012&t=1585204869"
                } else if (billType == "公共交通") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/bus.png?sign=e9e16db2834d73a6669825ae7b0c8364&t=1585204887"
                } else if (billType == "打出租车") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/taxi.png?sign=da3006cfaae227e2f5917e669290ebc1&t=1585204906"
                } else if (billType == "自行车") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/bicycle.png?sign=ba719edd25783bb5089a4a325ab61be0&t=1585204931"
                } else if (billType == "火车") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/train.png?sign=1d038540635541de8845fe774af63a45&t=1585204950"
                } else if (billType == "高铁") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/g_train.png?sign=3c7b763d647fbcecef4dc6f0cd83efb7&t=1585204967"
                } else if (billType == "飞机") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/airplane.png?sign=e5dc37454f721a3c682faeb23f501dbf&t=1585204985"
                } else if (billType == "日用品") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/dailyUse.png?sign=905abb30dfcc4a0404d495accde66699&t=1585205003"
                } else if (billType == "衣服裤子") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/clothes.png?sign=87a782af7f5c85528356a03d3fd4fcc1&t=1585205021"
                } else if (billType == "化妆饰品") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/cosmetics.png?sign=352104c9032bcb479e6733fca03e4122&t=1585205042"
                } else if (billType == "鞋帽包包") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/handbag.png?sign=539887b83c55ea2b2fbbe4deaaa65b9d&t=1585205060"
                } else if (billType == "运动装备") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/sport.png?sign=6a99126282e00165a47360f0f8eb29c6&t=1585205077"
                } else if (billType == "剁手") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/tao.png?sign=95b82e4699c1be46d8ac75b046fddf60&t=1585205094"
                } else if (billType == "房租") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/rent.png?sign=2a1880c09e10dfbdf240bbc33196c044&t=1585205110"
                } else if (billType == "电费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/electricCharge.png?sign=200690f3db51a0badcceb6c067b9a1ed&t=1585205134"
                } else if (billType == "水费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/waterCharge.png?sign=f7118476a47822b39da7ad56cb87736c&t=1585205156"
                } else if (billType == "洗澡沐浴") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/takeBath.png?sign=e0cf8b1dd763b8e47fe9cfdc6e16ed3e&t=1585205176"
                } else if (billType == "洗衣服") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/washClothes.png?sign=1d0ceb4d5f4caa6639620b48a877e8cf&t=1585205190"
                } else if (billType == "聚会吃饭") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/dineTogether.png?sign=8630bb17c5f39f5eb726f3b09ae5b714&t=1585205216"
                } else if (billType == "电影") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/cinema.png?sign=4ca70a9fd7d00cd6817717250208cd44&t=1585205228"
                } else if (billType == "KTV") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/KTV.png?sign=a5e6c6d681aa6da74185a119a23babfb&t=1585205275"
                } else if (billType == "休闲玩乐") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/entertainment.png?sign=faae1a4692f684c3da5efe0ff4a3b480&t=1585205300"
                } else if (billType == "运动健身") {
                        recordIcon = "cloud://xly-tfjyo.786c-xly-tfjyo-1300271371/recordIcons/fitness.png"
                } else if (billType == "旅游度假") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/travel.png?sign=625bdfbb2c06feea7024cc35ce71bd47&t=1585205384"
                } else if (billType == "社团费用") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/club.png?sign=20d282b258a2c0d5c2dd8a391433c7e4&t=1585205402"
                } else if (billType == "宠物宝贝") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/pet.png?sign=fd7e065ce73473426615632c128c1c8a&t=1585205416"
                } else if (billType == "文具") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/stationery.png?sign=e6db9788673d0f51e7e771714d5d3a81&t=1585205437"
                } else if (billType == "打印复印") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/print.png?sign=4fadcd96cc061df76acbc3c44a59838b&t=1585205460"
                } else if (billType == "班费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/classFee.png?sign=81d783a91b5857794fb13e912b9c01e2&t=1585205488"
                } else if (billType == "教材资料") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/textbook.png?sign=c80eafbe81355e36647d8f36c35468a5&t=1585205507"
                } else if (billType == "学杂费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/tuitionAndFees.png?sign=d0628555eb8856d2c6ed401017e7610d&t=1585205530"
                } else if (billType == "培训进修") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/trainingFee.png?sign=4f8e26fb8a907c7cc2561883ba944e5c&t=1585205546"
                } else if (billType == "书包杂志") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/magazine.png?sign=1dda722b1f8f4624f9c2144e6841742a&t=1585205568"
                } else if (billType == "考试报名") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/exam.png?sign=d45c19b34a0f861e982dee2292793e55&t=1585205584"
                } else if (billType == "一起吃饭") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/coupleDinner.png?sign=4000fcd13912e35831f2d43c9db88e72&t=1585205622"
                } else if (billType == "一起看电影") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/coupleMovie.png?sign=11bea76c7cd62ea030662e8a373461f4&t=1585205634"
                } else if (billType == "一起旅游") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/coupleTravel.png?sign=e3de9793c8b112d6926920d49426c582&t=1585205647"
                } else if (billType == "红包" || billType == "礼金红包") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/redPacket.png?sign=5de4bc00f7be50ce46fc236acd13edf4&t=1585205664g"
                } else if (billType == "送礼物") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/present.png?sign=d35a9367ee6dface2ae4ed60cd4a4df2&t=1585205675"
                } else if (billType == "慈善捐助") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/charity.png?sign=dac9ae689c29f148846d23eeaa2c2225&t=1585205691"
                } else if (billType == "孝敬家长") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/respectToParents.png?sign=f2bf43e4db1c7d4662494f69b19834c5&t=1585205708"
                } else if (billType == "送礼请客") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/cashGift.png?sign=881ac4e9173755c4dafa5c1f9354e172&t=1585205734"
                } else if (billType == "手机话费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/telephoneBill.png?sign=c5f51c219dd3adb24a329c01e396b1b8&t=1585205758"
                } else if (billType == "上网费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/InternetFee.png?sign=ac1ae00e354cffe65305992125933c0a&t=1585205780"
                } else if (billType == "邮寄费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/postage.png?sign=78e0e741a08fccdcb66b214cfbbec39f&t=1585205813"
                } else if (billType == "数码配件") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/parts.png?sign=5ea5037f94ffc8766a8ae3f917ed99a8&t=1585205825"
                } else if (billType == "智能手机") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/mobilePhone.png?sign=00133e240372c7b5f89d9178359db5a0&t=1585205838"
                } else if (billType == "平板电脑") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/computer.png?sign=eee210ed6959e09ff479bd52e5b2f92c&t=1585205851"
                } else if (billType == "手表") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/watches.png?sign=5df2f7f9b3840f15780e85fdf033bc91&t=1585205876"
                } else if (billType == "相机") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/camera.png?sign=ddec969f08491c864ede568724da21ab&t=1585205893"
                } else if (billType == "视频会员") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/videoMembership.png?sign=ce104f8c62fbecdc8179c005c0848042&t=1585205958"
                } else if (billType == "QQ专区") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/QQ.png?sign=8c0ce9f44e65e6a0e670f084c5d06b6a&t=1585205976"
                } else if (billType == "网游充值") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/onlineGame.png?sign=af906707fc999206b3a490a8d19acd83&t=1585205993"
                } else if (billType == "药品费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/medicine.png?sign=cedb7da8d5dd0342c59a962c3dc8559d&t=1585206009"
                } else if (billType == "治疗费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/treat.png?sign=ce0b8059c1f7b59bc4fda9640c219a30&t=1585206030"
                } else if (billType == "门诊费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/outpatientService.png?sign=d0d843dc078ae2632a9b93d8aab4cb2b&t=1585206049"
                } else if (billType == "其他支出") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/other.png?sign=d81d7000c08107916ee43921aeeea77c&t=1585206058"
                } else if (billType == "意外丢失") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/lost.png?sign=97d91c7aca689f0ea6b14335e59ce906&t=1585206070"
                }

                this.setData({
                        recordIcon
                })
        },

        /**
         * 支出表单提交时调用
         * 判断具体是哪个账户，表单提交时更新该账户的余额
         */
        async updatePayBalance(payAccount, payAmount) {

                let count = 0
                await db.collection("allAccount")
                        .where({
                                recordAccount: payAccount
                        }).count().then(res => {
                                count = res.total
                        })

                // 更新账户总额
                app.globalData.totalBalance -= parseInt(payAmount)

                console.log("count", count)
                this.setData({
                        payAccountCount: count
                })

                //账户有记录就更新余额，没有记录不更新
                if (count > 0) {
                        this.setData({
                                isSuccess: true
                        })
                        if (payAccount == "现金") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							
                                                        recordAmount: parseFloat(app.globalData.cashAccountBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "花呗") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.huabeiAccountBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "京东白条") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.jdAccountBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "信用卡") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.creditCardBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "银行卡") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.bankCardBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "微信钱包") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.wechatBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "支付宝") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.zhifubaoBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "余额宝") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.yuebaoBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "校园卡") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.schoolCardBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "QQ钱包") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.qqBalance) - parseFloat(payAmount)
                                                }
                                        })
                        } else if (payAccount == "公交卡") {
                                db.collection("allAccount")
                                        .where({
                                                recordAccount: payAccount,
                                                recordNum: count
                                        })
                                        .update({
                                                data: {
							recordAmount: parseFloat(app.globalData.busCardBalance) - parseFloat(payAmount)
                                                }
                                        })
                        }
                } else {
                        wx.showModal({
                                title: '温馨提示',
                                content: '先挣钱再花钱哦~请先在' + payAccount + '账户中记一笔收入或余额',
                                showCancel: false
                        })
                        this.setData({
                                payInputValue: "",
                                payAmount: "0.00",
                                remarkPayText: "...",
                                remarkPayContent: "",
                                fileList: [],
                                realImgs: [],
                                isSuccess: false
                        })
                }
        },

        // 支出表单提交
        async payFormSubmit(e) {

                console.log('支出表单发生了submit事件，携带数据为：', e.detail.value)
                let formData = e.detail.value;

                // 判断用户是否选择了日期
                let payDate = this.data.nowTime;
                if (formData.payTime != "") {
                        payDate = formData.payTime
                }

                // 判断用户是否选择了“分类”
                let payType1 = "【食】品";
                let payType2 = "食堂三餐";
                if (this.data.payType1 != "") {
                        payType1 = this.data.payType1
                        payType2 = this.data.payType2
                }
                // 上传图片
                this.uploadPayIcon(payType2);

                // 判断用户是否选择了账户
                let recordAccount = "现金";
                if (this.data.payAccount != "") {
                        recordAccount = this.data.payAccount
                }
                console.log("支出recordAccount：", recordAccount)

                // 更新账户余额
                let payAmount = formData.payAmount
                if (payAmount == "") {
                        Notify({
                                type: 'primary',
                                message: '请填入金额',
                                selector: '#pay-notify',
                                duration: 1500
                        });
                } else {
                        await this.updatePayBalance(recordAccount, payAmount);

			if (this.data.payAccountCount > 0){
				db.collection("otherRecord").add({
					data: {
						recordAmount: "-" + formData.payAmount,
						payType: payType1,
						billType: payType2,
						recordAccount: recordAccount,
						recordTime: payDate,
						recordRemark: formData.payRemark,
						recordImg: this.data.realImgs,
						recordIcon: this.data.recordIcon,
						recordYear: this.data.recordYear,
						recordMonth: this.data.recordMonth,
						recordDay: this.data.recordDay
					}
				}).then(res => {
					wx.showToast({
						title: '成功',
						icon: 'success',
						success: res => {
							this.setData({
								payInputValue: "",
								payAmount: "0.00",
								remarkPayText: "...",
								remarkPayContent: "",
								fileList: [],
								realImgs: []
							})
						}
                                        })
                                        wx.switchTab({
                                                url: "../account/account"
                                        })
				}).catch(err => {
					wx.showToast({
						title: "失败！请重试！",
						icon: "none"
					})
				})
			}
                }
        },


        /**
         *  ***********************************************************
         */

        // 声音转文字
        //识别语音 -- 初始化
        initRecord: function() {
                const that = this;
                // 有新的识别内容返回，则会调用此事件
                manager.onRecognize = function(res) {
                        console.log(res)
                }
                // 正常开始录音识别时会调用此事件
                manager.onStart = function(res) {
                        console.log("成功开始录音识别", res)
                }
                // 识别错误事件
                manager.onError = function(res) {
                        console.error("error msg", res)
                }
                //识别结束事件
                manager.onStop = function(res) {
                        console.log('..............结束录音')
                        console.log('录音临时文件地址 -->' + res.tempFilePath);
                        console.log('录音总时长 -->' + res.duration + 'ms');
                        console.log('文件大小 --> ' + res.fileSize + 'B');
                        console.log('语音内容 --> ' + res.result);
                        if (res.result == '') {
                                wx.showModal({
                                        title: '提示',
                                        content: '听不清楚，请重新说一遍！',
                                        showCancel: false,
                                        success: function(res) {}
                                })
                                return;
                        }
                        var text = res.result;
                        var currentTab = that.data.currentTab;
                        switch (currentTab) {
                                case 0:
                                        var exitText = that.data.remarkPayContent;
                                        that.setData({
                                                remarkPayContent: exitText + text
                                        })
                                        break;
                                case 1:
                                        var exitText = that.data.remarkIncomeContent;
                                        that.setData({
                                                remarkIncomeContent: exitText + text
                                        })
                                        break;
                                case 2:
                                        var exitText = that.data.remarkBorrowContent;
                                        that.setData({
                                                remarkTransferContent: exitText + text
                                        })
                                        break;
                                case 3:
                                        var exitText = that.data.remarkTransferContent;
                                        that.setData({
                                                remarkBalanceContent: exitText + text
                                        })
                                        break;
                                case 4:
                                        var exitText = that.data.remarkBalanceContent;
                                        that.setData({
                                                remarkBorrowContent: exitText + text
                                        })
                                        break;
                        }



                }
        },

        //语音  --按住说话
        touchStart: function(e) {
                this.setData({
                        recordState: true, //录音状态
                        speakBtnType: "warn"
                })
                // 语音开始识别
                manager.start({
                        lang: 'zh_CN', // 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
                })
        },
        //语音  --松开结束
        touchEnd: function(e) {
                this.setData({
                        recordState: false,
                        speakBtnType: "primary"
                })
                // 语音结束识别
                manager.stop();
        },

        /**
         *  ***********************************************************
         */

        //【收入】数字输入框获取焦点
        incomeInputFocus: function(event) {
                this.setData({
                        incomeAmount: ""
                })
        },

        //【收入】数字输入框失去焦点时判断是否有内容
        incomeInputBlur: function(event) {
                let num = event.detail.value;
                if (num == "") {
                        this.setData({
                                incomeAmount: "0.00"
                        })
                }
        },

        //选择【收入】类型
        bindIncomePickerChange: function(event) {
                let incomeArray = this.data.incomeArray;
                let incomeIndex = event.detail.value;
                this.setData({
                        incomeIndex: incomeIndex,
                        // 提交表单时把下标改成值
                        incomeType: incomeArray[incomeIndex]
                })
        },

        //【收入】收入账户
        bindIncomeAccountChange: function(event) {
                let incomeAccountArray = this.data.incomeAccountArray;
                let incomeAccountIndex = event.detail.value;
                this.setData({
                        incomeAccountIndex: incomeAccountIndex,
                        incomeAccount: incomeAccountArray[1][incomeAccountIndex[1]]
                })
        },
        bindIncomeAccountColumnChange: function(e) {
                var data = {
                        incomeAccountArray: this.data.incomeAccountArray,
                        incomeAccountIndex: this.data.incomeAccountIndex
                }
                data.incomeAccountIndex[e.detail.column] = e.detail.value
                switch (data.incomeAccountIndex[0]) {
                        case 0:
                                data.incomeAccountArray[1] = ['现金']
                                break;
                        case 1:
                                data.incomeAccountArray[1] = ['花呗', '京东白条', '信用卡']
                                break;
                        case 2:
                                data.incomeAccountArray[1] = ['银行卡']
                                break;
                        case 3:
                                data.incomeAccountArray[1] = ['微信钱包', '支付宝', '余额宝', '校园卡', 'QQ钱包', '公交卡']
                                break;
                }
                this.setData(data);
        },

        //选择收入日期，获取该日期中的年 月 日
        bindIncomeDateChange: function(event) {
                wx.cloud.callFunction({
                        name: "getdate",
                        data: {
                                dateTime: event.detail.value
                        }
                }).then(res => {
                        console.log(res)
                        this.setData({
                                incomeDate: event.detail.value,
                                recordYear: res.result.recordYear,
                                recordMonth: res.result.recordMonth,
                                recordDay: res.result.recordDay
                        })
                })
        },

        /**
         * 收入表单提交时调用
         * 判断账单的类型，不同类型，上传不同的图标，最后在页面上显示不同的图标
         */
        uploadIncomeIcon: function(billType) {
                let recordIcon = ''
                if (billType == "生活费") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/livingCost.png?sign=de7a13e5c66047d051dc2e8a1194dd90&t=1585206120"
                } else if (billType == "兼职收入") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/part-time-job.png?sign=ce9de9169ffa843deee5a717379a20b5&t=1585206143"
                } else if (billType == "红包收入") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/redPacket.png?sign=267abe6325edc4b359ebc01f95d444b0&t=1585206162"
                } else if (billType == "利息收入") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/interest.png?sign=d76fc1f2bd66f2ef9497fd968602b19e&t=1585206175"
                } else if (billType == "理财收入") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/moneyManage.png?sign=dfa7112821008f3227470ba7dbef393a&t=1585206187"
                } else if (billType == "奖学金") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/scholarship.png?sign=922fd44a503b879123eafe16ae252355&t=1585206205"
                } else if (billType == "赞助") {
                        recordIcon = "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/sponsor.png?sign=ba39bc0f28836b86eb32eb672abe1298&t=1585206217"
                }

                this.setData({
                        recordIcon
                })
        },

        /**
         * 收入表单提交时调用
         * 判断具体是哪个账户，表单提交时更新该账户的余额
         */
        async updateIncomeBalance(recordAccount, recordAmount, billType, incomeRemark, incomeDate) {
                let count = 0
                await db.collection("allAccount")
                        .where({
                                recordAccount: recordAccount
                        }).count().then(res => {
                                count = res.total
                        })
                console.log("count", count)
                app.globalData.totalBalance += parseInt(recordAmount)

                this.setData({
                        incomeAccountCount: count
                })

                //如果没有该账户的记录就增加一条
                if (count == 0) {
                        db.collection("allAccount").add({
                                data: {
                                        recordAmount: recordAmount,
                                        recordIncomeAmount: parseInt(recordAmount),
                                        recordNum: 1,
                                        billType: billType,
                                        recordAccount: recordAccount,
                                        recordRemark: incomeRemark,
                                        recordTime: incomeDate,
                                        recordImg: this.data.incomeRealImgs,
                                        recordIcon: "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/income.png?sign=9a327f769f2d2cb97fcdb380ff3b5215&t=1588780234",
                                        recordYear: this.data.recordYear,
                                        recordMonth: this.data.recordMonth,
                                        recordDay: this.data.recordDay
                                }
                        }).then(res => {
                                wx.showToast({
                                        title: '成功'
                                })
                                
                        })
                }
                //如果该账户的有记录，就只更新余额
                if (recordAccount == "现金") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.cashAccountBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "花呗") {

                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.huabeiAccountBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "京东白条") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.jdAccountBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "信用卡") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.creditCardBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "银行卡") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.bankCardBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "微信钱包") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.wechatBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "支付宝") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.zhifubaoBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "余额宝") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.yuebaoBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "校园卡") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.schoolCardBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "QQ钱包") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.qqBalance) + parseFloat(recordAmount)
                                        }
                                })
                } else if (recordAccount == "公交卡") {
                        db.collection("allAccount")
                                .where({
                                        recordAccount: recordAccount,
                                        recordNum: count
                                })
                                .update({
                                        data: {
						recordAmount: parseFloat(app.globalData.busCardBalance) + parseFloat(recordAmount)
                                        }
                                })
                }


        },

        // 收入表单提交
        incomeFormSubmit: function(e) {
                console.log('收入表单发生了submit事件，携带数据为：', e.detail.value)
                let formData = e.detail.value;

                // 判断用户是否选择了日期
                let incomeDate = this.data.nowTime;
                if (formData.incomeTime != "") {
                        incomeDate = formData.incomeTime
                }

                // 判断用户是否选择了“分类”
                let billType = "生活费";
                if (this.data.incomeType != "") {
                        billType = this.data.incomeType
                }
                console.log("收入billType：", billType)

                // 上传图片
                this.uploadIncomeIcon(billType)

                // 判断用户是否选择了账户
                let recordAccount = "现金";
                if (this.data.incomeAccount != "") {
                        recordAccount = this.data.incomeAccount
                }
                console.log("收入recordAccount：", recordAccount)

                let recordAmount = formData.incomeAmount
                if (recordAmount == "") {
                        Notify({
                                type: 'primary',
                                message: '请填入金额',
                                selector: '#income-notify',
                                duration: 1500
                        });
                } else {
                        // 更新账户余额
                        this.updateIncomeBalance(recordAccount, recordAmount, "余额变更", formData.incomeRemark, incomeDate)

			db.collection("otherRecord").add({
				data: {
					recordAmount: "+" + formData.incomeAmount,
					recordIncomeAmount: parseInt(formData.incomeAmount),
					billType: billType,
					recordAccount,
					recordRemark: formData.incomeRemark,
					recordTime: incomeDate,
					recordImg: this.data.realImgs,
					recordIcon: this.data.recordIcon,
					recordYear: this.data.recordYear,
					recordMonth: this.data.recordMonth,
					recordDay: this.data.recordDay
				}
			}).then(res => {
				wx.showToast({
					title: '成功',
					icon: 'success',
					success: res => {
						this.setData({
							incomeInputValue: "",
							incomeAmount: "0.00",
							remarkIncomeText: "...",
							remarkIncomeContent: "",
							fileList: [],
							realImgs: []
						})
                                        }
                                
                                })
                                wx.switchTab({
                                        url: "../account/account"
                                })
			}).catch(err => {
				wx.showToast({
					title: "失败！请重试！",
					icon: "none"
				})
			})
                        
                }
        },

        /**
         *  ***********************************************************
         */

        //【转账】数字输入框获取焦点
        transferInputFocus: function(event) {
                this.setData({
                        transferAmount: ""
                })
        },

        //【转账】数字输入框失去焦点时判断是否有内容
        transferInputBlur: function(event) {
                let num = event.detail.value;
                if (num == "") {
                        this.setData({
                                transferAmount: "0.00"
                        })
                }
        },

        //【转账】选择两个账户
        bindTransferPickerChange: function(event) {
                let multiTransferArray = this.data.multiTransferArray;
                let multiTransferIndex = event.detail.value;
                this.setData({
                        multiTransferIndex: multiTransferIndex,
                        // 提交表单时把下标改成值
                        transferAccountType1: multiTransferArray[0][multiTransferIndex[0]],
                        transferAccountType2: multiTransferArray[1][multiTransferIndex[1]]
                })
        },

        //选择转账日期
        bindTransferDateChange: function(event) {
                wx.cloud.callFunction({
                        name: "getdate",
                        data: {
                                dateTime: event.detail.value
                        }
                }).then(res => {
                        console.log(res)
                        this.setData({
                                transferDate: event.detail.value,
                                recordYear: res.result.recordYear,
                                recordMonth: res.result.recordMonth,
                                recordDay: res.result.recordDay
                        })
                })
        },

        // 转账表单提交
        async transferFormSubmit(e) {
                console.log('转账form发生了submit事件，携带数据为：', e.detail.value)
                let formData = e.detail.value;

                // 判断用户是否选择了日期
                let transferDate = this.data.nowTime;
                if (formData.transferTime != "") {
                        transferDate = formData.transferTime
                }

                // 判断用户是否选择了“账户”
                let recordFromAccount = "现金"; // 初始值
                let recordToAccount = "现金";
                if (this.data.transferAccountType1 != "") {
                        recordFromAccount = this.data.transferAccountType1
                        recordToAccount = this.data.transferAccountType2
                }
                console.log("recordFromAccount", recordFromAccount)
                console.log("recordToAccount", recordToAccount)

                let recordAmount = formData.transferAmount
                if (recordAmount == "") {
                        Notify({
                                type: 'primary',
                                message: '请填入金额',
                                selector: '#transfer-notify',
                                duration: 1500
                        });
		} else {
                        // 调用函数更新账户中的余额
                        await this.updatePayBalance(recordFromAccount, recordAmount)
                        if (this.data.payAccountCount > 0 && this.data.isSuccess == true) {
                                this.updateIncomeBalance(recordToAccount, recordAmount, "余额变更", formData.transferRemark, transferDate)

				db.collection("otherRecord").add({
					data: {
						billType: "转账",
						recordAmount: formData.transferAmount,
						recordFromAccount: recordFromAccount,
						recordToAccount: recordToAccount,
						recordTime: transferDate,
						recordRemark: formData.transferRemark,
						recordImg: this.data.realImgs,
						recordIcon: "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/transfer.png?sign=38c21c00a07f04206a40d89a074c3129&t=1585206265",
						recordYear: this.data.recordYear,
						recordMonth: this.data.recordMonth,
						recordDay: this.data.recordDay
					}
				}).then(res => {
					wx.showToast({
						title: '成功',
						icon: 'success',
						success: res => {
							this.setData({
								transferInputValue: "",
								transferAmount: "0.00",
								remarkTransferText: "...",
								remarkTransferContent: "",
								fileList: [],
								realImgs: []
							})
						}
                                        })
                                        wx.switchTab({
                                                url: "../account/account"
                                        })
				}).catch(err => {
					wx.showToast({
						title: "失败！请重试！",
						icon: "none"
					})
				})
			
                        }
                }
        },

        /**
         *  ***********************************************************
         */

        //【余额】数字输入框获取焦点
        balanceInputFocus: function(event) {
                this.setData({
                        balanceAmount: ""
                })
        },

        //【余额】数字输入框失去焦点时判断是否有内容
        balanceInputBlur: function(event) {
                let num = event.detail.value;
                if (num == "") {
                        this.setData({
                                balanceAmount: "0.00"
                        })
                }
        },

        //【余额】选择账户
        bindBalancePickerChange: function(event) {
                let balanceArray = this.data.balanceArray;
                let balanceIndex = event.detail.value;
                this.setData({
                        balanceIndex: balanceIndex,
                        balanceAccount: balanceArray[1][balanceIndex[1]]
                })
        },
        bindBalanceColumnChange: function(e) {
                var data = {
                        balanceArray: this.data.balanceArray,
                        balanceIndex: this.data.balanceIndex
                }
                data.balanceIndex[e.detail.column] = e.detail.value
                switch (data.balanceIndex[0]) {
                        case 0:
                                data.balanceArray[1] = ['现金']
                                break;
                        case 1:
                                data.balanceArray[1] = ['花呗', '京东白条', '信用卡']
                                break;
                        case 2:
                                data.balanceArray[1] = ['银行卡']
                                break;
                        case 3:
                                data.balanceArray[1] = ['微信钱包', '支付宝', '余额宝', '校园卡', 'QQ钱包', '公交卡']
                                break;
                }
                this.setData(data);
        },

        //选择余额变更日期
        bindyueDateChange: function(event) {
                wx.cloud.callFunction({
                        name: "getdate",
                        data: {
                                dateTime: event.detail.value
                        }
                }).then(res => {
                        console.log(res)
                        this.setData({
                                yueDate: event.detail.value,
                                recordYear: res.result.recordYear,
                                recordMonth: res.result.recordMonth,
                                recordDay: res.result.recordDay
                        })
                })

        },

        // 函数：向数据库中的某一个表中增加【余额变更】的数据
        async addBalanceData(param) {
                // const userCashAccountData = await db.collection(param).get()
                const userAccountData = await db.collection("allAccount").where({
                        recordAccount: param
                }).get()
                let userDataLength = userAccountData.data.length

                // 更新账户总额
                let amount = parseInt(this.data.formDataBalanceAmount)
                console.log("余额表单中amount类型", typeof(amount))
                if (param == "现金") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.cashAccountBalance + amount
                } else if (param == "花呗") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.huabeiAccountBalance + amount
                } else if (param == "京东白条") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.jdAccountBalance + amount
                } else if (param == "信用卡") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.creditCardBalance + amount
                } else if (param == "银行卡") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.bankCardBalance + amount
                } else if (param == "微信钱包") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.wechatBalance + amount
                } else if (param == "支付宝") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.zhifubaoBalance + amount
                } else if (param == "余额宝") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.yuebaoBalance + amount
                } else if (param == "校园卡") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.schoolCardBalance + amount
                } else if (param == "QQ钱包") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.qqBalance + amount
                } else if (param == "公交卡") {
                        app.globalData.totalBalance = app.globalData.totalBalance - app.globalData.busCardBalance + amount
                }

                db.collection("allAccount").add({
                        data: {
                                recordAccount: param,
                                recordAmount: this.data.formDataBalanceAmount,
                                recordRemark: this.data.formDataBalanceRemark,
                                recordImg: this.data.realImgs,
                                recordNum: userDataLength + 1,
                                recordTime: this.data.balanceDate,
                                recordYear: this.data.recordYear,
                                recordMonth: this.data.recordMonth,
                                recordDay: this.data.recordDay,
                                billType: "余额变更",
                                recordIcon: "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/balanceChange.png?sign=1c98610eb870e5e0121bcdafee201324&t=1585206305"
                        }
                }).then(res => {
                        wx.showToast({
                                title: '成功',
                                icon: 'success',
                                success: res => {
                                        this.setData({
                                                balanceInputValue: "",
                                                balanceAmount: "0.00",
                                                remarkBalanceText: "...",
                                                remarkBalanceContent: "",
                                                fileList: [],
                                                realImgs: []
                                        })
                                }
                        })
                        wx.switchTab({
                                url: "../account/account"
                        })
                }).catch(err => {
                        wx.showToast({
                                title: "失败！请重试！",
                                icon: "none"
                        })
                })
        },


        // 余额表单提交
        balanceFormSubmit: function(e) {
                console.log('form发生了submit事件，携带数据为：', e.detail.value)
                let formData = e.detail.value;

                // 判断用户是否选择了日期
                let balanceDate = "";
                if (formData.yueTime != "") {
                        this.setData({
                                balanceDate: formData.yueTime
                        })
                } else {
                        this.setData({
                                balanceDate: this.data.nowTime
                        })
                }

                // 判断用户是否选择了“账户”
                let balanceAccount = "现金";
                if (this.data.balanceAccount != "") {
                        balanceAccount = this.data.balanceAccount
                }
                console.log("balanceAccount", balanceAccount)

                // 用户填入金额才能提交
                if (formData.balanceAmount == "") {
                        Notify({
                                type: 'primary',
                                message: '请填入金额',
                                selector: '#borrow-notify',
                                duration: 1500
                        });
                } else {
                        this.setData({
                                formDataBalanceAmount: formData.balanceAmount,
                                formDataBalanceRemark: formData.balanceRemark
                        })
                        // 根据用户选择账户，来决定将数据提交到那个账户表中
                        this.addBalanceData(balanceAccount)
                }

        },

        /**
         *  ***********************************************************
         */

        //【借贷】数字输入框获取焦点
        borrowInputFocus: function(event) {
                this.setData({
                        borrowAmount: ""
                })
        },

        //【借贷】数字输入框失去焦点时判断是否有内容
        borrowInputBlur: function(event) {
                let num = event.detail.value;
                if (num == "") {
                        this.setData({
                                borrowAmount: "0.00"
                        })
                }
        },

        //【借贷】选择类型
        bindBorrowPickerChange: function(event) {
                let borrowArray = this.data.borrowArray;
                let borrowIndex = event.detail.value;
                this.setData({
                        borrowIndex: borrowIndex,
                        borrowInAccount: borrowArray[1][borrowIndex[1]]
                })
        },
        bindBorrowColumnChange: function(e) {
                var data = {
                        borrowArray: this.data.borrowArray,
                        borrowIndex: this.data.borrowIndex
                }
                data.borrowIndex[e.detail.column] = e.detail.value
                switch (data.borrowIndex[0]) {
                        case 0:
                                data.borrowArray[1] = ['现金']
                                break;
                        case 1:
                                data.borrowArray[1] = ['花呗', '京东白条', '信用卡']
                                break;
                        case 2:
                                data.borrowArray[1] = ['银行卡']
                                break;
                        case 3:
                                data.borrowArray[1] = ['微信钱包', '支付宝', '余额宝', '校园卡', 'QQ钱包', '公交卡']
                                break;
                }
                this.setData(data);
        },

        //选择借贷人
        bindBorrowManChange: function(event) {
                let borrowManArray = this.data.borrowManArray;
                let borrowManIndex = event.detail.value;
                this.setData({
                        borrowManIndex: borrowManIndex,
                        // 提交表单时把下标改成值
                        borrowFormMan: borrowManArray[borrowManIndex]
                })
        },

        //选择借贷日期
        bindBorrowDateChange: function(event) {
                this.setData({
                        borrowDate: event.detail.value
                })
                wx.cloud.callFunction({
                        name: "getdate",
                        data: {
                                dateTime: event.detail.value
                        }
                }).then(res => {
                        console.log(res)
                        this.setData({
                                borrowDate: event.detail.value,
                                recordYear: res.result.recordYear,
                                recordMonth: res.result.recordMonth,
                                recordDay: res.result.recordDay
                        })
                })
        },

        // 借贷表单提交
        borrowFormSubmit: function(e) {
                console.log('借贷表单发生了submit事件，携带数据为：', e.detail.value)
                let formData = e.detail.value;

                // 判断用户是否选择了日期
                let borrowDate = this.data.nowTime;
                if (formData.borrowTime != "") {
                        borrowDate = formData.borrowTime
                }

                // 判断用户是否选择了“账户”
                let recordAccount = "现金";
                if (this.data.borrowInAccount != "") {
                        recordAccount = this.data.borrowInAccount
                }
                console.log("borrowInAccount", recordAccount)

                // 判断用户是否选择了债权人
                let borrowFormMan = "家人";
                if (this.data.borrowFormMan != "") {
                        borrowFormMan = this.data.borrowFormMan
                }
                console.log("borrowFormMan", borrowFormMan)

                let recordAmount = formData.borrowAmount
                if (recordAmount == "") {
                        Notify({
                                type: 'primary',
                                message: '请填入金额',
                                selector: '#borrow-notify',
                                duration: 1500
                        });
                } else {
                        //更新账户余额 
                        this.updateIncomeBalance(recordAccount, recordAmount, "余额变更", formData.borrowRemark, borrowDate)
                        if (this.data.incomeAccountCount > 0) {
                                db.collection("otherRecord").add({
                                        data: {
                                                billType: "借贷",
                                                borrowFormMan: borrowFormMan,
                                                recordAmount: "+" + recordAmount,
                                                recordAccount,
                                                recordTime: borrowDate,
                                                recordRemark: this.data.borrowFormMan + "  " + formData.borrowRemark,
                                                recordImg: this.data.realImgs,
                                                recordIcon: "https://786c-xly-tfjyo-1300271371.tcb.qcloud.la/recordIcons/borrow.png?sign=5017d79e705593d3fc947e886064dbc6&t=1585206329",
                                                recordYear: this.data.recordYear,
                                                recordMonth: this.data.recordMonth,
                                                recordDay: this.data.recordDay
                                        }
                                }).then(res => {
                                        wx.showToast({
                                                title: '成功',
                                                icon: 'success',
                                                success: res => {
                                                        this.setData({
                                                                borrowInputValue: "",
                                                                borrowAmount: "0.00",
                                                                remarkBorrowText: "...",
                                                                remarkBorrowContent: "",
                                                                fileList: [],
                                                                realImgs: []
                                                        })
                                                }
                                        })
                                        wx.switchTab({
                                                url: "../account/account"
                                        })
                                }).catch(err => {
                                        wx.showToast({
                                                title: "失败！请重试！",
                                                icon: "none"
                                        })
                                })
                        }
                }
        },

        onShareAppMessage: function() {
                return {
                        title: "大学生记账本",
                        desc: "方便快捷的记账小程序",
                        path: "/pages/welcome/welcome"
                }
        }

})