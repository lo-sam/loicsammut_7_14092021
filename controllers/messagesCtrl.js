  // Imports
  const models = require('../models');
  const jwtUtils = require('../utils/jwt.utils');
  const fs = require('fs');

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
              urlmedia: req.body.urlmedia, //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              UserId: userId,
          };

          models.Message.create(message)

          .then(() => res.status(201).json({ message: 'message enregistré !' }))
              .catch(function(err) {
                  res.status(500).json({ message: 'probleme  au niveau du serveur' });
                  console.log(err);
              });
      },



      updateMessage: function(req, res) {
          const headerAuth = req.headers['authorization']; //vérification du token
          const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
          const messageObject = req.file ? {
              ...JSON.parse(req.body.message),
              urlmedia: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              UserID: userId
          } : {...req.body };
          if (req.file) { // On supprime l ancienne image
              models.Message.findOne({ _id: req.params.id })
                  .then((message) => {
                      const filename = message.urlmedia.split('/images/')[1];
                      fs.unlink(`images/${filename}`, () => {
                          modelsM.updateOne({ _id: req.params.id }, {...messageObject, _id: req.params.id })
                              .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                              .catch(error => res.status(400).json({ error: 'Impossible de modifier l\'objet' }));
                      });
                  });
          } else {
              models.Message.update({ _id: req.params.id }, {...messageObject, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                  .catch(error => res.status(400).json({ error: 'Impossible de modifier l\'objet' }));

          }
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
          console.log('findAll');;
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
      },




      deleteMessage: function(req, res) {
          models.Message.findOne({ where: { id: req.params.id } })
              .then(message => {
                  if (message) {
                      models.Message.deleteOne({ where: { id: req.params.id } })
                      res.then(() => res.status(200).json({ message: 'Message supprimé' }))
                  } else {
                      res.catch(error => res.status(400).json({ error: 'impossible de supprimer le message' }))
                  }
              });

      },


  };