import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const UserShortcutAPI = {
  getAll: () => {
    try {
      return axios.get(`/api/user/shortcut`);
    } catch (err) {
      console.log(err);
    }
  },

  create: (userShortcut) => {
    const payload = {
      shortcut_id: userShortcut.shortcut_id,
      status: userShortcut.status,
    };
    try {
      return axios.post("/api/user/shortcut", payload);
    } catch (err) {
      console.log(err);
    }
  },

  update: (userShortcut) => {
    try {
      return axios.put(`/api/user/shortcut`, userShortcut);
    } catch (err) {
      console.log(err);
    }
  },

  delete: (userShortcutId) => {
    const payload = { data: { ids: [userShortcutId] } };
    try {
      return axios.delete(`/api/user/shortcut`, payload);
    } catch (err) {
      console.log(err);
    }
  },
};
