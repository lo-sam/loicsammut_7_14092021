const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');

module.exports = {

    Like: function(req, res) {
        // Getting auth header
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
        const messageL = req.params.id;
        let likes = req.body.Likes;

        models.Likes.findOne({
            where: { UserId: userId, MessageId: messageL }
        }).then(function(messageLike) {
            if (messageLike) {
                models.Message.findOne({
                    where: { id: req.params.id }
                }).then(function(message) {
                    message.likes--;
                    message.update({
                        likes: (likes ? likes : message.likes)
                    }).then(function() {
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
                        console.log('pas ok pour dislike message');
                        res.status(500).json({ 'error': 'la mise à jour impossible :' + err });
                    });
                }).catch(function(err) {
                    res.status(404).json({ 'message': 'message pas trouvé ' + err });
                })
            } else {
                models.Message.findOne({
                    where: { id: req.params.id }
                }).then(function(message) {
                    message.likes++;
                    message.update({
                        likes: (likes ? likes : message.likes)
                    }).then(function() {
                        console.log('nombre de like: ' + message.likes);
                        const like = {
                            UserId: userId,
                            MessageId: messageL
                        }
                        models.Likes.create(like)
                            .then(function() {
                                res.status(200).json({ 'message': 'Message liké' })
                            })
                            .catch(function(err) {
                                res.status(500).json({ 'message': 'probleme  au niveau du serveur' });
                                console.log("if" + err);
                            });
                    }).catch(function(err) {
                        console.log('pas ok pour like message');
                        res.status(500).json({ 'error': 'Mise à jour impossible :' + err });
                    });
                })
            }

        }).catch(function(err) {
            console.log(err);
        })
    }
};