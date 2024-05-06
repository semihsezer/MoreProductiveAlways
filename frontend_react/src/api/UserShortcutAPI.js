import { AuthAPI } from "./AuthAPI";
import authAPI from "./AuthAPI";

export const UserShortcutAPI = {
  getAll: async () => {
    return authAPI.get(`/api/user/shortcut`);
  },

  create: (userShortcut) => {
    const payload = {
      shortcut_id: userShortcut.shortcut_id,
      status: userShortcut.status,
    };
    try {
      return authAPI.post("/api/user/shortcut", payload);
    } catch (err) {
      console.log(err);
    }
  },

  update: (userShortcut) => {
    try {
      return authAPI.put(`/api/user/shortcut`, userShortcut);
    } catch (err) {
      console.log(err);
    }
  },

  delete: (userShortcutId) => {
    const payload = { data: { ids: [userShortcutId] } };
    try {
      return authAPI.delete(`/api/user/shortcut`, payload);
    } catch (err) {
      console.log(err);
    }
  },
};
