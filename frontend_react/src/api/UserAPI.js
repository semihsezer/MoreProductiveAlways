import { getAuthAPI, getAuthAPIInstance } from "./Base";

const authAPI = getAuthAPIInstance();
const AuthAPI = getAuthAPI();

export const UserAPI = {
  getProfile: () => {
    try {
      return authAPI.get(`/api/user/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  isLoggedIn: () => {
    return AuthAPI.isAuthenticated();
  },
};

export default UserAPI;
