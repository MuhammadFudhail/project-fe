import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")

  const navigate = useNavigate()

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  }

  const getAllTasks = async () => {
    try {
      let response
      let tasks = []
      let statusSummary = {}

      if (filterStatus === "Priority Tasks") {
        // Ambil task prioritas
        response = await axiosInstance.get(`${API_PATHS.TASKS.GET_ALL_TASKS}/prioritized`)
        tasks = response.data || []

        // Ambil summary dari /tasks biasa agar tab lain tetap punya angka
        const summaryResponse = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS)
        statusSummary = summaryResponse.data?.statusSummary || {}
      } else {
        // Ambil task berdasarkan status
        response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
          params: {
            status: filterStatus === "All" ? "" : filterStatus,
          },
        })
        tasks = response.data?.tasks || []
        statusSummary = response.data?.statusSummary || {}
      }

      setAllTasks(tasks)

      // Bentuk tab dengan data lengkap
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
        { label: "Priority Tasks", count: tasks.length },
      ]
      setTabs(statusArray)
    } catch (error) {
      console.error("Error fetching tasks", error)
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className='my-5'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
          <h2 className='text-xl md:text-2xl font-medium'>My Tasks</h2>

          {tabs?.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allTasks?.map((item) => (
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
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTasks
