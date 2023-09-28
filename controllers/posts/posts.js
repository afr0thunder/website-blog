const Post = require('../../model/post/Post');
const User = require('../../model/users/User');
const { post } = require('../../routes/users/users');
const appErr = require('../../utils/appErr');

//create
const createPostCtrl = async (req, res, next) => {
    const { title, description, category, user, image } = req.body;
    try{
        if (!title || !description || !category || !req.file) {
            return res.render("posts/addPost.ejs", {error: 'All fields are required'});
        };
        //find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //Create post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userFound._id,
            image: req.file.path,
        });
        //push post id into user array
        userFound.posts.push(postCreated._id);
        //update user
        await userFound.save();
        //redirect
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render("posts/addPost.ejs", {error: error.message});
    }
}

//get all
const getPostsCtrl = async (req, res, next) => {
    try{
        const posts = await Post.find().populate('comments').populate('user');
        res.json({
            status: "success",
            data: posts
        });
    } catch (error) {
        next(appErr(err.message));
    }
}

//details
const getPostCtrl = async (req, res, next) => {
    try{
        //get the id from params
        const id = req.params.id;
        //find the post
        const post = await Post.findById(id).populate({
            path: 'comments',
            populate: {
                path: 'user',
            },
        }).populate('user');
        res.render("posts/postDetails.ejs", {
            post,
            error: '',
        });
    } catch (error) {
        return res.render({error: message,});
    }
}

//delete
const deletePostCtrl = async (req, res, next) => {
    try{
        //find hte post
        const post = await Post.findById(req.params.id);
        //check if the post belongs to user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return res.render("posts.postDetails", {
                error: 'You are not authorized to delete this post',
                post,
            })
        }
        //delete
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/')
    } catch (error) {
        return res.render("posts.postDetails", {
            error: error.message,
            post: '',
        })
    }
}

//update
const updatePostCtrl = async (req, res, next) => {
    const { title, description, category } = req.body;
    try{
          //find hte post
          const post = await Post.findById(req.params.id);
          //check if the post belongs to user
          if (post.user.toString() !== req.session.userAuth.toString()) {
              return res.render("posts/addPost.ejs", {post: "", error: 'You are not authorized to update this post'});
          }
          if(req.file){
            await Post.findByIdAndUpdate(req.params.id,{
                title,
                description,
                category,
                image: req.file.path,
            },
            {
                new: true,
            }); 
          } else {
            await Post.findByIdAndUpdate(req.params.id,{
                title,
                description,
                category,
            },
            {
                new: true,
            }); 
          }
          //update
          
        res.redirect("/");
    } catch (error) {
        return res.render("posts/addPost.ejs", {post: "", error: error.message});
    }
}

module.exports = {
    createPostCtrl,
    getPostsCtrl,
    getPostCtrl,
    deletePostCtrl,
    updatePostCtrl,
}