import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000/api",
});

// api.interceptors.request.use((config) => {
//   const { 'heslo.token': token } = nookies.get()

//   if (!config.headers) config.headers = {}

//   if (token) config.headers.Authorization = `Bearer ${token}`

//   return config
// })

export default api;
