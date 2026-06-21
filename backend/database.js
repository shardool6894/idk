const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const connectionString = process.env.MONGOOSE_CONNECTION_STRING
const DBLoader = async () => {
    try{
        await mongoose.connect(connectionString)
        console.log('DB connected')
    }
    catch(err){
        console.log('DB Connection Failed')
        console.log(err)
    }
}
module.exports = DBLoader;