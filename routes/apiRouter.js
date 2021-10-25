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

//Messages routes
router.post('/messages/new/', multer, messagesCtrl.createMessage);
router.get('/messages/', multer, messagesCtrl.listMessages);
router.delete('/messages/', messagesCtrl.deleteMessage);
router.put('/messages/modif/', multer, messagesCtrl.updateMessage);

//Commentaires routes
router.post('messages/newCom', commentaireCtrl.createCommentaire);
router.get('messages/com', commentaireCtrl.findCommentaires);

module.exports = router;