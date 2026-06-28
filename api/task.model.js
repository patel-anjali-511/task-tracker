const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date }
}, { timestamps: true })

const taskModel = mongoose.models.task || mongoose.model('task', taskSchema)

module.exports = taskModel
