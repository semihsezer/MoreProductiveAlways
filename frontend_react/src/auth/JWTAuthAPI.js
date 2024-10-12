import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    return axios.post("/api/dj-rest-auth/login/", {
      username: username,
      password: password,
    });
  },
  signup: async (email, password1, password2) => {
    return axios.post("/api/dj-rest-auth/registration/", {
      username: email,
      email: email,
      password1: password1,
      password2: password2,
    });
  },
  googleCallback: (code) => {
    return axios.post("/api/dj-rest-auth/google/", { code: code }).then((res) => {
      const token = res.data.access;
    });
  },
  refreshToken: async () => {
    return axios
      .post("/api/dj-rest-auth/token/refresh/", {}, { withCredentials: true })
      .then((res) => {
        const token = res.data.access;
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
      window.location.href = "/discover";
    });
  },
};

export default JWTAuthAPI;
