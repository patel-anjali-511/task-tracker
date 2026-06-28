const connectDB = require('../db')
const Task = require('../task.model')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const task = await Task.findById(id)
      if (!task) return res.status(404).json({ message: 'Task not found' })
      return res.status(200).json({ task })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, status, priority, dueDate } = req.body
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and Description are required' })
      }
      const task = await Task.findByIdAndUpdate(
        id,
        { title, description, status, priority, dueDate },
        { returnDocument: 'after', runValidators: true }
      )
      if (!task) return res.status(404).json({ message: 'Task not found' })
      return res.status(200).json({ message: 'Task updated successfully', task })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const task = await Task.findByIdAndDelete(id)
      if (!task) return res.status(404).json({ message: 'Task not found' })
      return res.status(200).json({ message: 'Task deleted successfully', task })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
