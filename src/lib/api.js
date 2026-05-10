import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_URL?.trim();

function getDefaultApiUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:5000/api";
  }

  const isLocalhost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    return "http://localhost:5000/api";
  }

  // On production hosts, prefer same-origin API path.
  return "/api";
}

const baseURL = envApiUrl || getDefaultApiUrl();

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("italina_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function parseApiError(error, fallback = "Something went wrong.") {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return fallback;
}
