import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const jwtAuthAPI = axios.create({});
// Stores JWT in LocalStorage and adds it to the Authorization header
// Not fully implemented

// Add a request interceptor to add the Authorization header
jwtAuthAPI.interceptors.request.use(
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
jwtAuthAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await JWTAuthAPI.refreshToken();
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return jwtAuthAPI(originalRequest);
      } else {
        window.location.href = "/login?next=" + window.location.pathname;
      }
    }
    return Promise.reject(error);
  }
);

export const JWTAuthAPI = {
  getNewToken: async (username, password) => {
    return axios
      .post("/api/token/", {
        username: username,
        password: password,
      })
      .then((res) => {
        const token = res.data.access;
        localStorage.setItem("token", token);
        return token;
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  },
  login: async (username, password) => {
    return axios.post("/api/dj-rest-auth/login/", {
      username: username,
      password: password,
    });
  },
  googleCallback: (code) => {
    return axios.post("/api/dj-rest-auth/google/", { code: code }).then((res) => {
      const token = res.data.access;
      localStorage.setItem("token", token);
    });
  },
  refreshToken: async () => {
    return axios
      .post("/api/dj-rest-auth/token/refresh/", {}, { withCredentials: true })
      .then((res) => {
        const token = res.data.access;
        localStorage.setItem("token", token);
        return token;
      })
      .catch((error) => {
        console.error("Refresh token failed:", error);
      });
  },
  logout: () => {
    // TODO: handle if token missing
    // TODO: handle if refresh expired
    return jwtAuthAPI.post("/api/dj-rest-auth/logout/").then((res) => {
      console.log("Successfully logged out");
      localStorage.removeItem("token");
      window.location.href = "/discover";
    });
  },
};

export default JWTAuthAPI;
