function verifyPasswd(passwd1, passwd2) {
	if (passwd1 === passwd2 && passwd1.length >= 8)
		return true;
	return false;
}