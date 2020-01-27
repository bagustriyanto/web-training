const randomByte = require("random-bytes")
const pbkdf2 = require("pbkdf2")
const byteSize = 16

module.exports = {
	salt() {
		return randomByte(byteSize).then(string => {
			return new Buffer(string).toString("base64")
		})
	},
	passwordEncrypt(password, salt) {
		let byteSalt = new Buffer(salt, "base64")
		var derivedKey = pbkdf2.pbkdf2Sync(password, byteSalt, 10000, 32, "sha1")

		return new Buffer(derivedKey).toString("base64")
	}
}
