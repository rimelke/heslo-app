import axios from "axios";
import asyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "src/constants/keys";

const api = axios.create({
  baseURL: process.env.API_URL || "http://10.0.2.2:3000/api",
});

api.interceptors.request.use(async (config) => {
  const token = await asyncStorage.getItem(TOKEN_KEY);

  if (!config.headers) config.headers = {};

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
