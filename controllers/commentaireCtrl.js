const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');


module.exports = {
    //création d un message
    createCommentaire: function(req, res) {
        // Getting auth header
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        // Params
        const commentaire = {
            content: req.body.content,
            UserId: userId,
            MessageId: req.params.id,
        };

        models.Commentaire.create(commentaire)
            .then(() => res.status(201).json({ message: 'commentaire enregistré !' }))
            .catch(function(err) {
                res.status(500).json({ message: 'probleme au niveau du serveur' });
                console.log(err);
            });
    },

    oneCom: function(req, res) {
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
        if (req.params.userId = userId) {
            models.Commentaire.findOne({
                attributes: ['id', 'userId', 'messageId', 'content'],
                where: { id: req.params.id }
            }).then(function(com) {
                if (com) {
                    res.status(201).json(com);
                    console.log("ok pour le com");
                } else {
                    res.status(404).json({ 'error': 'commentaire non trouvé' });
                }
            }).catch(function(err) {
                console.log(err + "pas ok pour le com");
                return res.status(500).json({ 'error': 'impossible d\'accéder au com' });
            });
        }
    },


    findCommentaires: function(req, res) {
        models.Commentaire.findAll({ //recherche de commentaires
                where: {
                    MessageId: req.params.id
                },
                include: {
                    model: models.User,
                    required: true,
                    attributes: ["username", "userlastname", "profilpic"]
                },
                order: [
                    ["id", "DESC"]
                ]
            })
            .then(comments => { res.status(200).json(comments) })
            .catch(error => res.status(400).json({ error }))
    },

    modifCom: function(req, res) {
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        console.log("*********" + req.body.content);
        if (req.params.userId = userId) {
            //Params
            asyncLib.waterfall([
                function(done) {
                    models.Commentaire.findOne({
                        attributes: ['id', 'userId', 'messageId', 'content'],
                        where: { id: req.params.id },
                        // include: models.Message
                    }).then(function(com) {
                        done(null, com);
                        console.log("ok pour le com");
                    }).catch(function(err) {
                        console.log(err + "pas ok pour le com");
                        return res.status(500).json({ 'error': 'Impossible d\'accéder au com' });
                    });
                },
                function(com, done) {
                    let content = req.body.content;
                    if (com) {
                        com.update({
                            content: (content ? content : com.content)
                        }).then(function() {
                            done(com);
                            console.log("ok pour modif com");
                        }).catch(function(err) {
                            console.log("pas ok pour modif com");
                            res.status(500).json({ 'error': 'mise a jour impossible' });
                        });
                    } else {
                        res.status(404).json({ 'error': 'le com n\'a pas été trouvé' });
                    }
                },
            ], function(com) {
                if (com) {
                    return res.status(201).json(com);
                } else {
                    return res.status(500).json({ 'error': 'Impossible de mettre le com à jour' });
                }
            });
        } else {
            return res.status(400).json({ 'error': 'utilisateur non autorisé' });
        }
    },

    deleteCom: function(req, res) {
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        if (req.params.userId = userId) {
            models.Commentaire.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: "Commentaire supprimé !" }))
                .catch(error => res.status(400).json({ error }))
        }
    }


};