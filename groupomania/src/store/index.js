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
            profilpic: '',
            isAdmin: ''
        },
        listeMessage: [],
        message: {},
        listeCommentaires: [],
        commentaire: {},
        emojis: [
            { id: 1, name: '😀' },
            { id: 2, name: '😁' },
            { id: 3, name: '🤣' },
            { id: 4, name: '😉' },
            { id: 5, name: '😍' },
            { id: 6, name: '😗' },
            { id: 7, name: '😋' },
            { id: 8, name: '🤐' },
            { id: 9, name: '😴' },
            { id: 10, name: '😱' },
            { id: 11, name: '😤' },
            { id: 12, name: '😡' },
            { id: 13, name: '👌' },
            { id: 14, name: '👍' },
            { id: 15, name: '👎' },
            { id: 16, name: '👏' },
            { id: 17, name: '🙏' },
            { id: 18, name: '🧑‍💻' },
            { id: 19, name: '🧑‍🎨' },
            { id: 20, name: '🧑‍✈️' },
            { id: 21, name: '🎅' },
            { id: 22, name: '🧑‍🎄' },
            { id: 23, name: '🎃' },
            { id: 24, name: '🌂' },
            { id: 25, name: '🦸' }
        ]
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
        modifMessage: function(state, id, message) {
            Object.assign(state.listeMessage.find(el => el.id === id), message);
        },
        listeCommentaires: function(state, listeCommentaires) {
            state.listeCommentaires = listeCommentaires;
        },
        commentaire: function(state, commentaire) {
            state.commentaire = commentaire;
        },
        modifCom: function(state, id, commentaire) {
            Object.assign(state.listeCommentaires.find(el => el.id === id), commentaire);
        },
        like: function(state, Likes) {
            state.Likes = Likes;
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
        //ACTION USERS
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
                        console.log('User non trouvé :' + err)
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
        deleteUser: ({ commit }, userInfos) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.delete('/users/me/delete/', userInfos)
                    .then(function(response) {
                        commit('setStatus', 'deleted');
                        resolve(response);
                        document.location.reload();
                        console.log('Compte supprimé avec succès!')
                    }).catch(function(err) {
                        console.log(err + 'catch avant commit');
                        commit('setStatus', 'error_deleted');
                        reject(err);
                    });
            })
        },
        //ACTION MESSAGES
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
        getOneMessage: ({ commit }, id) => {
            instance.get('/message/' + id)
                .then((response) => {
                    commit('message', response.data);

                    console.log(response.data)
                })
                .catch(function() {});
        },
        message: ({ commit }, listeMessage) => {
            return new Promise((resolve, reject) => {
                commit;
                console.log(listeMessage);
                instance.post('/message/new', listeMessage, listeMessage.User)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response);
                        // document.location.reload();
                        console.log('Message créé avec succès!', response)
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });
            })
        },
        updateMessage: ({ commit }, modifMessage) => {
            return new Promise((resolve, reject) => {
                commit;
                console.log("modifmessage: " + modifMessage.message.title);
                instance.put('/message/modif/' + modifMessage.id, modifMessage.message)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response)
                        console.log('Message modifié avec succès: ', response.data);
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                        console.log('message non modifié');
                    });
            })
        },
        deleteMessage: ({ commit }, id) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.delete('/message/delete/' + id)
                    .then(function(response) {
                        commit('setStatus', 'deleted');
                        resolve(response);
                        document.location.reload();
                        console.log('Message supprimé avec succès!')
                    }).catch(function(err) {
                        console.log(err + 'catch avant commit');
                        commit('setStatus', 'error_deleted');
                        reject(err);
                    });
            })
        },
        //ACTION COMMENTAIRES
        getListeCom: ({ commit }, id) => {
            instance.get('/message/commentaires/' + id)
                .then((response) => {
                    commit('listeCommentaires', response.data.map((commentaire) => {
                        return {
                            ...commentaire
                        }
                    }));
                })
                .catch(function() {
                    console.log('pas ok');
                });
        },

        commentaire: ({ commit }, commentaire) => {
            return new Promise((resolve, reject) => {
                commit;
                console.log('Commentaire: ', commentaire);
                instance.post('/message/commentaire/' + commentaire.messageId, commentaire)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response);
                        console.log('com ajouté avec succès: ', response.data);
                        document.location.reload();
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });
            })
        },
        updateCom: ({ commit }, modifCom) => {
            return new Promise((resolve, reject) => {
                commit;
                console.log("modifCom: ", modifCom.commentaire.content);
                instance.put('/message/commentaire/modif/' + modifCom.id, modifCom.commentaire)
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response)
                        console.log('Commentaire modifié avec succès!', response.data);
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                        console.log('Commentaire non modifié');
                    });
            })
        },

        deleteCom: ({ commit }, id) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.delete('/message/commentaire/delete/' + id)
                    .then(function(response) {
                        commit('setStatus', 'deleted');
                        resolve(response);
                        document.location.reload();
                        console.log('Message supprimé avec succès!')
                    }).catch(function(err) {
                        console.log(err + 'catch avant commit');
                        commit('setStatus', 'error_deleted');
                        reject(err);
                    });
            })
        },

        //ACTION LIKES
        like: ({ commit }, Likes) => {
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/message/' + Likes + '/like')
                    .then(function(response) {
                        commit('setStatus', 'created');
                        resolve(response);
                        console.log('like ok');
                    }).catch(function(err) {
                        commit('setStatus', 'error_create');
                        reject(err);
                    });
            })
        }
    }
})

export default store;