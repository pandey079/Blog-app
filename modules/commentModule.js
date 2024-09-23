const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'blog'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-blog'
    }
}, {timestamps: true});

const commentModel = model('commentModel', commentSchema);

module.exports = commentModel;