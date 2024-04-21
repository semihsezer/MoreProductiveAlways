import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const ShortcutAPI = {
  getAll: () => {
    try {
      return axios.get(`/api/shortcut`);
    } catch (err) {
      console.log(err);
    }
  },
};
