const express = require('express');
const router = express.Router({ mergeParams: true });
const { validatereply, isLoggedIn, isreplyAuthor } = require('../../utils/middleware');
const Post = require('../models/post');
const reply = require('../models/reply');
const replies = require('../controllers/replies_controller');
const ExpressError = require('../../utils/ExpressError');
const catchAsync = require('../../utils/catchAsync');

router.post('/', isLoggedIn, validatereply, catchAsync(replies.createreply))

router.delete('/:replyId', isLoggedIn, isreplyAuthor, catchAsync(replies.deletereply))

module.exports = router;