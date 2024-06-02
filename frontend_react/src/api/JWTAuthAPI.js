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
      const token = await AuthAPI.refreshToken();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return authAPI(originalRequest);
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
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      return axios
        .post("/api/token/refresh", {
          refresh: refreshToken,
        })
        .then((res) => {
          const token = res.data.access;
          localStorage.setItem("token", token);
          return token;
        })
        .catch((error) => {
          console.error("Refresh token failed:", error);
        });
    } else {
      console.log("No refresh token found. Redirecting to login.");
      window.location.href = "/login";
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/discover";
  },
  onGoogleLogin: (response) => {
    axios
      .get("/complete/google-oauth2/", {
        clientId: response.clientId,
        credential: response.credential,
        provider: "google",
      })
      .then((response) => {
        // Handle successful login
        console.log(response);
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  },
};

export default authAPI;
