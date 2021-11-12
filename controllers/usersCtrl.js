const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

const User = models.user;
const jwt = require('jsonwebtoken');

const asyncLib = require('async');
const fs = require('fs');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{8,20}$/;

//routes
module.exports = {

    //Enregistrement d un utilisateur
    register: (req, res) => {

        const email = req.body.email;
        const username = req.body.username;
        const userlastname = req.body.userlastname;
        const password = req.body.password;
        const bio = req.body.bio;
        const profilpic = `${req.protocol}://${req.get('host')}/images/profil.png`;

        //vérification des champs requis
        if (email == null || username == null || userlastname == null || password == null) {
            return res.status(400).json({ 'error': 'paramètres manquants!' });
        }
        //verification des champs remplis
        //longueur du nom
        if ((username.length >= 13 || username.length <= 2) && (userlastname.length >= 13 || userlastname.length <= 2)) {
            return res.status(400).json({ 'error': 'Nom d\' utilisateur incorrect : il doit y avoir entre 3 et 12 caractères.' });
        }
        //caractères du mail conforme au REGEX
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'L\'email n\' est pas valide!' })
        }
        //caractères et longueur du password conforme au REGEX
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'Le mot de passe non valide : il doit comporter entre 8 et 20 caractères et inclure un chiffre.' })
        }

        //exécuter des fonction en cascade
        asyncLib.waterfall([
            function(done) {
                //vérification de la présence de l'utilisateur dans la BD
                models.User.findOne({
                        attributes: ['email'],
                        where: { email: email }
                    })
                    .then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Impossible de vérifier si l\' utilisateur existe!' });
                    });
            },
            function(userFound, done) {
                //si l'utilisateur n'existe pas, hasher le mot de passe
                if (!userFound) {
                    bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                    //sinon retourner l'erreur suivante
                } else {
                    return res.status(409).json({ 'error': 'l\'utilisateur existe déjà!' });
                }
            },
            function(userFound, bcryptedPassword, done) {
                //création d'un nouvel utilisateur
                const NewUser = models.User.create({
                        email: email,
                        username: username,
                        userlastname: userlastname,
                        password: bcryptedPassword,
                        bio: bio,
                        profilpic: profilpic,
                        isAdmin: 0
                    })
                    .then(function(newUser) {
                        return res.status(201).json({
                            'userId': newUser.id
                        })
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Impossible d\' ajouter l\' utilisateur!' });
                    });
            }
        ], function(newUser) {
            //si l'utilisateur n'existe pas
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
                //si il existe déjà
            } else {
                return res.status(500).json({ 'error': 'Impossible d\' ajouter l\' utilisateur!' });
            }
        });
    },

    //connexion de l'utilisateur
    login: function(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        //vérification des champs requis
        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'paramètres manquants!' });
        }

        //exécuter des fonction en cascade
        asyncLib.waterfall([
            function(done) {
                //vérification de la présence de l'utilisateur dans la BD
                models.User.findOne({
                        where: { email: email }
                    })
                    .then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        res.status(500).json({ 'error': 'Impossible de vérifier l\' utilisateur' });
                    });
            },
            function(userFound, done) {
                //si il existe
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                    //si il n existe pas
                } else {
                    return res.status(404).json({ 'error': 'L\' utilisateur n\' existe pas dans la base de donnée!' });
                }
            },
            function(userFound, resBycrypt, done) {
                //si le mot de passe est correct
                if (resBycrypt) {
                    done(userFound);
                    //si le mot de passe est incorrect
                } else {
                    return res.status(403).json({ 'error': 'Mot de passe invalide!' });
                }
            }
        ], function(userFound) {
            //connexion de l'utilisateur
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
                //impossible de se connecter
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },

    getUserProfile: function(req, res) {
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        if (userId < 0) //si userId à -1 c'est que le token n'a pas été vérifié
            return res.status(400).json({ 'error': 'Mauvais Token' });

        //récupération de l'utilisateur
        models.User.findOne({
            attributes: ['id', 'email', 'username', 'userlastname', 'bio', 'profilpic', 'isAdmin'],
            where: { id: userId } //les infos de l'id correspondant à l' userId du token
        }).then(function(user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'L\' utilisateur n\'a pas été trouvé!' });
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'Impossible d\' accéder à l\'utilisateur' });
        });
    },
    //mise à jour de l'utilisateur
    updateUserProfile: function(req, res) {
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        let bio = req.body.bio;
        let profilpic = req.body.profilpic; //`${req.protocol}://${req.get('host')}/images/${req.body.file.filename}`;

        asyncLib.waterfall([
            function(done) {
                //récupération de l'utilisateur
                models.User.findOne({
                        attributes: ['id', 'bio', 'profilpic'],
                        where: { id: userId } //les infos de l'id correspondant à l' userId du token
                    }).then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Impossible d\' accéder à l\'utilisateur' });
                    });
            },
            function(userFound, done) {
                //si l'utilisateur est valide
                if (userFound) {
                    userFound.update({
                        //si la nouvel bio est valide elle est alors remplacée, sinon l'ancienne reste dans la base de donnée
                        bio: (bio ? bio : userFound.bio),
                        profilpic: (profilpic ? profilpic : userFound.profilpic)
                    }).then(function() {
                        done(userFound);
                    }).catch(function(err) {
                        res.status(500).json({ 'error': 'Mise à jour impossible!' });
                    });
                    //si l'utilisateur n est pas valide
                } else {
                    res.status(404).json({ 'error': 'L\' utilisateur n\'a pas été trouvé!' });
                }
            },
        ], function(userFound) {
            //si le user est trouvé la mise à jour est appliquée
            if (userFound) {
                return res.status(201).json(userFound);
                //sinon la mise à jour échoue
            } else {
                return res.status(500).json({ 'error': 'Impossible de mettre le profile à jour!' });
            }
        });
    },

    deleteProfil: function(req, res) {
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        models.User.findOne({
            attributes: ['id', 'email', 'username', 'userlastname', 'bio', 'profilpic'],
            where: { id: userId } //les infos de l'id correspondant à l' userId du token
        }).then(function(user) {
            if (user) {
                models.User.destroy({ where: { id: userId } })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé' }))
                    .catch(error => res.status(400).json({ error }))
            } else {
                res.status(404).json({ 'error': 'L\' utilisateur n\'a pas été trouvé!' });
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'Impossible d\' accéder à l\'utilisateur' });
        });

    }

};