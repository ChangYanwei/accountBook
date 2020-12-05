// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})

// cloud.init要写在 cloud.database之前，否则会报未初始化！！！
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const countResult = await db.collection(event.collectionName).count()

	return {
		countResult
	}
}