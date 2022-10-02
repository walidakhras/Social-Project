const User = require('../models/user');
const Post = require('../models/post')
const Reply = require('../models/reply');
const { cloudinary } = require("../cloudinary/cloud");


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, createdOn } = req.body;
        const user = new User({ email, username });
        console.log(req.file);
        console.log(req.body);
        if (user.image.filename) {
            user.image.filename = req.file.filename;
            user.image.url = req.file.path;
        }
        user.createdOn = createdOn;
        
        // user.image = req.file.map(f => ({url: f.path, filename: f.filename}));
        const registeredUser = await User.register(user, password);
    
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/posts');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/posts');
}

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    

    // const posts = await Post.find({ author: { $eq: id } });
    await Post.deleteMany({ author: { $eq: id } });
    await Reply.deleteMany({ author: { $eq: id }});


    
    // console.log(posts);
    await User.findByIdAndDelete(id);
    
    
    req.flash('success', 'Successfully deleted user. Sorry to see you go!')
    res.redirect('/posts')
}

module.exports.renderUserEditPage = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if (!user) {
        req.flash('error', 'Cannot find that user!');
        return res.redirect('/posts');
    }
    res.render('users/editPage', { user });
}

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    await user.save();
    req.flash('success', 'Successfully updated. Please login again');
    res.redirect(`/users/${user._id}`)
}

module.exports.renderUserPage = async (req, res) => {
    const foundUser = await User.findById(req.params.id);
    res.render('users/userPage', { foundUser });
}

