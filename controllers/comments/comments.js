const Comment = require('../../model/comment/Comment');
const Post = require('../../model/post/Post');
const User = require('../../model/users/User');
const appErr = require("../../utils/appErr");

//create
const createCommentCtrl = async (req, res, next) => {
    const { message } = req.body;
    try{
        //Find the post
        const post = await Post.findById(req.params.id);
        //create comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
            post: post._id,
        });
        //push comment to post
        post.comments.push(comment._id);
        //find user
        const user = await User.findById(req.session.userAuth);
        //push commebt 
        user.comments.push(comment._id);
        //diable validation
        //save
        await post.save({ validateBeforeSave: false});
        await user.save({ validateBeforeSave: false});
        //redirect
        res.redirect(`/api/v1/posts/${post._id}`);
    } catch (error) {
        next(appErr(error.message));
    }
}

//get all
const getCommentsCtrl = async (req, res, next) => {
    try{
        res.json({
            status: "success",
            user: "Comments list"
        });
    } catch (error) {
        next(appErr(error));
    }
}

//details
const getCommentCtrl = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.id);
        res.render('comments/updateComment.ejs', {
            comment, error: 'Comment not found',
        })
    } catch (error) {
        res.render('comments/updateComment.ejs', {
            error: error.message,
        })
    }
}

//delete
const deleteCommentCtrl = async (req, res, next) => {
    try{
        //find hte post
        const comment = await Comment.findById(req.params.id);
        //check if the post belongs to user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this comment", 403));
        }
        //delete
        await Comment.findByIdAndDelete(req.params.id);
        res.redirect(`/api/v1/posts/${req.query.postId}`);
    } catch (error) {
        next(appErr(error.message));
    }
}

//update
const updateCommentCtrl = async (req, res, next) => {
    const { message } = req.body;
    try{
          //find hte post
          const comment = await Comment.findById(req.params.id);
          //check if the post belongs to user
          if (comment.user.toString() !== req.session.userAuth.toString()) {
              return next(appErr("You are not allowed to change this comment", 403));
          }
          //update
          const commentUpdated = await Comment.findByIdAndUpdate(req.params.id,{
            message,
          },
          {
            new: true,
          });
       //redirect
       res.redirect(`/api/v1/posts/${req.query.postId}`);
    } catch (error) {
        next(appErr(error));
    }
}

module.exports = {
    createCommentCtrl,
    getCommentsCtrl,
    getCommentCtrl,
    deleteCommentCtrl,
    updateCommentCtrl,
};