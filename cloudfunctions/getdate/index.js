const cloud = require('wx-server-sdk')

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {

	let dateTime = event.dateTime
	let recordYear = dateTime.substring(0, 4)
	let recordMonth = ''
	let recordDay = ''

	if (dateTime.substring(5, 6) == '0') {
		recordMonth = dateTime.substring(6, 7)
	} else {
		recordMonth = dateTime.substring(5, 7)
	}

	if (dateTime.substring(8, 9) == '0') {
		recordDay = dateTime.substring(9)
	} else {
		recordDay = dateTime.substring(8)
	}

	return {
		recordYear,
		recordMonth,
		recordDay		
	}
}