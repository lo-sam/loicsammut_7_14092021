const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const usersCtrl = require('../controllers/usersCtrl');
const messagesCtrl = require('../controllers/messagesCtrl');

//routes


//Users routes
router.post('/users/register/', usersCtrl.register);
router.post('/users/login/', usersCtrl.login);
router.get('/users/me/', usersCtrl.getUserProfile);
router.put('/users/me/', usersCtrl.updateUserProfile);

//Messages routes
router.post('/messages/new/', multer, messagesCtrl.createMessage);
router.get('/messages/', multer, messagesCtrl.listMessages);
router.delete('/messages', messagesCtrl.deleteMessage);

module.exports = router;