const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users_controller');


router.route('/:id')
    .get(catchAsync(users.renderUserPage))
    .put(catchAsync(users.updateUser))
    .delete(catchAsync(users.deleteUser));

router.get('/:id/edit', catchAsync(users.renderUserEditPage))

module.exports = router;