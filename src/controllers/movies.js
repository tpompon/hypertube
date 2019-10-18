import axios from "axios";
import config from "config";

const url = `${config.serverURL}/movies/`;

export const movies = {
  get: () => axios.get(url),
  post: body => axios.post(url, body),
  byId: {
    get: id => axios.get(url + id),
    put: (id, body) => axios.post(url + id, body),
    delete: id => axios.delete(url + id)
  },
  ytsById: {
    get: id => axios.get(url + id)
  },
  heartbeatById: {
    get: id => axios.get(url + id + "/heartbeat"),
    post: (id, body) => axios.post(url + id + "/heartbeat", body),
    delete: id => axios.delete(url + id + "/heartbeat")
  },
  recentsById: {
    get: id => axios.get(url + id + "/recents"),
    post: (id, body) => axios.post(url + id + "/recents", body),
    delete: id => axios.delete(url + id + "/recents")
  },
  inprogressById: {
    get: id => axios.get(url + id + "/inprogress"),
    post: (id, body) => axios.post(url + id + "/inprogress", body),
    delete: id => axios.delete(url + id + "/inprogress")
  },
  commentsById: {
    post: (id, body) => axios.post(url + id + "/comments", body)
  },
  reportCommentById: {
    post: (id, body) => axios.post(url + id + "/comments/report", body)
  },
  ratingsById: {
    get: id => axios.get(url + id + "/ratings"),
    post: (id, body) => axios.post(url + id + "/ratings", body)
  },
  ratingsByIdAndUID: {
    get: (id) => axios.get(url + id + "/user/ratings")
  }
};

export default movies;
