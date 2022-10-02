const { postschema, replieschema } = require('./schemas.js');
const ExpressError = require('./ExpressError');
const Post = require('../backend/models/post');
const reply = require('../backend/models/reply');
const User = require('../backend/models/user')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatePost = (req, res, next) => {
    const { error } = postschema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user.id.equals(id)) {
        req.flash('error', 'Error');
        return res.redirect(`/posts`)
    }
    next();
}

module.exports.isreplyAuthor = async (req, res, next) => {
    const { id, replyId } = req.params;
    const foundReply = await reply.findById(replyId);
    if (!foundReply.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.validatereply = (req, res, next) => {
    const { error } = replieschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}