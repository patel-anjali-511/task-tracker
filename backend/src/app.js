const express = require('express')
const taskModel = require('./model/task.model')
const taskRouter = require('./routes/task.routes')
const app = express()

app.use(express.json())

app.use('/api', taskRouter)

module.exports= app