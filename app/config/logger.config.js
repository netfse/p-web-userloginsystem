require('winston-daily-rotate-file')
var winston = require('winston')
var path = require('path')

var APP_ROOT = path.join(__dirname, '..')
//var PROJECT_ROOT = path.join(__dirname, '..', '..')
//var LOG_PATH = `${PROJECT_ROOT}/logs`
var LOG_PATH = `C:/logs/${process.env.PROJECT_NAME}`

const options = {
	error: {
		level: 'error',
		filename: `${LOG_PATH}/error_%DATE%.log`,
		datepattern: 'YYYY-MM-DD',
		handleExceptions: true,
		json: true,
		maxsize: 102400000, // 100MB
		maxFiles: 100,
		colorize: false,
	},

	info: {
		level: 'info',
		filename: `${LOG_PATH}/info_%DATE%.log`,
		datepattern: 'YYYY-MM-DD',
		handleExceptions: true,
		json: true,
		maxsize: 102400000, // 100MB
		maxFiles: 100,
		colorize: false,
	},

	debug: {
		level: 'debug',
		filename: `${LOG_PATH}/debug_%DATE%.log`,
		datepattern: 'YYYY-MM-DD',
		handleExceptions: true,
		json: true,
		maxsize: 102400000, // 100MB
		maxFiles: 100,
		colorize: false,
	},

	console: {
		level: process.env.SERVER_ENV === 'prd' ? 'info' : 'debug',
		handleExceptions: true,
		json: false,
		format: winston.format.colorize({ level: true }),
	},

	access: {
		level: 'http',
		levelOnly: true,
		filename: `${LOG_PATH}/http_%DATE%.log`,
		datepattern: 'YYYY-MM-DD',
		maxsize: 102400000, // 100MB
		maxFiles: 100,
	},
}

//logger for common use
var logger = new winston.createLogger({
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.prettyPrint(),
		winston.format.splat(),
		winston.format.printf((info) => {
			return `${info.timestamp} [${info.level}] ${info.message}\n`
		})
	),

	transports: [
		new winston.transports.DailyRotateFile(options.error),
		new winston.transports.DailyRotateFile(options.info),
		new winston.transports.Console(options.console),
		new winston.transports.DailyRotateFile(options.debug),
	],
	
	exitOnError: false, // do not exit on handled exceptions
})

//logger for morgan, separate logging
var httplogger = new winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.prettyPrint(),
		winston.format.splat(),
		winston.format.printf((info) => {
			return `${info.timestamp} [${info.level}] ${info.message}\n`
		})
	),

	transports: [
		new winston.transports.DailyRotateFile(options.access), //save the log into text file
		new winston.transports.Console(options.console), //also print the log in console
	],

	exitOnError: false, // do not exit on handled exceptions
})

//stream for morgan logging
httplogger.stream = {
	write: function (message) {
		httplogger.http(message)
	},
}

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments(args) {
	args = Array.prototype.slice.call(args)

	var stackInfo = getStackInfo(1)

	if (stackInfo) {
		// get file path relative to project root
		var calleeStr = stackInfo.relativePath + ':' + stackInfo.line

		// if the argument is an Error, only show the stack message
		if (args[0].stack) {
			args[0] = args[0].stack
		}

		if (typeof args[0] === 'string') {
			args[0] = calleeStr + '\n' + args[0]
		} else {
			args.unshift(calleeStr)
		}
	}

	return args
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo(stackIndex) {
	// get call stack, and analyze it
	// get all file, method, and line numbers
	var stacklist = new Error().stack.split('\n').slice(3)

	// stack trace format:
	// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	// do not remove the regex expresses to outside of this method (due to a BUG in node.js)
	var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
	var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

	var s = stacklist[stackIndex] || stacklist[0]
	var sp = stackReg.exec(s) || stackReg2.exec(s)

	if (sp && sp.length === 5) {
		return {
			method: sp[1],
			relativePath: path.relative(APP_ROOT, sp[2]),
			line: sp[3],
			pos: sp[4],
			file: path.basename(sp[2]),
			stack: stacklist.join('\n'),
		}
	}
}

// A custom logger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.
module.exports.debug = module.exports.log = function () {
	logger.debug.apply(logger, formatLogArguments(arguments))
}

module.exports.info = function () {
	logger.info.apply(logger, formatLogArguments(arguments))
}

module.exports.warn = function () {
	logger.warn.apply(logger, formatLogArguments(arguments))
}

module.exports.error = function () {
	logger.error.apply(logger, formatLogArguments(arguments))
}

module.exports.stream = httplogger.stream
