import { api } from "./AuthAPI";

export const ShortcutAPI = {
  getAll: () => {
    try {
      return api.get(`/api/shortcut`);
    } catch (err) {
      console.log(err);
    }
  },
};
