import axios from "axios"
import config from "config";

export const user = {
	dataById: {
		get: async(uid) => await axios.get(`${config.serverURL}/user/${uid}`),
		put: async(uid, body) => await axios.put(`${config.serverURL}/user/${uid}`, body),
		delete: async(uid) => await axios.delete(`${config.serverURL}/user/${uid}`)
	},
	dataByUsername: {
		get: async(username) => await axios.get(`${config.serverURL}/user/username/${username}`)
	},
	avatarById: {
		post: async(uid, data) => await axios.post(`${config.serverURL}/user/${uid}/avatar`, data)
	}
}

export default user
