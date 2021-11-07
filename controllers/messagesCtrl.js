  // Imports
  const models = require('../models');
  const jwtUtils = require('../utils/jwt.utils');
  const fs = require('fs');
  const asyncLib = require('async');



  // Routes 
  module.exports = {
      //création d un message
      createMessage: (req, res) => {
          // Getting auth header
          const headerAuth = req.headers['authorization']; //vérification du token
          const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData


          // Params
          const message = { // On créé un objet message
              title: req.body.title,
              content: req.body.content,
              urlmedia: req.body.urlmedia, //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              UserId: userId
          };

          models.Message.create(message)
              .then(() => res.status(201).json({ message: 'message enregistré !' }))
              .catch(function(err) {
                  res.status(500).json({ message: 'probleme  au niveau du serveur' });
                  console.log(err);
              });
      },

      //trouver un message
      oneMessage: function(req, res) {
          let fields = req.query.fields; //champs à afficher
          const headerAuth = req.headers['authorization']; //vérification du token
          const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
          if (req.params.userId = userId) {
              models.Message.findOne({ // On cherche le message grace à son id
                  where: { id: req.params.id },
                  attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                  include: models.User,
              }).then(function(message) {
                  if (message) {
                      res.status(201).json(message);
                      console.log("ok pour le message");
                  } else {
                      res.status(404).json({ 'error': 'Message non trouvé!' });
                  }
              }).catch(function(err) {
                  console.log(err + "pas ok pour le message");
                  return res.status(500).json({ 'error': 'Impossible d\'accéder au message' });
              });
          }
      },

      //modification des messages
      updateMessage: function(req, res) {
          const headerAuth = req.headers['authorization']; //vérification du token
          const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData
          let fields = req.query.fields; //champs à afficher


          if (req.params.userId = userId) {

              // Params

              let title = req.body.title;
              let content = req.body.content;
              let urlmedia = req.body.urlmedia; //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

              asyncLib.waterfall([
                  function(done) {
                      models.Message.findOne({ // on récupère le message
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
                          messageFound.update({ //on modifie les champs du message trouvé
                              title: (title ? title : messageFound.title),
                              content: (content ? content : messageFound.content),
                              urlmedia: (urlmedia ? urlmedia : messageFound.urlmedia)
                          }).then(function() {
                              done(messageFound);
                              console.log('ok pour modif message');
                          }).catch(function(err) {
                              console.log('pas ok pour modif message');
                              res.status(500).json({ 'error': 'Mise à jour impossible' });
                          });
                      } else {
                          res.status(404).json({ 'error': 'Le message n\'a pas été trouvé' });
                      }
                  },
              ], function(messageFound) {
                  if (messageFound) { // On applique la mise à jour
                      return res.status(201).json(messageFound);
                  } else {
                      return res.status(500).json({ 'error': 'Impossible de mettre le message à jour' })
                  }
              });
          } else {
              return res.status(400).json({ 'error': 'utilisateur non autorisé' })
          }
      },



      //récupération des messages
      listMessages: function(req, res) {
          let fields = req.query.fields; //champs à afficher
          let order = req.query.order; //affichage par rapport à un order particulier

          console.log('findAll');;
          models.Message.findAll({ //recherche du message
              //controle de conformité
              order: [(order != null) ? order.split(':') : ['id', 'DESC']],
              attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
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
          const headerAuth = req.headers['authorization']; //vérification du token
          const userId = jwtUtils.getUserId(headerAuth); //vérification du userId correspondant au pass avec le userData

          if (req.params.userId = userId) {
              models.Message.destroy({ where: { id: req.params.id } }) //on récupère l'id du message
                  .then(() => res.status(200).json({ message: "Message supprimé !" }))
                  .catch(error => res.status(400).json({ error }))
          }
      }

  };