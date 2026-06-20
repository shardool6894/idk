const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express();
const DBLoader = require('./backend/database')
DBLoader()
const router = require('./backend/routes/routes')
app.use(express.static(path.resolve('./frontend')))
app.use(express.json());
app.use(cookieParser())
app.use('/api',router)
app.listen(5000,()=>{
    console.log('server running on port 5000')
})