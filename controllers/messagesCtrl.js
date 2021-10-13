  // Imports
  const models = require('../models');
  //const asyncLib = require('async');
  const jwtUtils = require('../utils/jwt.utils');

  // Constants
  const TITLE_LIMIT = 2;
  const CONTENT_LIMIT = 4;
  const ITEMS_LIMIT = 50;

  // Routes 
  module.exports = {
      //création d un message
      createMessage: function(req, res) {
          // Getting auth header
          const headerAuth = req.headers['authorization']; //vérification du token
          const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

          // Params


          const message = {
              title: req.body.title,
              content: req.body.content,
              urlmedia: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              UserId: userId,
              // attache: req.body.content && req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
          };

          models.Message.create(message)

          .then(() => res.status(201).json({ message: 'message enregistré !' }))
              .catch(function(err) {
                  res.status(500).json({ message: 'probleme  au niveau du serveur' });
                  console.log(err);
              });
      },



      /*


                if (title == null || content == null) {
                    return res.status(400).json({ 'error': 'Tous les champs doivent être remplis!' })
                }

                if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
                    return res.status(400).json({ 'error': 'le titre doit faire min 2 caractères et le message min 4 caractères!' })
                }

                asyncLib.waterfall([
                        function(done) {
                            //récupération de l'identifiant
                            models.User.findOne({
                                    where: { id: userId }
                                })
                                //si l'identifiant est présent dans la base
                                .then(function(userFound) {
                                    done(null, userFound);

                                })
                                //si il ne l est pas
                                .catch(function(err) {
                                    return res.status(500).json({ 'error': 'Impossible de vérifier l\' utilisateur!' });
                                });
                        },
                        function(userFound, done) {
                            //si l utilisateur existe
                            if (userFound) {
                                models.Message.create({
                                        title: title,
                                        content: content,
                                        likes: 0,
                                        userId: userFound.id //relation message -> identifiant
                                    })
                                    .then(function(newMessage) {
                                        done(newMessage);
                                    });
                            } else {
                                res.status(404).json({ 'error': 'L\'utilisateur n\' existe pas!' })
                            }
                        },
                    ],
                    function(newMessage) {
                        if (newMessage) {
                            return res.status(201).json(newMessage); //message posté
                        } else {
                            return res.status(500).json({ 'error': 'Le message n\'a pas été posté' });
                        }
                    });
            },*/
      listMessages: function(req, res) {
          let fields = req.query.fields; //champs à afficher
          let limit = parseInt(req.query.limit); //segmentation de la récupération des messages
          let offset = parseInt(req.query.offset); //segmentation de la récupération des messages
          let order = req.query.order; //affichage par rapport à un order particulier

          //on limite les nombre de messges affichés
          if (limit > ITEMS_LIMIT) {
              limit = ITEMS_LIMIT;
          }

          models.Message.findAll({ //recherche du message
              //controle de conformité
              order: [(order != null) ? order.split(':') : ['id', 'DESC']],
              attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
              limit: (!isNaN(limit)) ? limit : null,
              offset: (!isNaN(offset)) ? offset : null,
              include: [{
                  model: models.User,
                  attributes: ['username']
              }]
          }).then(function(messages) {
              if (messages) { //affichage des messages
                  res.status(200).json(messages);
              } else {
                  res.status(404).json({ "error": 'Messages non trouvés!' })
              }
          }).catch(function(err) {
              console.log(err);
              res.status(500).json({ "error": 'Champs invalides!' })
          });
      }
  };