import { getAuthAPI, getAuthAPIInstance } from "./Base";

const authAPI = getAuthAPIInstance();
const AuthAPI = getAuthAPI();

export const UserPreferenceAPI = {
  get() {
    try {
      return authAPI.get(`/api/user/preference`);
    } catch (err) {
      console.log(err);
    }
  },
  patch(id, payload) {
    try {
      return authAPI.patch(`/api/user/preference/${id}`, payload);
    } catch (err) {
      console.log(err);
    }
  },
};

export default UserPreferenceAPI;
