import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const IdeaAPI = {
  getIdeas: (status) => {
    try {
      return axios.get(`/api/user/idea?status=${status}`);
    } catch (err) {
      console.log(err);
    }
  },

  createIdea: (idea) => {
    // TODO: do this check on the backend side, throw error if empty
    try {
      if (idea.title.length > 0) {
        return axios.post("/api/user/idea", idea);
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateIdea: (idea) => {
    try {
      return axios.put(`/api/user/idea/${idea.id}`, idea);
    } catch (err) {
      console.log(err);
    }
  },

  deleteIdea: (idea) => {
    try {
      return axios.delete(`/api/user/idea/${idea.id}`);
      // TODO: catch error
    } catch (err) {
      console.log(err);
    }
  },
};
