const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-blog',
        required: true
    },

},{ timestamps: true })

const Blog = model('blog', blogSchema);
module.exports = Blog;