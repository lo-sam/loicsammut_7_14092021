import { createStore } from 'vuex'
const axios = require('axios');
const instance = axios.create({
    baseURL: 'http://localhost:8080/api/'
});


let user = localStorage.getItem('user');

if (!user) {
    user = {
        userId: -1,
        token: '',
    };
} else {
    try {
        user = JSON.parse(user);
        instance.defaults.headers.common['Authorization'] = user.token;
    } catch (ex) {
        user = {
            userId: -1,
            token: '',
        };

    }

}
const store = createStore({

    state: {
        status: '',
        user: user,
        userInfos: {
            username: '',
            userlastname: '',
            email: '',
            bio: '',
            profilpic: ''
        },
        listeMessage: [],
        listeCommentaires: [],
    },
    mutations: {
        setStatus: function(state, status) {
            state.status = status;
        },
        logUser: function(state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        userInfos: function(state, userInfos) {
            state.userInfos = userInfos;
        },
        listeMessage: function(state, listeMessage) {
            state.listeMessage = listeMessage;
        },
        listeCommentaires: function(state, listeCommentaires) {
            state.listeCommentaires = listeCommentaires;
        },
        deconnexion: function(state) {
            state.user = {
                userId: -1,
                token: '',
            }
            localStorage.removeItem('user');
            document.location.reload();
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
        },
        getUserInfos: ({ commit }) => {
            instance.get('/users/me')
                .then(function(response) {
                    commit('userInfos', response.data);
                })
                .catch(function() {});
        },
        updateUserInfos: ({ commit }, userInfos) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.put('/users/me', userInfos)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response)
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });

            })
        },
        getListeMessage: ({ commit }) => {
            instance.get('/messages')
                .then((response) => {
                    commit('listeMessage', response.data.map((message) => {
                        return {
                            ...message
                        }
                    }));
                })
                .catch(function() {
                    console.log('pas ok');
                });
        },
        message: ({ commit }, listeMessage) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/messages/new', listeMessage)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response);
                        document.location.reload();
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });
            })
        },
        updateMessage: ({ commit }, listeMessage) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.put('/messages/modif', listeMessage)
                    .then(function(response) {
                        commit('setStatus', 'modify');
                        resolve(response)
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });

            })
        },


        deleteMessage: ({ commit }) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.delete('/messages/')
                    .then(function(response) {
                        commit('setStatus', 'deleted');
                        resolve(response);
                        document.location.reload();
                    }).catch(function(err) {
                        commit('setStatus', 'error_deleted');
                        reject(err);
                    });
            })
        },
        /*
                getListeCom: ({ commit }) => {
                    instance.get('/messages/com')
                        .then(function(response) {
                            commit('listeCommentaires', response.data);
                            console.log(response.data);
                        })
                        .catch(function() {});
                },
        */

    }
})

export default store;