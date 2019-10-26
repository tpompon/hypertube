import axios from "axios";
import config from "config";

const url = `${config.serverURL}/users/`;

const users = {
  get: () => axios.get(url),
  post: body => axios.post(url, body),
  byId: {
    get: uid => axios.get(url + uid),
    put: (uid, body) => axios.put(url + uid, body),
    delete: uid => axios.delete(url + uid)
  },
  byUsername: {
    get: username => axios.get(url + `n/${username}`)
  },
  avatarById: {
    post: (data) => axios.post(url + `avatar`, data)
  }
};

export default users;
