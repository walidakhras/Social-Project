const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users_controller');


const multer = require('multer'); // Needed for image upload
const { storage } = require('../cloudinary/cloud'); // Use cloudinary
const upload = multer({ storage }); 

router.route('/register')
    .get(users.renderRegister)
    .post(upload.single('image'), catchAsync(users.register)); // .upload adds file attribute to the request

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

router.route('/:id')
    .put(catchAsync(users.updateUser))
    .delete(catchAsync(users.deleteUser));

router.get('/:id/edit', catchAsync(users.renderUserEditPage))


module.exports = router;