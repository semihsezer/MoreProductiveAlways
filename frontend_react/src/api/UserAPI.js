import authAPI from "./AuthAPI";
import { AuthAPI } from "./AuthAPI";

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
