import axios from "../../../utils/axiosInstance";

export const login = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });

  // store in localStorage
  localStorage.setItem("authToken", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

export const register = async (payload) => {
  const res = await axios.post("/auth/register", payload);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};
