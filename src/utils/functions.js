import path from "path";

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
	const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{5,}$/ig
	return regex.test(phone);
}

export const escapeSpecial = (string) => {
	const regex = /[<>;`~'"\\]+/g
	return string.replace(regex, '');
}

export const verifyAvatarExt = (avatar) => {
	const ext = path.extname(avatar.name);
	const mimeType = avatar.type;

	if (ext === '.png' || ext !== '.jpg' || ext !== '.jpeg')
		if (mimeType === 'image/png' || mimeType === 'image/jpg' || mimeType === 'image/jpeg')
		return true;
	return false;
}

export const verifyAvatarSize = (avatar) => {
	return avatar.size < 5000000;
}