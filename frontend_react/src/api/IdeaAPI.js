import { getAuthAPIInstance } from "./Base";

const authAPI = getAuthAPIInstance();

export const IdeaAPI = {
  getIdeas: (status) => {
    try {
      return authAPI.get(`/api/idea?status=${status}`);
    } catch (err) {
      console.log(err);
    }
  },

  createIdea: (idea) => {
    // TODO: do this check on the backend side, throw error if empty
    try {
      if (idea.title.length > 0) {
        return authAPI.post("/api/idea", idea);
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateIdea: (idea) => {
    try {
      return authAPI.put(`/api/idea/${idea.id}`, idea);
    } catch (err) {
      console.log(err);
    }
  },

  deleteIdea: (idea) => {
    try {
      return authAPI.delete(`/api/idea/${idea.id}`);
      // TODO: catch error
    } catch (err) {
      console.log(err);
    }
  },
};
