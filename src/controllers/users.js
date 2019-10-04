import axios from 'axios';
import config from 'config'

const url = `${config.serverURL}/users/`;

const users = {
	get: () => axios.get(url),
	post: (body) => axios.post(url, body)
}

export default users;
