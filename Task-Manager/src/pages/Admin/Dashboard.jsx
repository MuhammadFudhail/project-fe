import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#D32F2F", "#EF5350", "#FF8A65"];

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // Admin / User
  const division = localStorage.getItem("division");

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // -----------------------------
  // PREPARE CHART DATA
  // -----------------------------
  const prepareChartData = (charts = {}) => {
    const taskDistribution = charts.taskDistribution || {};
    const taskPriorityLevels = charts.taskPrioritiesLevels || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In Progress", count: taskDistribution.InProgress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels.Medium || 0 },
      { priority: "High", count: taskPriorityLevels.High || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  // -----------------------------
  // GET DASHBOARD DATA
  // -----------------------------
  const getDashboardData = async () => {
    try {
      // Bila Admin → ambil semua data
      // Bila User → ambil data berdasarkan divisinya
      const endpoint =
        role === "Admin"
          ? API_PATHS.TASKS.GET_DASHBOARD_DATA
          : API_PATHS.TASKS.GET_USER_DASHBOARD_DATA;

      const response = await axiosInstance.get(endpoint);

      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data.charts || {});
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Header Section */}
      <div className="my-5 shadow-lg rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white p-6 overflow-hidden relative transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-sm">
            Hallo, {user?.name || "User"} 👋
          </h2>
          <p className="text-sm mt-1.5 font-medium opacity-90">
            {moment().format("dddd, Do MMMM YYYY")}
          </p>
        </div>

        {/* Animated motivational text */}
        <div className="w-full overflow-hidden whitespace-nowrap mt-4 h-10 flex items-center">
          <div className="inline-block animate-marquee text-sm font-semibold opacity-90">
            💪 Semangat kerja hari ini! Jaga fokus, tetap produktif, dan jangan
            lupa istirahat 🚀
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          <InfoCard
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-black text-gray-800 border border-gray-100 shadow-md hover:shadow-lg hover:scale-[1.02]"
            icon={
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-6h13M5 13v-2a2 2 0 012-2h3"
                />
              </svg>
            }
          />

          <InfoCard
            label="Pending"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-yellow-500 text-yellow-800 border border-yellow-100 shadow-md hover:shadow-lg hover:scale-[1.02]"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3"
                />
              </svg>
            }
          />

          <InfoCard
            label="In Progress"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-blue-500 text-blue-800 border border-blue-100 shadow-md hover:shadow-lg hover:scale-[1.02]"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v16h16"
                />
              </svg>
            }
          />

          <InfoCard
            label="Completed"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-green-500 text-green-800 border border-green-100 shadow-md hover:shadow-lg hover:scale-[1.02]"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="shadow-md rounded-2xl bg-white p-5 hover:shadow-xl transition-all duration-300">
          <h5 className="font-semibold text-lg text-gray-800 mb-4 border-b border-gray-200 pb-2">
            📊 Task Distribution
          </h5>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="shadow-md rounded-2xl bg-white p-5 hover:shadow-xl transition-all duration-300">
          <h5 className="font-semibold text-lg text-gray-800 mb-4 border-b border-gray-200 pb-2">
            📈 Task Priority Levels
          </h5>
          <CustomBarChart data={barChartData} />
        </div>

        <div className="md:col-span-2">
          <div className="shadow-md rounded-2xl bg-white p-5 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800 tracking-wide">
                📝 Recent Tasks
              </h5>
              <button
                className="flex items-center gap-2 bg-red-500 from-red-500 to-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-sm transition-all duration-300"
                onClick={onSeeMore}
              >
                See All <LuArrowRight className="text-lg" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>

      {/* Animasi marquee CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Dashboard;
