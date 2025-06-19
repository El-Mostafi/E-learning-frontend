import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Users,
  BookOpen,
  GraduationCap,
  Star,
  Award,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  PieChart,
} from "lucide-react";
import adminService from "../../../../services/adminService";
import axios from "axios";

import { DashboardData } from "../../../../services/interfaces/admin.interface";

const AnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getDashboardAnalytics();
      setDashboardData(data);
      await console.log("Dashboard Data:", data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data);
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data."
        );
      } else {
        console.error("Unexpected error:", err);
        setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleExport = () => {
    if (!dashboardData) return;

    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `platform_analytics_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to Load Dashboard
      </h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
      <button
        onClick={handleRefresh}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !dashboardData) {
    return <ErrorDisplay />;
  }

  const { stats } = dashboardData;
  // Chart configurations
  const userGrowthOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#3B82F6", "#10B981", "#8B5CF6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      categories: dashboardData?.userGrowthTrends
        ? dashboardData.userGrowthTrends.map((d) => d.month)
        : [],
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280" },
        formatter: (value: number) => `${value}`,
      },
    },
    legend: { position: "top" },
    grid: { borderColor: "#E5E7EB", strokeDashArray: 3 },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} users`,
      },
    },
  };

  const userGrowthSeries = dashboardData
    ? [
        {
          name: "Students",
          data: dashboardData.userGrowthTrends
            ? dashboardData.userGrowthTrends.map((d) => d.students)
            : [],
        },
        {
          name: "Instructors",
          data: dashboardData.userGrowthTrends
            ? dashboardData.userGrowthTrends.map((d) => d.instructors)
            : [],
        },
        {
          name: "Total Users",
          data: dashboardData.userGrowthTrends
            ? dashboardData.userGrowthTrends.map((d) => d.totalUsers)
            : [],
        },
      ]
    : [];

  const enrollmentTrendOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: { width: 3, curve: "smooth" },
    xaxis: {
      categories: dashboardData?.enrollmentTrends
        ? dashboardData.enrollmentTrends.map((d) => d.month)
        : [],
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280" },
        formatter: (value: number) => `${value}`,
      },
    },
    legend: { position: "top" },
    grid: { borderColor: "#E5E7EB", strokeDashArray: 3 },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} enrollments`,
      },
    },
  };

  const enrollmentTrendSeries = dashboardData
    ? [
        {
          name: "New Enrollments",
          data: dashboardData.enrollmentTrends
            ? dashboardData.enrollmentTrends.map((d) => d.newEnrollments)
            : [],
        },
        {
          name: "Completions",
          data: dashboardData.enrollmentTrends
            ? dashboardData.enrollmentTrends.map((d) => d.completions)
            : [],
        },
      ]
    : [];

  const categoryDistributionOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
    labels: dashboardData?.courseDistribution
      ? dashboardData.courseDistribution.map((d) => d.category)
      : [],
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
              label: "Total Courses",
              formatter: () =>
                dashboardData?.stats.totalCourses.toString() || "0",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} courses`,
      },
    },
  };

  const categoryDistributionSeries = dashboardData?.courseDistribution
    ? dashboardData.courseDistribution.map((d) => d.count)
    : [];

  const languageDistributionOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: dashboardData?.courseLanguages
        ? dashboardData.courseLanguages.map((d) => d.language)
        : [],
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: { style: { colors: "#6B7280" } },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} courses`,
      },
    },
  };

  const languageDistributionSeries = [
    {
      name: "Courses",
      data: dashboardData?.courseLanguages
        ? dashboardData.courseLanguages.map((d) => d.count)
        : [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Platform Insights
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive analytics from your e-learning platform
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalUsers.toLocaleString() : "0"}
              </p>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Students: {stats ? stats.studentsCount.toLocaleString() : "0"}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Instructors: {stats ? stats.instructorsCount : "0"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalCourses.toLocaleString() : "0"}
              </p>
              <p className="text-gray-600 text-sm">Total Courses</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Published: {stats ? stats.publishedCourses.toLocaleString() : "0"}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
              Draft: {stats ? stats.draftCourses.toLocaleString() : "0"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-500">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalEnrollments.toLocaleString() : "0"}
              </p>
              <p className="text-gray-600 text-sm">Total Enrollments</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Completed:{" "}
              {stats ? stats.completedEnrollments.toLocaleString() : "0"}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              In Progress:{" "}
              {stats ? stats.inProgressEnrollments.toLocaleString() : "0"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-orange-500">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.certificatesIssued.toLocaleString() : "0"}
              </p>
              <p className="text-gray-600 text-sm">Certificates Issued</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            Avg Rating: {stats ? stats.averageRating.toFixed(1) : "0"}/5.0
          </div>
        </div>
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Average Progress
            </h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats ? stats.averageProgress : 0}%` }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats ? stats.averageProgress : 0}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Quiz Completion
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats ? stats.quizCompletionRate : 0}%` }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats ? stats.quizCompletionRate : 0}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Users
            </h3>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats ? stats.activeUsers.toLocaleString() : "0"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {stats ? stats.activeUsersPercentage.toFixed(1) : "0"}% of total
            users
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            User Growth Trends
          </h3>
          <Chart
            options={userGrowthOptions}
            series={userGrowthSeries}
            type="area"
            height={350}
          />
        </div>

        {/* Course Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Course Distribution by Category
          </h3>
          <Chart
            options={categoryDistributionOptions}
            series={categoryDistributionSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Enrollment & Completion Trends
          </h3>
          <Chart
            options={enrollmentTrendOptions}
            series={enrollmentTrendSeries}
            type="line"
            height={350}
          />
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Course Languages
          </h3>
          <Chart
            options={languageDistributionOptions}
            series={languageDistributionSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 ">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Course Performance by Category
            </h3>
          </div>
          <div className="p-6 overflow-auto max-h-[567px]">
            <div className="space-y-4">
              {dashboardData.categoryPerformance?.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {category.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      {category.publishedCourses} published,{" "}
                      {category.draftCourses} draft
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {category.totalEnrollments.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Course Levels
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.courseLevels?.map((level, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        level.level === "Beginner"
                          ? "bg-green-500"
                          : level.level === "Intermediate"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{level.level}</p>
                      <p className="text-sm text-gray-600">
                        {level.courses} courses
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {level.enrollments.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
