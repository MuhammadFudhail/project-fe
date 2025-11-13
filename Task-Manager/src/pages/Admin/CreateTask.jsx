import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';
import { LuTrash2 } from 'react-icons/lu';

import DashboardLayout from '../../components/layout/DashboardLayout';
import SelectDropDown from '../../components/Inputs/SelectDropDown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';

import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [],
    todoCheckList: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // ✅ Handle perubahan nilai input
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Reset form ke nilai awal
  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoCheckList: [],
    });
  };

  // ✅ Jika ada taskId, ambil data task
  useEffect(() => {
    if (taskId) getTaskDetailsByID();
  }, [taskId]);

  // ✅ Ambil detail task berdasarkan ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const taskInfo = response.data;

      setTaskData({
        title: taskInfo.title || '',
        description: taskInfo.description || '',
        priority: taskInfo.priority || 'Low',
        dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : '',
        assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
        todoCheckList: taskInfo?.todoCheckList || [],
      });
    } catch {
      toast.error('Failed to load task details');
    }
  };

  // ✅ Membuat task baru
  const createTask = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!taskData.todoCheckList.length) {
        setError('Checklist cannot be empty.');
        setLoading(false);
        return;
      }

      const payload = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: taskData.todoCheckList.map((item) =>
          typeof item === 'string' ? { text: item, completed: false } : item
        ),
      };

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload);
      toast.success('✅ Task Created Successfully');
      clearData();
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('❌ Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update task
  const updateTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: taskData.todoCheckList.map((item) =>
          typeof item === 'string' ? { text: item, completed: false } : item
        ),
      });

      toast.success('✅ Task Updated Successfully');
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('❌ Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hapus task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success('🗑️ Task Deleted Successfully');
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // ✅ Validasi & submit
  const handleSubmit = () => {
    setError(null);

    if (!taskData.title.trim()) return setError('Title is required.');
    if (!taskData.description.trim()) return setError('Description is required.');
    if (!taskData.dueDate.trim()) return setError('Due date is required.');
    if (!taskData.assignedTo?.length) return setError('Task not assigned to any member.');
    if (!taskData.todoCheckList?.length) return setError('Add at least one todo task.');

    taskId ? updateTask() : createTask();
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-6 p-6 bg-white shadow-md rounded-xl border border-red-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            {taskId ? '✏️ Update Task' : '📝 Create Task'}
          </h2>

          {taskId && (
            <button
              className="flex items-center gap-1.5 text-[13px] font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all"
              onClick={() => setOpenDeleteAlert(true)}
            >
              <LuTrash2 className="text-base" />
              Delete
            </button>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Task Title</label>
            <input
              placeholder="Create App UI"
              className="form-input mt-1 border-gray-300 focus:border-red-400 focus:ring focus:ring-red-100"
              value={taskData.title}
              onChange={({ target }) => handleValueChange('title', target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Description</label>
            <textarea
              placeholder="Describe the task..."
              className="form-input mt-1 border-gray-300 focus:border-red-400 focus:ring focus:ring-red-100"
              rows={4}
              value={taskData.description}
              onChange={({ target }) => handleValueChange('description', target.value)}
            />
          </div>

          {/* Priority, Due Date, Assigned To */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 md:col-span-4">
              <label className="text-xs font-semibold text-gray-600">Priority</label>
              <SelectDropDown
                options={PRIORITY_DATA}
                value={taskData.priority}
                onChange={(value) => handleValueChange('priority', value)}
              />
            </div>

            <div className="col-span-6 md:col-span-4">
              <label className="text-xs font-semibold text-gray-600">Due Date</label>
              <input
                type="date"
                className="form-input mt-1 border-gray-300 focus:border-red-400 focus:ring focus:ring-red-100"
                value={taskData.dueDate}
                onChange={({ target }) => handleValueChange('dueDate', target.value)}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <label className="text-xs font-semibold text-gray-600">Assigned To</label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
              />
            </div>
          </div>

          {/* Checklist */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Todo Checklist</label>
            <TodoListInput
              todoList={taskData.todoCheckList}
              setTodoList={(value) => handleValueChange('todoCheckList', value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 px-3 py-2 rounded-md border border-rose-100">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all 
                ${loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-400 text-white shadow-md hover:shadow-lg'}
              `}
              onClick={handleSubmit}
              disabled={loading}
            >
              {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Delete */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
