const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');




module.exports = {

    Like: function(req, res) {
        // Getting auth header
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
        const messageL = req.params.id;
        const userL = models.Likes.findOne({
            where: { UserId: userId, MessageId: messageL }
        });

        asyncLib.waterfall([
            function(done) {
                models.Message.findOne({ // on récupère le message
                    attributes: ['id', 'title', 'content', 'urlmedia', 'userId'],
                    where: { id: req.params.id }
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
                    if (userL) {
                        messageFound.update({ $inc: { Likes: -1 } })
                        models.Likes.destroy({
                                where: { UserId: userId, MessageId: messageL },
                            })
                            .then(function() {
                                done(messageFound);
                                res.status(200).json({ 'message': 'Like annulé' })
                            })
                            .catch(function(err) {
                                res.status(500).json({ message: 'probleme  au niveau du serveur' });
                                console.log("if" + err);
                            });
                    } else {
                        models.message.update({ $inc: { Likes: +1 } })
                        models.Likes.create({ UserId: userId, MessageId: messageL })
                            .then(function() {
                                done(messageFound);
                                res.status(201).json({ 'message': 'Message liké' })
                            }).catch(function(err) {
                                res.status(500).json({ message: 'probleme  au niveau du serveur' });
                                console.log("else" + err);
                            });
                    }
                } else {
                    res.status(404).json({ 'error': 'Le message n\'a pas été trouvé' });
                }
            }
        ])
    }
};