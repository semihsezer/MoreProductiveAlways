import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const authAPI = axios.create({});
export const api = axios.create({});

// Add a response interceptor
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const unauthenticatedError = "Authentication credentials were not provided.";
    if (error.response.status === 403 && error.response.data && error.response.data.detail === unauthenticatedError) {
      window.location.href = "/login?next=" + window.location.pathname;
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
    //docs.allauth.org/_allauth/{client}/v1/auth/session
    return axios
      .delete("/_allauth/browser/v1/auth/session")
      .then((res) => {
        // Django AllAuth sends 401 for successful logout - weird I know
        console.error("Logout failed:", res);
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
  isAuthenticated: () => {
    return axios
      .get("/_allauth/browser/v1/auth/session")
      .then((res) => {
        if (res.data && res.data.status === 200 && res.data.meta.authenticated === true) {
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
