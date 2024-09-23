const mongoose = require('mongoose')

function connectToDB(path) {
    mongoose.connect(path)
            .then(() => {console.log('Connected to Database')})
            .catch((e) => {console.log('Error: ', e)})
}
module.exports = connectToDB;