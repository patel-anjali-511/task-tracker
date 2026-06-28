const express = require('express')
const taskModel = require('./model/task.model')
const taskRouter = require('./routes/task.routes')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api', taskRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend', 'dist', 'index.html'))
  })
}

module.exports= app