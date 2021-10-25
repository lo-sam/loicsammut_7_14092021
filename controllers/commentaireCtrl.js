const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');

module.exports = {
    //création d un message
    createCommentaire: function(req, res) {
        // Getting auth header
        const headerAuth = req.headers['authorization']; //vérification du token
        const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

        // Params
        const commentaire = {
            UserId: userId,
            messageId: req.messages.id,
            content: req.body.content
        };

        models.commentaire.create(commentaire)

        .then(() => res.status(201).json({ message: 'commentaire enregistré !' }))
            .catch(function(err) {
                res.status(500).json({ message: 'probleme  au niveau du serveur' });
                console.log(err);
            });
    },

    findCommentaires: function(req, res) {
        models.commentaire.findAll({ //recherche de commentaires
            include: models.Messages

        }).then(function(commentaires) {
            if (commentaires) { //affichage des commentaires
                res.status(200).json(commentaires);
            } else {
                res.status(404).json({ "error": 'commentaires non trouvés!' })
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ "error": 'Champs invalides!' })
        });
    }



};