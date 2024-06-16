import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// JWT managed via cookies
export const jwtAuthAPI = axios.create({});

// Add a response interceptor
jwtAuthAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      JWTAuthAPI.refreshToken().then(() => {
        jwtAuthAPI(originalRequest)
          .then()
          .catch((error) => {
            window.location.href = "/login?next=" + window.location.pathname;
          });
      });
    }
    return Promise.reject(error);
  }
);

export const JWTAuthAPI = {
  login: async (username, password) => {
    return axios.post("/dj-rest-auth/login/", {
      username: username,
      password: password,
    });
  },
  google_callback: (code) => {
    return axios.post("/dj-rest-auth/google/", { code: code }).then((res) => {
      const token = res.data.access;
      localStorage.setItem("token", token);
    });
  },
  refreshToken: async () => {
    return axios
      .post("/dj-rest-auth/token/refresh/", {}, { withCredentials: true })
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
    return jwtAuthAPI.post("/dj-rest-auth/logout/").then((res) => {
      console.log("Successfully logged out");
      localStorage.removeItem("token");
      window.location.href = "/discover";
    });
  },
};

export default JWTAuthAPI;
