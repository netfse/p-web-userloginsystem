const axios = require('axios')

const get = async (url, params, headers, req) => {
	// set the content-type
	if (_.isEmpty(headers)) {
		headers = {}
	}

	if (req) {
		headers.Authorization = req.headers.authorization
		headers.site = req.headers.site
		headers.locale = req.headers.locale
		headers['Content-Type'] = 'application/json'
	} else {
		headers['Content-Type'] = 'application/json'
	}

	params = { params, headers }

	try {
		// call efiling-dms-service to process
		logger.debug(`Sending GET request to ${url}...`)
		const response = await axios.get(url, params)

		logger.debug('Request success. Responses has received.')

		if (response.status === global.http.status.success) {
			return { data: response.data.data, metadata: response.data.metadata }
		}
	} catch (err) {
		logger.error(`Response to ${url} failed, request data are: \r\n%o`, params)

		throw new Error(
			`Response from internal remote API failed, message: ${err.response.data.message}`)
	}
}

const post = async (url, params, headers, req) => {
	// set the content-type
	if (_.isEmpty(headers)) {
		headers = {}
	}

	if (req) {
		headers.Authorization = req.headers.authorization
		headers.site = req.headers.site
		headers.locale = req.headers.locale
		headers['Content-Type'] = 'application/json'
	} else {
		headers['Content-Type'] = 'application/json'
	}

	const config = {
		headers,
		responseType: 'json',
		maxContentLength: Infinity,
	}

	try {
		// call efiling-dms-service to process
		logger.debug(`Sending POST request to ${url}...`)
		const response = await axios.post(url, params, config)
		logger.debug('Request success. Responses has received.')

		if (response.status === global.http.status.success) {
			if (!_.isNil(response.data)) {
				return { data: response.data.data, metadata: response.data.metadata }
			} else {
				return {}
			}
		}
	} catch (err) {
		logger.error(
			`Response to ${url} API failed, request data are: \r\n%o`,
			params
		)

		throw new Error(
			`Response from internal remote API failed, message: ${err.response.data.message}`)
	}
}

module.exports = {
	get,
	post,
}
