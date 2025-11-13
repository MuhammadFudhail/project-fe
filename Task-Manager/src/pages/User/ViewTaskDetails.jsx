import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layout/DashboardLayout';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutDownRight } from 'react-icons/lu';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [todoList, setTodoList] = useState([]);

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'text-red-600 bg-gradient-to-r from-rose-50 to-red-100 border border-red-200';
      case 'Completed':
        return 'text-green-600 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200';
      default:
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200';
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
        setTodoList(response.data.todoCheckList || []);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const updateTodoCheckList = async (index) => {
    const todoCheckList = [...task?.todoCheckList];
    const taskId = id;

    if (todoCheckList[index]) {
      todoCheckList[index].completed = !todoCheckList[index].completed;
    }

    const isAllCompleted = todoCheckList.every((item) => item.completed);
    const newStatus = isAllCompleted ? 'Completed' : 'In Progress';

    try {
      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), {
        todoCheckList,
        status: newStatus,
      });

      if (response.status === 200) {
        setTask(response.data?.task || { ...task, status: newStatus, todoCheckList });
        setTodoList(todoCheckList);
      }
    } catch (error) {
      console.error('Failed to update checklist:', error);
    }
  };

  useEffect(() => {
    if (id) getTaskDetailsByID();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="w-full mt-6">
        {task && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 tracking-wide mb-1">
                  {task?.title}
                </h2>
                <p className="text-sm text-gray-400">
                  {moment(task?.createdAt).format('dddd, Do MMMM YYYY')}
                </p>
              </div>
              <div
                className={`text-[12px] font-medium mt-3 md:mt-0 px-4 py-1.5 rounded-full ${getStatusTagColor(
                  task?.status
                )}`}
              >
                {task?.status}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-rose-50 to-white border border-red-100 rounded-xl p-5">
              <InfoBox label="Description" value={task?.description} />
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              <InfoBox label="Priority" value={task?.priority} />
              <InfoBox
                label="Due Date"
                value={
                  task?.dueDate
                    ? moment(task?.dueDate).format('Do MMM YYYY')
                    : 'N/A'
                }
              />
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Assigned To
                </label>
                <AvatarGroup
                  avatars={task?.assignedTo?.map((i) => i?.profileImageUrl || '')}
                  maxVisible={5}
                />
              </div>
            </div>

            {/* Todo Checklist */}
            <div className="mt-8">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                ✅ Todo Checklist
              </label>
              <div className="space-y-3">
                {todoList.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item.completed}
                    onChange={() => updateTodoCheckList(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

// 🧩 InfoBox
const InfoBox = ({ label, value }) => (
  <div className="p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-rose-50 hover:from-rose-100/60 hover:to-white transition-all">
    <label className="text-xs font-semibold text-red-500">{label}</label>
    <p className="text-sm font-medium text-gray-700 mt-1">{value}</p>
  </div>
);

// 🧩 TodoCheckList
const TodoCheckList = ({ text, isChecked, onChange }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
      isChecked
        ? 'bg-gradient-to-r from-rose-100 to-red-100 border-red-200'
        : 'bg-gradient-to-r from-white to-rose-50 border-gray-200 hover:from-rose-50 hover:to-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-5 h-5 accent-red-500 cursor-pointer transition-all"
      />
      <p
        className={`text-sm transition-all ${
          isChecked ? 'line-through text-gray-400' : 'text-gray-800 font-medium'
        }`}
      >
        {text}
      </p>
    </div>
    {isChecked && (
      <LuSquareArrowOutDownRight className="text-red-500 text-lg opacity-70" />
    )}
  </div>
);
