const mongoose = require('mongoose')

function connectedToDb(){
  mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("connected to DB")
  })
}

module.exports = connectedToDb