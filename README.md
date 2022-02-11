### 功能介绍：
1. 使用**小程序云开发**。多种情景账本，涵盖食品、交通、购物、宿舍、娱乐、学习等各种场景，满足不同时期的记账需要
2. 提供支出、收入、转账、余额、借贷五大记账模块
3. 可以实时查看自己的账户余额和所有账单记录
4. 提供“附近银行”地图查询、汇率计算器功能

### 项目部署：
1. 需要修改的参数 在app.js文件中对云开发进行初始化时需要对env参数进行修改
2. 需要部署的云函数：getCollectionCount、getdate、login
3. 涉及到的外部服务 
	- VantUI组件库 
	- 微信同声传译 
	- 腾讯位置服务
4. 云数据库中需要创建哪些数据 
	- allAccount集合（用于储存所有的账户，集合权限为“仅创建者可读写”） 
	- otherRecord集合（用于储存支出、收入、转账、借贷的记录，集合权限为“仅创建者可读写”） 
	- knowDetail集合（用户储存“学习充电”的数据，集合权限为“所有用户可读”）
	- grade集合（存储用户的评分，集合权限为“所有用户可读，仅创建者可读写”）
	- userinfo集合（存储用户信息，头像、微信昵称等，集合权限为“所有用户可读，仅创建者可读写”）
5. 云存储中需要上传哪些文件 
	- 小程序用到的icon 
	- “学习充电”用到的图片 
	- 用户上传的图片

### 体验
- ![微信搜索“大学生记账本”](http://mmbiz.qpic.cn/mmbiz_jpg/U4esm46xrY0Houdm5n481y4CXlpcicFwia6XZgHBU4xp93Ryiba6icDnePehJiaB2Dia2KUjw2gHq44jT8ONePb8Ncew/0?wx_fmt=jpeg)
- 有关对此小程序的详细功能介绍请点击链接到微信开放社区查看https://developers.weixin.qq.com/community/develop/article/doc/0004caaad78550e49fca811f252813
