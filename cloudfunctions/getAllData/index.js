const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

/**
 * 小程序端在获取集合数据时服务器一次默认并且最多返回 20 条记录，
 * 云函数端这个数字则是 100。
 * 因为有最多一次取 100 条的限制，
 * 因此很可能一个请求无法取出所有数据，需要分批次取。
 */
exports.main = async (event, context) => {
	// 先取出集合记录总数
	const countResult = await db.collection(event.account).where({_openid:event.openid}).count()
	const total = countResult.total

	// 计算需分几次取
	const batchTimes = Math.ceil(total / 100)

	// 承载所有读操作的 promise 的数组
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		const promise = db.collection(event.account).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
		tasks.push(promise)
	}

	// 等待所有
	return (await Promise.all(tasks)).reduce((acc, cur) => {
		return {
			allData: acc.data.concat(cur.data),
			errMsg: acc.errMsg,
		}
	})
}