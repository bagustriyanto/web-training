const alphanumeric = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9"
const alphanumericArr = alphanumeric.split(",")

module.exports = {
	generateVerificationCode() {
		const maxLoop = 6
		let verificationCode = ""

		for (let index = 0; index < maxLoop; index++) {
			let firstRandomInt = Math.round(Math.random() * 10)
			let secondRandomInt = Math.round(Math.random() * 10)
			let thirdRandomInt = Math.round((Math.random() * 10) / 2)
			let randomInt = firstRandomInt + secondRandomInt + thirdRandomInt
			verificationCode += alphanumericArr[randomInt]
		}

		return verificationCode
	}
}
