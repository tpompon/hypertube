import axios from 'axios';
import config from 'config'

const url = `${config.serverURL}/movies/`

export const movies = {
	get: () => axios.get(url),
	post: (body) => axios.post(url, body),
	byId: {
		get: (id) => axios.get(url + id),
		put: (id, body) => axios.post(url + id, body),
		delete: (id) => axios.delete(url + id)
	},
	ytsById: {
		get: (id) => axios.get(url + id)
	}
}

export default movies
