const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/usersCtrl');
const messagesCtrl = require('../controllers/messagesCtrl');
const commentaireCtrl = require('../controllers/commentaireCtrl');
const multer = require('../middleware/multer-config');

//routes


//Users routes
router.post('/users/register/', usersCtrl.register);
router.post('/users/login/', usersCtrl.login);
router.get('/users/me/', usersCtrl.getUserProfile);
router.put('/users/me/', multer, usersCtrl.updateUserProfile);
router.delete('/users/me/delete/', usersCtrl.deleteProfil);

//Messages routes
router.post('/message/new/', multer, messagesCtrl.createMessage);
router.get('/messages/', messagesCtrl.listMessages);
router.get('/message/:id', messagesCtrl.oneMessage);
router.delete('/message/delete/:id', messagesCtrl.deleteMessage);
router.put('/message/modif/:id', multer, messagesCtrl.updateMessage);

//Commentaires routes
router.post('/message/commentaire/:id', commentaireCtrl.createCommentaire);
router.get('/message/commentaires/:id', commentaireCtrl.findCommentaires);
router.get('/message/commentaire/:id', commentaireCtrl.oneCom);
router.put('/message/commentaire/modif/:id', commentaireCtrl.modifCom);
router.delete('/message/commentaire/delete/:id', commentaireCtrl.deleteCom);


module.exports = router;