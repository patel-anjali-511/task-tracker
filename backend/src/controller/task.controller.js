const taskModel = require("../model/task.model");

async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description are required",
      });
    }

    const task = await taskModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getTasks(req, res) {
  try {
    const tasks = await taskModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: " Task fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getTaskById(req, res) {
  try {
    const id = req.params.id;
    const task = await taskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateTask(req, res) {
  try {
    const id = req.params.id;

    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description are required",
      });
    }

    const task = await taskModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
      },
      {
       returnDocument: "after",
       runValidators: true,
      },
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteTask(req, res) {
  try {
    const id = req.params.id;
    const task = await taskModel.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
