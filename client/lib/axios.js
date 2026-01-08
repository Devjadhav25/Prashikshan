import axios from "axios";

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      console.error(
        "[API Error] Network error - Server may be down or unreachable"
      );
      // You can add toast notification here if needed
    } else if (error.response) {
      // Server responded with error status
      console.error(
        `[API Error] ${error.response.status}: ${error.response.statusText}`
      );
    } else {
      // Request was made but no response received
      console.error("[API Error] No response received from server");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

