const bcrypt = require("bcryptjs");
const User = require("../../model/users/User");
const appErr = require("../../utils/appErr");

//register
const registerCtrl = async (req, res, next) => {
    const { fullname, email, password } = req.body
    //check if field is empty
    if(!fullname || !email || !password) {
        // return next(appErr("All fields are required"));
        return res.render('users/register.ejs', {
            error: "All fields are required",
        });
    }
    try{
        //1. check if user exists (email)
        const userFound = await User.findOne({ email });
        //throw error
        if(userFound) {
            return res.render('users/register.ejs', {
                error: "Username already in use",
            });
        };

        //hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        //register user
        const user = await User.create ({
            fullname,
            email,
            password: passwordHashed,
        });
     //redirect
     res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.json(error);
    }
}

//login
const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body
    if(!email || !password) {
        return res.render('users/login.ejs', {
            error: "All fields are required",
        });
    };
    try{
        //check if email exists
        const userFound = await User.findOne({ email });
        //throwerror
        if(!userFound) {
            return res.render('users/login.ejs', {
                error: "Invalid login credentials",
            });
        };
        //verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        //throw error
        if(!isPasswordValid) {
            return res.render('users/login.ejs', {
                error: "Invalid login credentials",
            });
        };
        //save the user into session
        req.session.userAuth = userFound._id;

        //redirect
     res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.json(error);
    }
}

//details
const userDetailsCtrl = async (req, res, next) => {
    try{
        //get userId from params
        const userId = req.params.id;
        //find the user
        const user = await User.findById(userId);
        res.render('users/updateUser.ejs', {
            user,
            error: "",
        });
    } catch (error) {
        res.render('users/updateUser.ejs', {
            error: error.message,
        });
    }
}

//profile
const userProfileCtrl = async (req, res, next) => {
    try{
        //get the login user
        const userID = req.session.userAuth;
        //find the user
        const user = await User.findById(userID).populate('posts').populate("comments");
        res.render("users/profile.ejs", {user});
    } catch (error) {
        next(appErr(error));
    }
};

//upload profile photo
const updateProfileCtrl = async (req, res, next) => {
    try{
        if(!req.file){
            return res.render('users/uploadProfilePhoto.ejs', {
                error: "Please upload an image",
            });
        }
        //1. find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //2. check if user is found
        if(!userFound) {
            return res.render('users/uploadProfilePhoto.ejs', {
                error: "User not found",
            });
        }
        //3. update profile photo
        await User.findByIdAndUpdate(userId, {
            profileImage: req.file.path,
        },
        {
            new: true,
        }
        );
        //redirect
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/uploadProfilePhoto.ejs', {
            error: error.message,
        });
    }
};

//upload cover photo
const updateCoverCtrl = async (req, res, next) => {
    try{
        if(!req.file){
            return res.render('users/uploadCoverPhoto.ejs', {
                error: "Please upload an image",
            });
        }
        //1. find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //2. check if user is found
        if(!userFound) {
            return res.render('users/uploadCoverPhoto.ejs', {
                error: "User not found",
            });
        }
        //3. update profile photo
        await User.findByIdAndUpdate(userId, {
            coverImage: req.file.path,
        },
        {
            new: true,
        }
        );
        //redirect
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/uploadProfilePhoto.ejs', {
            error: error.message,
        });
    }
}

//update password
const updatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body;
    try{
        //check if the user is updating the password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
             //update user password
            await User.findByIdAndUpdate(
            req.session.userAuth,
            {
                password: passwordHashed,
            },
            {
                new: true,
            }
        );
        };
        //redirect
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/uploadProfilePhoto.ejs', {
            error: error.message,
        });
    }
}

//update user
const updateUserCtrl = async (req, res, next) => {
    const {fullname, email } = req.body;
    try {
        if(!fullname || !email) {
            return res.render('users/update-user.ejs', {
                error: "Please input both username and password",
                user: '',
            });
        };
        //check email availibility
        if(email) {
            const emailtaken = await User.findOne({ email});
            if(emailtaken) {
                return res.render('users/update-user.ejs', {
                    error: "Email already is use",
                    user: '',
                });
            };
        };

        //update the user
        await User.findByIdAndUpdate(req.session.userAuth, {
            fullname,
            email,
        },
        {
            new: true,
        }
        )
        //redirect
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        return res.render('users/uploadProfilePhoto.ejs', {
            error: error.message,
            user: '',
        });
    }
};

//logout
const logoutCtrl = async (req, res, next) => {
    //destroy session
    req.session.destroy(()=>{
        res.redirect('/api/v1/users/login');
    });

}

module.exports = {
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    userProfileCtrl,
    updateProfileCtrl,
    updateCoverCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl,
}