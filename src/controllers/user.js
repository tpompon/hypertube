import axios from "axios"
import config from "config";

const url = `${config.serverURL}/user/`

export const user = {
	byId: {
		get: (uid) => axios.get(url + uid),
		put: (uid, body) => axios.put(url + uid, body),
		delete: (uid) => axios.delete(url + uid)
	},
	byUsername: {
		get: (username) => axios.get(url + `username/${username}`)
	},
	avatarById: {
		post: (uid, data) => axios.post(url + `${uid}/avatar`, data)
	}
}

export default user
