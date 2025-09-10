// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://hospital-management-system-using-mern.onrender.com",
  withCredentials: true, // cookies ke liye
});

export default API;
