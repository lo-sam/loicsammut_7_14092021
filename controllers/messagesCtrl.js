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
              urlmedia: req.body.content && req.file,
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


      deleteMessage: function(req, res) {
          models.Message.findOne({ where: { id: id } })
              .then(message => {
                  Message.deleteOne({ where: { id: id } })
                      .then(() => res.status(200).json({ message: 'Message supprimé' }))
                      .catch(error => res.status(400).json({ error: 'impossible de supprimer le message' }))
              });
      },



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
              include: models.User

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