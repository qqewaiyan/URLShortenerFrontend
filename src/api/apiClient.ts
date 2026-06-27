import axios from "axios";
import { API_URL } from "../lib/constants";

const apiClient = axios.create({
  baseURL: API_URL,
});
const ACCESS_TOKEN_KEY = "accessToken";
// attach access token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;