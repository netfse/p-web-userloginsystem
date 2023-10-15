function getRandomString(len, charSet) {
	charSet =
		charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var randString = ''
	for (var i = 0; i < len; i++) {
		var position = Math.floor(Math.random() * charSet.length)
		randString += charSet.substring(position, position + 1)
	}
	return randString
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

function padStart(n, width, z) {
	z = z || '0'
	n = n + ''
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

function padEnd(n, width, z) {
	z = z || '0'
	n = n + ''
	return n.length >= width ? n : n + new Array(width - n.length + 1).join(z)
}

function reverseString(str) {
	return str.split('').reverse().join('')
}

module.exports = {
	getRandomString,
	getRandomInt,
	padStart,
	padEnd,
	reverseString,
}
