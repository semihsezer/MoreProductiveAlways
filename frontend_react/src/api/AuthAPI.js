import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const authAPI = axios.create({});
export const api = axios.create({});

// Add a response interceptor
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await AuthAPI.refreshToken();
        return authAPI(originalRequest);
      } catch (error) {
        window.location.href = "/login?next=" + window.location.pathname;
      }
    }
    return Promise.reject(error);
  }
);

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function getCSRFToken() {
  return getCookie("csrftoken");
}

export const AuthAPI = {
  logout: () => {
    return axios
      .post("/dj-rest-auth/logout/")
      .then((res) => {
        console.log("Successfully logged out");
        window.location.href = "/discover";
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/discover";
        } else {
          console.error("Logout failed:", error);
        }
      });
  },
  login: (username, password) => {
    return axios
      .post("/_allauth/browser/v1/auth/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.data && res.data.status === 200) {
          return res.data;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  },
  google_callback: (code) => {
    return axios.post("/dj-rest-auth/google/", { code: code });
  },
  refreshToken: async () => {
    return axios.post("/dj-rest-auth/token/refresh/");
  },
  isAuthenticated: () => {
    return axios
      .get("/dj-rest-auth/user/")
      .then((res) => {
        if (res.data && res.data.status === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
      });
  },
};

export default authAPI;
