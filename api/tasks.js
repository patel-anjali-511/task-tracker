const connectDB = require('./db')
const Task = require('./task.model')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()

  if (req.method === 'GET') {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 })
      return res.status(200).json({ message: 'Tasks fetched successfully', tasks })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, status, priority, dueDate } = req.body
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and Description are required' })
      }
      const task = await Task.create({ title, description, status, priority, dueDate })
      return res.status(201).json({ message: 'Task created successfully', task })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
