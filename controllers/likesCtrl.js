const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');




module.exports = {

    Like: function(req, res) {
        // Getting auth header
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
        const messageL = req.params.id;
        let fields = req.query.fields; //champs à afficher
        const userLike = models.Likes.findOne({
            where: { UserId: userId, MessageId: messageL }
        });
        let likes = req.body.likes;
        if (req.params.userId = userId) {
            asyncLib.waterfall([
                function(done) {
                    models.Message.findOne({
                        where: { id: req.params.id },
                        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                        include: models.User
                    }).then(function(messageFound) {
                        done(null, messageFound);
                        console.log("ok pour le message");
                    }).catch(function(err) {
                        console.log(err + "pas ok pour le message");
                        return res.status(500).json({ 'error': 'Impossible d\'accéder au message' });
                    });
                },
                function(messageFound, done) {
                    if (messageFound) {
                        if (userLike) {
                            messageFound.update({
                                likes: --likes
                            }).then(function() {
                                done(messageFound);
                                console.log(typeOf(likes));
                                models.Likes.destroy({
                                        where: { UserId: userId, MessageId: messageL },
                                    })
                                    .then(function() {
                                        res.status(200).json({ 'message': 'Like annulé' })
                                    })
                                    .catch(function(err) {
                                        res.status(500).json({ 'message': 'probleme  au niveau du serveur' });
                                        console.log('problème dislike: ' + err);
                                    });
                            }).catch(function(err) {
                                console.log(typeof likes);

                                console.log('pas ok pour dislike message');
                                res.status(500).json({ 'error': 'Mise à jour impossible :' + err });
                            });
                        } else {
                            messageFound.update({
                                likes: ++likes
                            }).then(function() {
                                done(messageFound);
                                console.log(messageFound.likes);
                                models.Likes.create({
                                        where: { UserId: userId, MessageId: messageL },
                                    })
                                    .then(function() {
                                        res.status(200).json({ 'message': 'Message liké' })
                                    })
                                    .catch(function(err) {
                                        res.status(500).json({ 'message': 'probleme  au niveau du serveur' });
                                        console.log("if" + err);
                                    });
                            }).catch(function(err) {
                                console.log('ok pour like message');
                                res.status(500).json({ 'error': 'Mise à jour impossible :' + err });
                            });
                        }
                    } else {
                        res.status(404).json({ 'error': 'Le message n\'a pas été trouvé' });
                    }
                },
            ], function(messageFound) {
                if (messageFound) { // On applique le like
                    return res.status(201).json(messageFound);
                } else {
                    return res.status(500).json({ 'error': 'Impossible d\'appliquer le like' })
                }
            });
        }
    }
};