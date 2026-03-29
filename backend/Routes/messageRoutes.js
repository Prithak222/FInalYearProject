const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../Middlewares/AuthValidation');
const { getConversations, getMessages, markAsRead } = require('../Controllers/messageController');

router.get('/conversations', ensureAuthenticated, getConversations);
router.get('/:otherUserId', ensureAuthenticated, getMessages);
router.put('/read/:otherUserId', ensureAuthenticated, markAsRead);

module.exports = router;
