require ('dotenv').config();
const express = require('express');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const globalErrHandler = require("./middlewares/globalHandler");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const Post = require("./model/post/Post");
const { truncatePost } = require('./utils/helpers');

require("./config/dbConnect");

const app = express();

//helpers
app.locals.truncatePost = truncatePost;

//?MIDDLEWARES

//configure ejs
app.set("viewengine", "ejs");

//serve static files
app.use(express.static(__dirname, +"public"));

//method override
app.use(methodOverride("_method"));

//session config
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {secure:false},
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            ttl: 24*60*60, //1 day
        }),
    })
);

//save the login user into locals
app.use((req, res, next)=>{
    if(req.session.userAuth){
        res.locals.userAuth = req.session.userAuth;
    } else {
        res.locals.userAuth = null;
    };
    next()
});

app.use(express.json()); //destructure register info
app.use(express.urlencoded({extended:true}));

//?ROUTES
//render homepage
app.get('/', async (req, res) => {
    try{
        const posts = await Post.find().populate("user");
        res.render('index.ejs', { posts });
    }catch(error){
    res.render('index.ejs', { error: error.message });
    }
    
});

//users route
app.use('/api/v1/users', userRoutes);

//posts route
app.use('/api/v1/posts', postRoutes);

//coments route
app.use('/api/v1/comments', commentRoutes);

//?ERROR HANDLER MIDDLEWARES
app.use(globalErrHandler);

//?LISTEN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));