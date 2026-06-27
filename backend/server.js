const express = require('express')
const app = require('./src/app')

require('dotenv').config()
const connectedToDb = require('./src/config/database')

connectedToDb()
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})