const moment = require('moment')
const stringUtils = require('../../utils/stringUtils')

let success = {
	timestamp: '',
	type: 'success',
	code: '',
	message: '',
	data: [],
	metadata: {},
}

let failure = {
	timestamp: '',
	type: 'error',
	code: '',
	message: '',
	data: [],
	metadata: {},
}

const getSuccessJSON = (message, respj) => {
	success.timestamp = moment().format(global.format.datetime.normal)
	success.code = stringUtils.getRandomString(6).toUpperCase()
	success.message = message || 'The API service was called successfully.'
	success.data = respj.data

	success.metadata = {
		site: respj.metadata.site,
		locale: respj.metadata.locale,
		page_records: 1,
		total_records: respj.metadata.total_records,
		current_page: respj.metadata.current_page,
		total_page: 1,
	}

	if (Array.isArray(respj.data)) {
		let page_records_limits = global.page.default_size
		let total_records = respj.data.length
		if (!_.isNil(respj.metadata.records_limit)) {
			page_records_limits = respj.metadata.records_limit
		}
		if (!_.isNil(respj.metadata.total_records)) {
			total_records = respj.metadata.total_records
			success.metadata.total_page = Math.ceil(
				total_records / page_records_limits
			)
		}

		success.metadata.page_records = respj.data.length
		success.metadata.total_records = total_records
	} else {
		if (_.isEmpty(respj.data)) {
			success.metadata.page_records = 0
		}
	}

	logger.info('API Response Code: %s', success.code)
	return success
}

const getFailureJSON = (locale, site, message) => {
	failure.timestamp = moment().format(global.format.datetime.normal)
	failure.code = stringUtils.getRandomString(6).toUpperCase()
	failure.message = message
	failure.metadata = {
		site: site,
		locale: locale,
		page_records: 0,
		total_records: 0,
		current_page: 1,
		total_page: 1,
	}


	logger.info('API Response Code: %s', failure.code)
	return failure
}

module.exports = {
	getSuccessJSON,
	getFailureJSON,
}
