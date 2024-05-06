import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const authAPI = axios.create({});
export const api = axios.create({});

// Add a request interceptor
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post("/api/token/refresh", { refreshToken });
          if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem("token", token);
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          }
        } else {
          console.log("No refresh token found. Redirecting to login.");
          window.location.href = "/login";
        }
      } catch (error) {
        // Handle refresh token error or redirect to login
        console.error("Refresh token failed:", error);
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  getNewToken: async (username, password) => {
    return axios
      .post("/api/token/", {
        username: username,
        password: password,
      })
      .then((res) => {
        const token = res.data.access;
        const refresh = res.data.refresh;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refresh);
        return token;
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/discover";
  },
};

export default authAPI;
