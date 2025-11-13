import React from 'react'
import Progress from '../Progress'
import AvatarGroup from "../AvatarGroup"
import { LuPaperclip } from 'react-icons/lu'
import moment from "moment"

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt, 
  dueDate, 
  assignedTo, 
  attachmentCount, 
  completedTodoCount, 
  todoCheckList,
  onClick
}) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-red-600 bg-red-50 border border-red-200"
      case "Completed":
        return "text-green-600 bg-green-50 border border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border border-gray-200"
    }
  }

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-green-500 bg-green-100 border border-green-200"
      case "Medium":
        return "text-yellow-500 bg-yellow-100 border border-yellow-200"
      default:
        return "text-red-600 bg-red-100 border border-red-200"
    }
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl py-5 px-5 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-red-50 hover:to-white transition-all border border-gray-200/70 cursor-pointer space-y-4"
    >
      {/* Status & Priority */}
      <div className="flex justify-between items-center">
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor()}`}>
          {status}
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityTagColor()}`}>
          {priority} Priority
        </div>
      </div>

      {/* Title & Description */}
      <div className="pb-3  border-gradient-to-r from-red-400 to-red-500">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
          {description}
        </p>

        <p className="text-xs mt-2 text-gray-500">
          Task Done: <span className="font-medium text-red-600">{completedTodoCount} / {todoCheckList.length || 0}</span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      {/* Dates & Info */}
      <div className="flex justify-between items-end text-xs text-gray-500 mt-3">
        <div>
          <p className="font-semibold text-gray-600">Start Date</p>
          <p className="text-red-600">{moment(createdAt).format("Do MMM YYYY")}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-600">Due Date</p>
          <p className="text-red-600">{moment(dueDate).format("Do MMM YYYY")}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <AvatarGroup avatars={assignedTo || []} />

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <LuPaperclip className="text-red-500" />
            <span className="text-xs font-semibold text-gray-700">{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
