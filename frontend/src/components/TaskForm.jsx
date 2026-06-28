import { useState, useEffect } from "react";
import api from "../services/api";

function TaskForm({ fetchTask, initialTask, onClose, addToast }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!initialTask;

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || "",
        description: initialTask.description || "",
        status: initialTask.status || "Pending",
        priority: initialTask.priority || "Medium",
        dueDate: initialTask.dueDate ? initialTask.dueDate.substring(0, 10) : "",
      });
    }
  }, [initialTask]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      if (addToast) addToast("Please correct the validation errors.", "error");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await api.put(`/tasks/${initialTask._id}`, formData);
        if (addToast) addToast("Task updated successfully!", "success");
      } else {
        await api.post("/tasks", formData);
        if (addToast) addToast("Task created successfully!", "success");
      }

      if (!isEditMode) {
        setFormData({
          title: "",
          description: "",
          status: "Pending",
          priority: "Medium",
          dueDate: "",
        });
      }

      fetchTask();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to save task.";
      if (addToast) addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? "input-error" : ""}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          placeholder="Provide detail about this task..."
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={errors.description ? "input-error" : ""}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        {onClose && (
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEditMode ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;