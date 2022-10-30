const User = require('../models/user');
const Post = require('../models/post')
const Reply = require('../models/reply');
const passport = require('passport');


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


module.exports.login = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err || !user) {
			req.flash("error", "Incorrect information!")
			return res.redirect("users/login")
        }
        else if (!user) {
            req.flash("error", "This user does not exist!")
        }
		 else {
			req.logIn(user, (err) => {
				if (err) {
					req.flash("error", "Could not log in")
					console.log(err)
					res.redirect("users/login")
					return next(err)
				} else {
					req.flash("success", `Welcome back, ${user.username}`)
					return res.redirect("/posts")
				}
			})
		}
	}) (req, res, next);
}

module.exports.logout = (req, res) => {
    try {
        req.logout();
        req.flash('success', "Goodbye!");
        res.redirect('/posts');
    } catch (e) {
        req.flash("error", "Error logging out")
        res.redirect("/posts")
    }

}

module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
    

        // const posts = await Post.find({ author: { $eq: id } });
        await Post.deleteMany({ author: { $eq: id } });
        await Reply.deleteMany({ author: { $eq: id }});
    
        await User.findByIdAndDelete(id);
        
        
        req.flash('success', 'Successfully deleted user. Sorry to see you go!')
        res.redirect('/posts')
    } catch (e) {
        req.flash("error", "Error deleting")
        console.log(e.message)
        res.redirect("/posts")
    }
    const { id } = req.params;

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

