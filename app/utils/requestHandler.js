const jsonEnvelope = require('../routes/responses/jsonEnvelope')
const moment = require('moment')
const exceptionAlert = require('./exceptionAlert')

function throwJoiError(err, res, req) {
    if (err) {
        err.status = global.http.status.badrequest
    }
    return !_.isNull(err) ? sendError(res, req, err) : ''
}

function throwError(status, errorType, errorMessage) {
    const e = new Error(errorMessage || 'Default Error')
    e.status = status
    e.errorType = errorType
    throw e
}

function sendSuccess(req, res, message, status) {
    logger.info(
        'User [%s] requested at [%s] successfully.',
        req.auth.auth_username,
        req.originalUrl
    )
    return (data) => {
        let respJ = {}
        let metadata = {
            locale: req.headers.locale || global.locale.default,
            site: req.headers.site,
            current_page: req.query.page || 1,
        }

        //Response may be in { data: [], metadata: {} } format or only [], threfore
        //if data.data is null, it should be an array
        if (_.isNil(data.data)) {
            // then restucutre it as { data: [], metadata: {}}
            respJ = { data: data, metadata: metadata }
        } else {
            // otherwise, add new variable to data.metadata and then return it.
            data.metadata = { ...data.metadata, ...metadata }
            respJ = data
        }

        if (!message) {
            if (data.length <= 0) {
                message =
                    'The API service was called successfully but has no data returned.'
            }
        }

        res
            .status(status || global.http.status.success)
            .json(jsonEnvelope.getSuccessJSON(message, respJ))
    }
}

function sendError(req, res, error) {
    logger.info(
        `User ${req.auth.auth_username} requested at [${req.originalUrl}] has error. \r\nDetail message: ${error.message}`
    )

    let locale = req.headers.locale || global.locale.default
    let site = req.headers.site || ''

    let failureJson = jsonEnvelope.getFailureJSON(
        locale,
        site,
        error.message || 'Unhandled Error'
    )

    exceptionAlert.sendExceptionAlertToSystemAdmin(failureJson.code, req, error)

    return res
        .status(error.status || global.http.status.internal_error)
        .json(failureJson)
}

function sendDuplicateUserError(req, res, error) {
    logger.info(
        `User ${req.auth.auth_username} requested at [${req.originalUrl}] has error. \r\nDetail message: ${error.message}`
    )

    let locale = req.headers.locale || global.locale.default
    let site = req.headers.site || ''

    let failureJson = jsonEnvelope.getFailureJSON(
        locale,
        site,
        'Cannot Insert Duplicate User!'
    )

    exceptionAlert.sendExceptionAlertToSystemAdmin(failureJson.code, req, error)

    return res
        .status(error.status || global.http.status.internal_error)
        .json(failureJson)
}

/**
 * Parse query string to specified value
 * @param {*} value query strings
 * @param {*} options {
 *  parseBoolean: return true or false,
 *  parseStartDate: align datetime to the start of the day,
 *  parseEndDate: align datetime to the end of the day,
 *  parseQueryStatus: return 'Y' or 'N',
 *  parseQueryLike: return the string padded with '%',
 *  parseQuerySort: reformat to query sorting parameter. Accept '<'/'-' as Descending and '>'/'+' as Ascending
 * }
 */

function parseQuery(value, option) {
    if (_.isNil(value)) {
        return null
    }

    if (_.isNumber(value)) {
        return value
    }

    switch (option) {
        case 'status':
            if (typeof value === 'string') {
                value = value.toLowerCase()
                if (value === 'true' || value === 'y') {
                    return 'Y'
                } else if (value === 'false' || value === 'n') {
                    return 'N'
                }
            } else if (typeof value === 'boolean') {
                if (value) {
                    return 'Y'
                } else {
                    return 'N'
                }
            }
            break
        case 'boolean':
            if (typeof value === 'string') {
                value = value.toLowerCase()
                if (value === 'true' || value === 'y') {
                    return true
                } else if (value === 'false' || value === 'n') {
                    return false
                }
            } else if (typeof value === 'boolean') {
                return value
            }
            break
        case 'datetime24':
            let date = moment(value, global.format.date.normal)
            if (date.isValid()) {
                return date
            }
            break
        case 'startdate':
            let startdate = moment(value, global.format.date.normal)
            if (startdate.isValid()) {
                return startdate.startOf('day').format(global.format.datetime.normal)
            }
            break
        case 'enddate':
            let enddate = moment(value, global.format.date.normal)
            if (enddate.isValid()) {
                return enddate.endOf('day').format(global.format.datetime.normal)
            }
            break
        case 'sqlsort':
            let sorts = value.split(',')

            let sortParams = []
            sorts.forEach((s) => {
                s = s.trim() //trim heading/tailing spaces
                if (s.startsWith('+') || s.startsWith('>')) {
                    sortParams.push(s.substring(1, s.length) + ' asc')
                } else if (s.startsWith('-') || s.startsWith('<')) {
                    sortParams.push(s.substring(1, s.length) + ' desc')
                } else {
                    sortParams.push(s + ' asc')
                }
            })

            if (sortParams.length > 0) {
                return sortParams //return array
            }
        case 'like':
            if (value.length > 0) {
                return `%${value}%`
            }
        default:
            if (value.length > 0) {
                return value
            }
    }

    return null
}

// append new query paramerters to url
/**
 *
 * @param {string} url
 * @param {{key: string, value: string}} params json array with kv object, e.g. { key: 'key', value: 'value' }
 * @returns combined URL
 */
module.exports.addQueryParametersToURL = (
    url,
    params = [{ key: 'key', value: 'value' }]
) => {
    const destUrlWithParams = new URL(url)
    for (let param of params) {
        if (param.key && param.value) {
            destUrlWithParams.searchParams.append(param.key, param.value)
        }
    }
    return destUrlWithParams.href
}

module.exports = {
    throwJoiError,
    throwError,
    sendSuccess,
    sendError,
    sendDuplicateUserError,
    parseQuery,
}
