import { api } from "./Base";

export const ShortcutAPI = {
  getAll: () => {
    try {
      return api.get(`/api/shortcut`);
    } catch (err) {
      console.log(err);
    }
  },
};
