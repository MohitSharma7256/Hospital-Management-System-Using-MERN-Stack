import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // env ke hisaab se change hoga
  withCredentials: true,
});

export default API;
