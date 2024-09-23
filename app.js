require('dotenv').config(); // to config .env
const express = require('express');
const connectToDB = require('./connection');
const path = require('path')
const app = express();
const cookiesParser = require('cookie-parser');
// Connect to Database:
connectToDB(`${process.env.DATABASE_URI}`);

// import blog models to render on front page:
const Blog = require('./modules/blogModule')



// middlewares for view-engine:
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// importing my own middleware.
const checkForAuthenticationCookie = require('./middlewares/authmiddleware');

// middlewares for parsing data:
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookiesParser());
app.use(checkForAuthenticationCookie('token')) // own mmiddleware.
app.use(express.static(path.resolve('./public'))) // because expreess try to locate that in terms of a route.

// export router from other(Router) folder : 
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog'); // all routes for blog writing.

// handle requests:
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.get('/', async (req, res) => {
    const allBlog = await Blog.find({})
    // console.log(allBlog)
    // all data must be render in home page.
    res.render('home', { user: req.user,
        blogs: allBlog,
    }); // do json.stringyfy() if [object Object]
})
app.get('/home', async (req, res) => {
    const allBlog = await Blog.find({})
    res.render('home', { user: req.user,
        blogs: allBlog,
    });
})
app.listen(process.env.PORT, () => {console.log(`Server running at PORT: ${process.env.PORT}`)
})

// put all the repeatative components in the partials. 