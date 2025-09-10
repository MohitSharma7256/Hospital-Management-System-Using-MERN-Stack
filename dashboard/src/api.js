// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://hospital-management-system-using-mern.onrender.com", // Your BACKEND URL
  withCredentials: true,
});

export default API;