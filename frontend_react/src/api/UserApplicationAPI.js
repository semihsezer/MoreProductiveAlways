import { getAuthAPIInstance } from "./Base";

const authAPI = getAuthAPIInstance();

export const UserApplicationAPI = {
  getAll: async (status) => {
    if (status === "unsaved") {
      return authAPI.get(`/api/user/application?status=unsaved`);
    } else if (status === "all") {
      return authAPI.get(`/api/user/application?status=all`);
    } else {
      return authAPI.get(`/api/user/application`);
    }
  },

  create: (applicationId) => {
    const payload = { application: applicationId };
    try {
      return authAPI.post("/api/user/application", payload);
    } catch (err) {
      console.log(err);
    }
  },
  delete: (userApplicationId) => {
    try {
      return authAPI.delete(`/api/user/application/${userApplicationId}`);
    } catch (err) {
      console.log(err);
    }
  },
};
