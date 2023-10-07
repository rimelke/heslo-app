import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || "http://10.0.2.2:3000/api",
  withCredentials: true,
});

export default api;
