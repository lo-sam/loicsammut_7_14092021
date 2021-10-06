import { createStore } from 'vuex'

const axios = require('axios');
const instance = axios.create({
    baseURL: 'http://localhost:8080/api/'
});

const store = createStore({

    state: {
        status: '',
        user: {
            userId: -1,
            token: '',
        },
    },
    mutations: {
        setStatus: function(state, status) {
            state.status = status;
        },
        logUser: function(state, user) {
            state.user = user;
        }
    },
    actions: {
        connexion: ({ commit }, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                instance.post('/users/login', userInfos)
                    .then(function(response) {
                        commit('setStatus', '');
                        commit('logUser', response.data);
                        resolve(response);
                    }).catch(function(err) {
                        commit('setStatus', 'error_login');
                        reject(err);
                    });
            })
        },
        inscription: ({ commit }, userInfos) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/users/register', userInfos)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response);
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });
            })
        }

    }
})

export default store;