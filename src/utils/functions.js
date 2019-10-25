export const verifyPasswd = (passwd1, passwd2) => {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=?!*()@%&]).{8,32}$/g
	if (passwd1 === passwd2)
		return regex.test(passwd1);
	return false;
}

export const verifyEmail = (email) => {
	const regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
	return regex.test(email);
}

export const verifyUsername = (username) => {
	const regex = /^[a-z0-9_-]{3,16}$/ig
	return regex.test(username);
}

export const verifyNameOrCity = (word) => {
	const regex = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/ig
	return regex.test(word);
}

export const verifyPhone = (phone) => {
	const regex = /((?:\+|00)[17](?: |-)?|(?:\+|00)[1-9]\d{0,2}(?: |-)?|(?:\+|00)1-\d{3}(?: |-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7}))/ig
	return regex.test(phone);
}
