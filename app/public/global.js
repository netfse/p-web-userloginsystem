global.__require = require('app-root-path').require
global.logger = require('../config/logger.config')
global._ = require('lodash')

global.service = {
	uuid: require('uuid').v4(),
}

global.format = {
	datetime: {
		normal: 'YYYY-MM-DD HH:mm:ss',
		oracledb: 'YYYY-MM-DD HH24:MI:SS',
		filename: 'YYYYMMDDHHmmss-x',
	},
	date: {
		normal: 'YYYY-MM-DD',
		directory: 'YYYYMM',
	},
	time: 'HH:mm:ss',
}

/*
 *=============================================================
 * STATUS    DESCRIPTION
 *=============================================================
 *  200      Request Success, can be no data to respond
 *  500      Exception thrown from system
 *  400      Program cannot run as user excepted
 *  401      OAuth authorize failed
 *  403      OAuth passed but No Rights to run the services
 *  404      Cannot find the resources specified
 */
global.http = {
	status: {
		success: 200,
		internal_error: 500,
		unauthorized: 401,
		unpermitted: 403,
		not_found: 404,
		bad_request: 400,
	},
}

global.locale = {
	default_code: 'en_US',
	default_seq: 10001,
	tchinese_code: 'zh_HK',
	tchinese_seq: 10002,
}

global.page = {
	default_size: 10000,
}

global.company = {
	default_seq: 99999,
}
