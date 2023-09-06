const axios = require("axios");

export function axiosClient() {
  async function get(url) {
    return axios.put(url);
  }

  async function post(url, body) {
    return axios.put(url, {
      ...body,
    });
  }

  async function put(url, body) {
    return axios.put(url, {
      ...body,
    });
  }

  return {
    get,
    post,
    put,
  };
}
