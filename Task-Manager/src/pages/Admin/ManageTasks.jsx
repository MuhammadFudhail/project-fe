import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'
import toast from 'react-hot-toast'

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")

  const navigate = useNavigate()

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      const tasks = response.data?.tasks || []
      setAllTasks(tasks)
      console.log("All tasks set:", tasks)

      const statusSummary = response.data?.statusSummary || {}
      console.log("Status Summary:", statusSummary)

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ]
      setTabs(statusArray)
      console.log("Tabs set:", statusArray)

    } catch (error) {
      console.error("Error fetching tasks", error)
    }
  }

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } })
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "task_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading task detail:", error)
      toast.error("Failed to download task report. Please try again.")
    }
  }

  useEffect(() => {
  console.log("Filter Status changed:", filterStatus)
  getAllTasks()
}, [filterStatus])

// 🟢 Tambahkan useEffect baru di bawahnya:
useEffect(() => {
  // Saat user kembali dari halaman create/edit task
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log("Window aktif lagi — ambil ulang semua tasks");
      getAllTasks(); // refresh data task
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);


  console.log("Render Tabs:", tabs)
  console.log("Render All Tasks:", allTasks)

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className='my-5'> 
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-2xl font-medium'>My Tasks</h2>
          </div>
          {tabs?.[0]?.count > 0 && (
            <div className='flex items-center gap-3'>
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button 
                className='hidden lg:flex download-btn' 
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className='text-lg' />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allTasks?.map((item, index) => {
            return (
              <TaskCard
                key={item._id}
                title={item.title || "Untitled"}
                description={item.description || ""}
                priority={item.priority || "Low"}
                status={item.status || "Pending"}
                progress={item.progress ?? 0}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((user) => user?.profileImageUrl || "")}
                completedTodoCount={item.completedTodoCount ?? 0}
                todoCheckList={Array.isArray(item.todoCheckList) ? item.todoCheckList : []}
                onClick={() => handleClick(item)}
              />
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
