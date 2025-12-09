import axios from "axios";

// base setup
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY, // change if needed
});

// attach token automatically
instance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export default instance;
