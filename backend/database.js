const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const connectionString = process.env.MONGOOSE_CONNECTION_STRING
const DBLoader = async () => {
    await mongoose.connect(connectionString)
}
module.exports = DBLoader;