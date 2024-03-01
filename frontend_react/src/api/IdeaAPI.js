import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const IdeaAPI = {

    getIdeas: (status) => {
        try {
            let payload = {};
            if (status != null){
                payload = {status: status};
            }

            return axios.get(`/api/user/ideas`, 
                {
                    params: payload
                }
            )
        } catch (err) {
            console.log(err);
        }
    },

    createIdea: (idea) => {
        // TODO: do this check on the backend side, throw error if empty
        try {
            if (idea.title.length > 0){
                return axios.post('/api/user/ideas', idea);
            }
        } catch (err) {
            console.log(err);
        }
    },

    updateIdea: (idea) => {
        try {
            return axios.put(`/api/user/ideas`, idea)
        } catch (err) {
            console.log(err);
        }
    },

    deleteIdea: (idea) => {
        const payload = { data: {ids: [idea.id] }};
        try {
            return axios.delete(`/api/user/ideas`, payload)
            // TODO: catch error
        } catch (err) {
            console.log(err);
        }
    }
}