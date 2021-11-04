const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');



module.exports = {

    Like: function(req, res) {
        // Getting auth header
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
        const message = req.params.id;

        const user = models.Likes.findOne({
            where: { UserId: userId, MessageId: message }
        });

        if (user) {
            models.Likes.destroy({
                    where: { UserId: userId, MessageId: message }
                })
                .then(() => res.status(200).json({ 'message': 'Like annulé' }))
                .catch(function(err) {
                    res.status(500).json({ message: 'probleme  au niveau du serveur' });
                    console.log("if" + err);
                });
        } else {
            models.Likes.create({ UserId: userId, MessageId: message })
                .then(() => res.status(201).json({ 'message': 'Message liké' }))
                .catch(function(err) {
                    res.status(500).json({ message: 'probleme  au niveau du serveur' });
                    console.log("else" + err);
                })
        }
    }
};