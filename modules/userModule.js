// for hashing password:
const { createHmac, randomBytes } = require('crypto');
// schema, model exports
const mongoose = require('mongoose');
const { createTokenForUser } = require('../Services/authentication');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    salt: { // for password hashing as mentioned in video
        type: String,
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '../public/Images/image.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
},{timestamps: true})
// use .pre of mongoose to hash password when save:
userSchema.pre('save', function (next)  {
    const user = this;

    if(!user.isModified('password')) return; 

    const salt = randomBytes(16).toString(); // same as secret key mentioned in documentation:
    const hashedPassword = createHmac('sha256', salt)
                            .update(user.password)
                            .digest('hex');
    this.salt = salt;
    this.password = hashedPassword;

    next(); 
})
// we are makeing a virtual function:
userSchema.static('matchPasswordandGenerateToken', async function (email, password) {
    const user = await this.findOne({ email }); // find the user from the database who email as send by the user from frontend.
    if(!user) throw new Error('User not found');
    const userHash = user.password; // user hashed password from the database.

    // make new hashed password with { user.salt, newPassword }
    const recentHashed = createHmac('sha256', user.salt)
                            .update(password)
                            .digest('hex');

    // recentHashed === userHash; // compare and return.
    if(userHash !== recentHashed) throw new Error('Incorrect Password')
    // return { ...user, password: undefined, salt: undefined } // maybe it is to overright the user object.
    const token = createTokenForUser(user);
    return token;
})
// make model:
const User = mongoose.model('user-blog', userSchema);

module.exports = User;