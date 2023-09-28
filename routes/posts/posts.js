const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const { createPostCtrl, getPostsCtrl, getPostCtrl, deletePostCtrl, updatePostCtrl } = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");
const Post = require("../../model/post/Post");

const postRoutes = express.Router();

//instance of multer
const upload = multer({
    storage,
});

//forms
postRoutes.get('/get-post-form', (req, res) => {
    res.render('posts/addPost.ejs', {
        error: '',
    });
});

postRoutes.get('/get-form-update/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('posts/updatePost.ejs', {post, error: '',});
    }catch (error) {
        res.render('posts/updatePost.ejs', {error, post: '',});
    }
})

//POST/
postRoutes.post("/", protected, upload.single('file'), createPostCtrl);

//GET/posts
postRoutes.get("/", getPostsCtrl);

//GET/posts/:id
postRoutes.get("/:id", getPostCtrl);

//DELETE/posts/:id
postRoutes.delete("/:id", protected, deletePostCtrl);

//PUT/posts/:id
postRoutes.put("/:id", protected, upload.single('file'), updatePostCtrl);



module.exports = postRoutes;