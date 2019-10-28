import axios from "axios";
import config from "config";

const url = `${config.serverURL}/users/`;

const users = {
  get: () => axios.get(url),
  post: body => axios.post(url, body),
  byId: {
    get: () => axios.get(url + 'id'),
    put: body => axios.put(url + 'id', body),
    delete: () => axios.delete(url + 'id')
  },
  byUsername: {
    get: username => axios.get(url + `n/${username}`)
  },
  avatarById: {
    post: (data) => axios.post(url + `avatar`, data)
  }
};

export default users;
