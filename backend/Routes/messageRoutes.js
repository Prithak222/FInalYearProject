const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../Middlewares/AuthValidation');
const { getConversations, getMessages, markAsRead, getUnreadCount } = require('../Controllers/messageController');

router.get('/conversations', ensureAuthenticated, getConversations);
router.get('/unread-count', ensureAuthenticated, getUnreadCount);
router.get('/:otherUserId', ensureAuthenticated, getMessages);

router.put('/read/:otherUserId', ensureAuthenticated, markAsRead);

module.exports = router;
