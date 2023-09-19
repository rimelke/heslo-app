import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL || "http://10.0.2.2:3000/api",
  withCredentials: true,
});

export default api;
