const Post = require('../models/post');
const Reply = require('../models/reply');

module.exports.createreply = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const reply = new Reply(req.body.reply);
    reply.author = req.user._id;
    post.replies.push(reply);
    await reply.save();
    await post.save();
    req.flash('success', 'Created new reply!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.deletereply = async (req, res) => {
    const { id, replyId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { replies: replyId } });
    await Reply.findByIdAndDelete(replyId);
    req.flash('success', 'Successfully deleted reply')
    res.redirect(`/posts/${id}`);
}
