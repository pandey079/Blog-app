const { Router } = require('express');
const router = Router();

// require module `Blog`
const Blog = require('../modules/blogModule');

// require multer and use storage:
const multer = require('multer')
const path = require('path');
const commentModel = require('../modules/commentModule');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/upload/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`; // to make every file name unique
        cb(null, fileName)
    }
  }) 
  
  const upload = multer({ storage: storage })

router
.get('/add-blog', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    });
})
.post('/', upload.single('coverImage') , async (req, res) => {
    const { title, body } = req.body;
    console.log(req.body);
    console.log(req.file);
    // insert in database 
    const blog = await Blog.create({
        title,
        body,
        createBy: req.user._id,
        coverImage: `../upload/${req.file.filename}` // create a new folder and add this.
    })
    // render its frontend
    // handle coverImage upload through multer:
    return res.redirect(`/blog/${blog._id}`);
})
.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const blog = await Blog.findById(userId).populate('createBy');
    const comments = await commentModel.find({blogId: userId}).populate('createdBy');
    console.log(blog._id),
    console.log(comments),
    res.render('blog', {
        user: req.user,
        blog,
        comments
    }) 
})
// add comment for the post:
.post('/comment/:blogId', async (req, res) => {
    console.log(req.body);
    
    await commentModel.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})
module.exports = router;