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
        upMessage: [],
        deleteMessage: '',
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
        message: function(state, message) {
            state.message = message;
        },
        upMessage: function(state, upMessage) {
            state.upMessage = upMessage;
        },
        listeCommentaires: function(state, listeCommentaires) {
            state.listeCommentaires = listeCommentaires;
        },
        deleteMessage: function(state, deleteMessage) {
            state.deleteMessage = deleteMessage;
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


        getOneMessage: ({ commit }) => {
            instance.get('/message/:id')
                .then(function(response) {
                    commit('listeMessage', response.data);
                })
                .catch(function() {});
        },

        message: ({ commit }, listeMessage) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/message/new', listeMessage)
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
                instance.put('/message/modif/:id', listeMessage)
                    .then(function(response) {
                        console.log('message modifié');
                        commit('setStatus', 'created');
                        resolve(response)
                    }).catch(function(err) {
                        console.log('message non modifié');
                        commit('setStatus', 'error_create');
                        reject(err);
                    });

            })
        },


        deleteMessage: ({ commit }) => {
            instance.delete('/message/delete/:id')
                .then(function(response) {
                    console.log('then avant commit');
                    commit('setStatus', 'deleted');
                    console.log(response);
                }).catch(function(err) {
                    console.log(err + 'catch avant commit');
                    commit('setStatus', 'error_deleted');
                });
        },

    }
})

export default store;