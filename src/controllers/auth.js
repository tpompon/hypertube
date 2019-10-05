import axios from "axios";
import config from "config";

const url = `${config.serverURL}/auth/`;

export const auth = {
  check: () => axios.get(url),
  logout: () => axios.get(url + "logout"),
  login: {
    post: strategy => axios.post(url + `login/${strategy}`)
  },
  confirm: body => axios.post(url + "confirm", body),
  forgot: body => axios.post(url + "forgot", body),
  forgotByKey: {
    get: key => axios.get(url + `forgot/${key}`),
    post: (key, body) => axios.post(url + `forgot/${key}`, body)
  }
};

export default auth;
