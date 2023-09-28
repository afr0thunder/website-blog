const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const { registerCtrl, loginCtrl, userDetailsCtrl, userProfileCtrl, updateProfileCtrl,updateCoverCtrl, updatePasswordCtrl, updateUserCtrl, logoutCtrl } = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");
const userRoutes = express.Router();

//instance of multer
const upload = multer({storage});

//Rendering forms
//login form
userRoutes.get('/login', (req, res) => {
    res.render("users/login.ejs", {
        error: '',
    });
});
//register form
userRoutes.get('/register', (req, res) => {
    res.render("users/register.ejs", {
        error: '',
    });
});
//profile picture upload
userRoutes.get('/upload-profile-photo-form', (req, res) => {
    res.render("users/uploadProfilePhoto.ejs", {
        error: '',
    });
});
//cover picture upload
userRoutes.get('/upload-profile-cover-form', (req, res) => {
    res.render("users/uploadCoverPhoto.ejs", {
        error: '',
    });
});
//update user info
userRoutes.get('/update-user-password/', (req, res) => {
    res.render("users/updatePassword.ejs", {
        error: '',
    });
});
//POST/register
userRoutes.post("/register", registerCtrl);

//POST/login
userRoutes.post("/login", loginCtrl);

//GET/profile
userRoutes.get("/profile-page/", protected, userProfileCtrl);

//PUT/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload/", protected, upload.single('profile'), updateProfileCtrl);

//PUT/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/", protected, upload.single('cover'), updateCoverCtrl);

//PUT/update-password/:id
userRoutes.put("/update-password/", updatePasswordCtrl);

//PUT/update-user/:id
userRoutes.put("/update-user/", updateUserCtrl);

//GET/logout
userRoutes.get("/logout", logoutCtrl);

//GET/:id
userRoutes.get("/:id", userDetailsCtrl);
module.exports = userRoutes;