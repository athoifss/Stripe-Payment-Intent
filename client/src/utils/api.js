import axios from "axios";
const _BASE_URL = "http://localhost:5000";

export const postRequest = (path, data) => {
  return axios.post(`${_BASE_URL}${path}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getRequest = (path) => {
  return axios.get(`${_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
