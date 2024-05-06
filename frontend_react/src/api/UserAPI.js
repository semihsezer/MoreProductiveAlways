import authAPI from "./AuthAPI";

export const UserAPI = {
  getProfile: () => {
    try {
      return authAPI.get(`/api/user/profile`);
    } catch (err) {
      console.log(err);
    }
  },
};

export default UserAPI;
