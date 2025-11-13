import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-600 border border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-600 border border-yellow-200";
      case "In Progress":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border border-red-200";
      case "Medium":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Low":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="w-full border-collapse rounded-2xl shadow-sm overflow-hidden">
        <thead>
          <tr className="bg-slate-50 text-left border-b border-slate-200">
            <th className="py-3 px-5 text-slate-700 font-semibold text-sm">Name</th>
            <th className="py-3 px-5 text-slate-700 font-semibold text-sm">Status</th>
            <th className="py-3 px-5 text-slate-700 font-semibold text-sm">Priority</th>
            <th className="py-3 px-5 text-slate-700 font-semibold text-sm hidden md:table-cell">
              Created On
            </th>
          </tr>
        </thead>
        <tbody >
          {tableData.map((task) => (
              <tr
              key={task.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-5 text-slate-800 text-sm font-medium truncate">
                {task.title}
              </td>
              <td className="py-3 px-5">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded inline-block ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="py-3 px-5">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded inline-block ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="py-3 px-5 text-slate-600 text-sm whitespace-nowrap hidden md:table-cell">
                {task.createdAt
                  ? moment(task.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
