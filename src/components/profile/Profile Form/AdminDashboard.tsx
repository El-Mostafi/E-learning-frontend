import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  BarChart3,
  PieChart,
  Eye,
  Star,
  Brain,
} from "lucide-react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import UserManagement from "./components/UserManagement";
import CourseManagement from "./components/CourseManagement";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import MLModelManagement from "./components/MLModelManagement";

import axios from "axios";
import usersService, { UsersResponse } from "../../../services/usersService";
import {
  coursService,
  GetAllCoursesResponse,
} from "../../../services/coursService";
import { stripeService } from "../../../services/stripeService";
import adminService from "../../../services/adminService";
import { DashboardStats } from "../../../services/interfaces/admin.interface";
import { RevenueStats } from "../../../services/interfaces/stripe.interface";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [usersData, setUsersData] = useState<UsersResponse>();
  const [courses, setCourses] = useState<GetAllCoursesResponse>();
  const [stats, setStats] = useState<DashboardStats>();
  const [revenue, setRevenue] = useState<RevenueStats>();
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState<boolean>(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [statError, setStatError] = useState<string | null>(null);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await usersService.getAllUsers({
          page: 1,
          limit: 8,
          role: undefined,
          status: undefined,
          search: undefined,
        });
        setUsersData(response);
        console.log("Users Data:", response);
        setUserError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setUserError(
            err.response?.data?.message || "Failed to fetch Users data."
          );
        } else {
          console.error("Unexpected error:", err);
          setUserError("Unexpected error:");
        }
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsersData();

    const fetchCoursesData = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await coursService.getAllCourses({
          page: 1,
          limit: 8,
          status: undefined,
          search: undefined,
          category: undefined,
          level: undefined,
          language: undefined,
        });
        setCourses(response);
        console.log("Courses Data:", response);
        setCourseError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setCourseError(
            err.response?.data?.message || "Failed to fetch Courses data."
          );
        } else {
          console.error("Unexpected error:", err);
          setCourseError("Unexpected error:");
        }
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCoursesData();

    const fetchStatsData = async () => {
      try {
        setIsLoadingStats(true);
        const response = await adminService.getDashboardStats();
        setStats(response);
        console.log("Stats Data:", response);
        setStatError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setStatError(
            err.response?.data?.message || "Failed to fetch Stats data."
          );
        } else {
          console.error("Unexpected error:", err);
          setStatError("Unexpected error:");
        }
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStatsData();

    const fetchRevenueData = async () => {
      try {
        setIsLoadingRevenue(true);
        const response = await stripeService.getRevenueStats();
        setRevenue(response);
        console.log("Revenue Data:", response);
        setRevenueError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setRevenueError(
            err.response?.data?.message || "Failed to fetch Revenue data."
          );
        } else {
          console.error("Unexpected error:", err);
          setRevenueError("Unexpected error:");
        }
      } finally {
        setIsLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, []);
  // Chart configurations for overview
  const revenueChartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["#3B82F6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280" },
        formatter: (value: number) => `$${value}`,
      },
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
      y: { formatter: (value: number) => `$${value}` },
    },
  };

  const revenueChartSeries = [
    {
      name: "Revenue",
      data: revenue ? revenue.revenueChartSeries.data : [],
    },
  ];

  const UserListSkeleton = () => {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-lg bg-gray-200 animate-pulse">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
    </div>
  );
  const ChartSkeleton = () => (
    <div className="bg-white  p-6 ">
      {/* Chart Container */}
      <div className="flex flex-col items-center">
        {/* Donut Chart Skeleton */}
        <div className="relative w-64 h-64 mb-6">
          <div className="absolute inset-0 rounded-full border-8 border-gray-200 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full border-8 border-gray-300 animate-pulse"></div>
          <div className="absolute inset-8 rounded-full border-8 border-gray-200 animate-pulse"></div>

          {/* Center label skeleton */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-3 bg-gray-300 rounded animate-pulse w-16 mb-1"></div>
            <div className="h-6 bg-gray-300 rounded animate-pulse w-12"></div>
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="flex flex-wrap justify-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  const AreaChartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80">
        {/* Y-axis labels skeleton */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-3 bg-gray-200 rounded animate-pulse w-8"
            ></div>
          ))}
        </div>

        {/* Chart area skeleton */}
        <div className="ml-12 mr-4 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-px bg-gray-200"></div>
            ))}
          </div>

          {/* Area chart shape skeleton */}
          <div className="absolute inset-0 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 400 240">
              <defs>
                <linearGradient
                  id="skeleton-gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#E5E7EB" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M 20 180 Q 60 160 100 140 T 180 120 Q 220 100 260 80 T 340 60 Q 360 50 380 40 L 380 200 L 20 200 Z"
                fill="url(#skeleton-gradient)"
                className="animate-pulse"
              />
              <path
                d="M 20 180 Q 60 160 100 140 T 180 120 Q 220 100 260 80 T 340 60 Q 360 50 380 40"
                stroke="#D1D5DB"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* X-axis labels skeleton */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="h-3 bg-gray-200 rounded animate-pulse w-6"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{title}</p>
      </div>
    </div>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCardError = ({ icon: Icon, title, error }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-lg bg-red-500">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Error Loading Data
        </h3>
        <p className="text-gray-600 text-sm mb-2">{title}</p>
        <p className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-200">
          {error}
        </p>
      </div>
    </div>
  );

  const ActionButton = ({
    icon: Icon,
    label,
    variant = "secondary",
    onClick,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );
  const userGrowthOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    labels: stats ? stats.userDistribution.map((item) => item.name) : [],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Users",
              formatter: () => stats?.totalUsers.toString() || "0",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
  };

  const userGrowthSeries = stats
    ? stats.userDistribution.map((item) => item.count)
    : [];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your e-learning platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "courses", label: "Courses", icon: BookOpen },
            { id: "analytics", label: "Analytics", icon: PieChart },
            { id: "ml-model", label: "AI Model", icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingStats ? (
                <StatCardSkeleton />
              ) : statError ? (
                <StatCardError
                  icon={Users}
                  title="Total Users"
                  error={statError}
                />
              ) : (
                <StatCard
                  icon={Users}
                  title="Total Users"
                  value={stats!.totalUsers}
                  color="bg-blue-500"
                />
              )}
              {isLoadingStats ? (
                <StatCardSkeleton />
              ) : statError ? (
                <StatCardError
                  icon={BookOpen}
                  title="Total Courses"
                  error={statError}
                />
              ) : (
                <StatCard
                  icon={BookOpen}
                  title="Total Courses"
                  value={stats!.totalCourses}
                  color="bg-green-500"
                />
              )}
              {isLoadingRevenue ? (
                <StatCardSkeleton />
              ) : revenueError ? (
                <StatCardError
                  icon={DollarSign}
                  title="Total Revenue"
                  error={revenueError}
                />
              ) : (
                <StatCard
                  icon={DollarSign}
                  title="Total Revenue"
                  value={revenue!.totalRevenue}
                  color="bg-purple-500"
                />
              )}
              {isLoadingStats ? (
                <StatCardSkeleton />
              ) : statError ? (
                <StatCardError
                  icon={UserCheck}
                  title="Active Users"
                  error={statError}
                />
              ) : (
                <StatCard
                  icon={UserCheck}
                  title="Active Users"
                  value={stats!.activeUsers}
                  color="bg-orange-500"
                />
              )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Revenue Overview
                  </h3>
                </div>
                {isLoadingRevenue ? (
                  <AreaChartSkeleton />
                ) : revenueError ? (
                  <div className="text-center py-10">
                    <p className="text-red-500">{revenueError}</p>
                  </div>
                ) : (
                  <Chart
                    options={revenueChartOptions}
                    series={revenueChartSeries}
                    type="area"
                    height={300}
                  />
                )}
              </div>

              {/* User Distribution */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      User Distribution
                    </h3>
                    <ActionButton
                      icon={Eye}
                      label="View Details"
                      onClick={() => setActiveTab("users")}
                    />
                  </div>
                  {isLoadingStats ? (
                    <ChartSkeleton />
                  ) : statError ? (
                    <div className="text-center py-10">
                      <p className="text-red-500">{statError}</p>
                    </div>
                  ) : (
                    <Chart
                      options={userGrowthOptions}
                      series={userGrowthSeries}
                      type="donut"
                      height={300}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Users
                    </h3>
                    <ActionButton
                      icon={Eye}
                      label="View Details"
                      onClick={() => setActiveTab("users")}
                    />
                  </div>
                </div>
                <div className="p-6 max-h-[716px] overflow-y-auto">
                  {isLoadingUsers ? (
                    <UserListSkeleton />
                  ) : userError ? (
                    <div className="text-center py-10">
                      <p className="text-red-500">{userError}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {usersData?.users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <img
                                src={user.profileImg || "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"}
                                alt={user.userName.replace("|", " ")}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.userName.replace("|", " ")}
                              </p>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "student"
                                  ? "bg-gray-100 text-gray-800"
                                  : user.role === "instructor"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status === "active" ? "Active" : "Blocked"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Courses */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Courses
                    </h3>
                    <ActionButton
                      icon={Eye}
                      label="View Details"
                      onClick={() => setActiveTab("courses")}
                    />
                  </div>
                </div>
                <div className="p-6 max-h-[716px] overflow-y-auto">
                  {isLoadingCourses ? (
                    <UserListSkeleton />
                  ) : courseError ? (
                    <div className="text-center py-10">
                      <p className="text-red-500">{courseError}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses?.courses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {course.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              by {course.instructor.replace("|", " ")}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="flex items-center text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-1" />
                                {course.numberOfStudents}
                              </span>
                              <span className="flex items-center text-sm text-gray-600">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {course.averageRating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                course.status === "Published"
                                  ? "bg-green-100 text-green-800"
                                  : course.status === "Draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {course.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <UserManagement usersData={usersData as UsersResponse} />
        )}
        {activeTab === "courses" && (
          <CourseManagement coursesData={courses as GetAllCoursesResponse} />
        )}
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "ml-model" && <MLModelManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;