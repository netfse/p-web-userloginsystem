const jwt = require('jsonwebtoken')
const moment = require('moment')
const axiosUtils = require('./axiosUtils')

module.exports.sendExceptionAlertToSystemAdmin = async (code, req, err) => {
	let request_username = 'Not authorized user'
	if (req.auth.auth_username) {
		request_username = req.auth.auth_username
	}

	let request_sitecode = req.headers.site

	let exception_data = {
		response_code: code,
		services_name: process.env.PROJECT_NAME,
		request_username: request_username,
		request_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
		request_site: request_sitecode,
		request_path: req.originalUrl,
		request_method: req.method,
		request_params: {
			params: req.params,
			query: req.query,
			body: req.body,
			headers: req.headers,
		},
		exception_date: moment().format(global.format.datetime.normal),
		exception_message: err.message,
		exception_details: err.stack,
	}

	let recipientsInStr = process.env.CMS_EXCEPTION_ALERT_RECIPIENTS
	let recipients = []
	if (recipientsInStr) {
		recipientsInStr.split(';')
	}

	const payload = {
		data: exception_data,
		recipients: recipients,
	}

	let expiry = _.toInteger(
		process.env.JWT_EXPIRY_TIME_IN_SECOND_FOR_EMAIL_SERVICES
	)
	const token = jwt.sign(
		payload,
		process.env.JWT_SECRET_KEY_FOR_EMAIL_SERVICES,
		{
			expiresIn: expiry,
			issuer: process.env.JWT_ISSUER,
		}
	)

	let url = process.env.CMS_SERVICES_EXCEPTION_ALERT_URI

	let params = {
		token: token,
	}

	await axiosUtils.post(url, params)
}
