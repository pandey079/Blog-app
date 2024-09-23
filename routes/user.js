const { Router } = require('express');
const User = require('../modules/userModule');
const router = Router();
router
.get('/signin', (req, res) => {
    res.render('signin');
})
.get('/signup', (req, res) => {
    res.render('signup');
})
.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try{
        // we make a virtual function in module: refer mongoose documentation:
        console.log({ email, password });
        
        const token = await User.matchPasswordandGenerateToken(email, password);
        console.log(token);
        
        // now we have a token, need to insert it into cookie & send to browser:

        res.cookie('token', token).redirect('/'); 
    }catch(e) {
        // passed value should be handled in .ejs(frontend) file.
        return res.render('signin', {e: 'Incorrect Email or Password'})
    }
})
.post('/signup', async (req, res) => {
    try{
        const { fullname, email, password } = req.body;
        console.log('Received data: ', { fullname, email, password });
        
        const user = await User.create({
            fullname,
            email,
            password
        });
        console.log(user);
        
        res.redirect('/user/signin');
    }catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error')
    }
})
.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})


module.exports = router;