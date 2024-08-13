import { getAuthAPIInstance } from "./Base";

const authAPI = getAuthAPIInstance();

export const UserShortcutAPI = {
  getAll: async (status) => {
    if (status) {
      return authAPI.get(`/api/user/shortcut?status=${status}`);
    } else {
      return authAPI.get(`/api/user/shortcut`);
    }
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

  patch: (userShortcutId, payload) => {
    try {
      return authAPI.patch(`/api/user/shortcut/${userShortcutId}`, payload);
    } catch (err) {
      console.log(err);
    }
  },

  delete: (userShortcutId) => {
    try {
      return authAPI.delete(`/api/user/shortcut/${userShortcutId}`);
    } catch (err) {
      console.log(err);
    }
  },

  discover: () => {
    try {
      return authAPI.get(`/api/discover/shortcut`);
    } catch (err) {
      console.log(err);
    }
  },
};
