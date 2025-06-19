import React, { useEffect, useState } from "react";
import { Clock, Trophy, BookOpen, Award } from "lucide-react";
import Count from "../../../common/Count";
import { ResponsiveContainer } from "recharts";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import CourseTable from "./StudentsCourses";
import StudentService from "../../../services/studentsService";
import axios from "axios";
import { QuickStats } from ".";
import { StudentStats } from "../../../services/interfaces/student.interface";

const options: ApexOptions = {
  chart: {
    type: "area",
    width: "100%",
    height: 300,
    sparkline: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#3D7FF9", "#27CFA7"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 1,
    colors: ["#3D7FF9", "#27CFA7"],
    lineCap: "round",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.9,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  grid: {
    show: true,
    borderColor: "#E6E6E6",
    strokeDashArray: 3,
    xaxis: {
      lines: { show: false },
    },
    yaxis: {
      lines: { show: true },
    },
  },
  markers: {
    colors: ["#3D7FF9", "#27CFA7"],
    strokeWidth: 3,
    size: 0,
    hover: {
      size: 8,
    },
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
    labels: {
      style: { fontSize: "14px" },
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `${value}`,
      style: { fontSize: "14px" },
    },
  },
  tooltip: {
    x: { format: "dd/MM/yy HH:mm" },
  },
  legend: {
    show: false,
  },
};

interface StudentDashboardProps {
  setQuickStat: React.Dispatch<React.SetStateAction<QuickStats | null>>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  setQuickStat,
}) => {
  const [data, setData] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await StudentService.getDashboardStats();
        setData(response);
        console.log("Dashboard Data:", response);
        setQuickStat({
          totalTimeLearned: response.totalTimeLearned,
          coursesCompleted: response.coursesCompleted,
          activeCourses: response.activeCourses,
        });
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setError(
            err.response?.data?.message || "Failed to fetch dashboard data."
          );
        } else {
          console.error("Unexpected error:", err);
          setError("Unexpected error:");
        }

        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  function formatTime(seconds: number): { value: number; unit: string } {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours >= 1) {
      return {
        value: hours,
        unit: "h",
      };
    } else if (minutes >= 1) {
      return {
        value: minutes,
        unit: "min",
      };
    } else {
      return {
        value: seconds,
        unit: "sec",
      };
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">No data available.</div>
      </div>
    );
  }
  const series = [
    {
      name: "Course Enrolled",
      data: data.monthlyProgress.map((item) => item.coursesEnrolled),
    },
    {
      name: "Course Completed",
      data: data.monthlyProgress.map((item) => item.coursesCompleted),
    },
  ];
  return (
    <div className="space-y-8">
      {/* Learning Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Learning Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Time Spent
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              <span className="odometer" data-count={data.totalTimeLearned}>
                {(() => {
                  const { value, unit } = formatTime(data.totalTimeLearned);
                  return <Count number={value} text={unit} />;
                })()}
              </span>
            </p>
            <p className="text-sm text-gray-600">Total learning time</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Achievements
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              <span className="odometer" data-count={data.coursesCompleted}>
                <Count number={data.coursesCompleted} text="" />
              </span>
            </p>
            <p className="text-sm text-gray-600">Course Completed</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Active courses
              </h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              <span className="odometer" data-count={data.activeCourses}>
                <Count number={data.activeCourses} text="" />
              </span>
            </p>
            <p className="text-sm text-gray-600">Courses in progress</p>
          </div>
          {/* Coupons Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Award className="w-6 h-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Certificates</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">
              <Count number={data.certificatesIssued || 0} text="" />
            </p>
            <p className="text-sm text-gray-600">Certificates Issued</p>
          </div>
        </div>

        {/* Learning Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Weekly Learning Activity
            </h3>
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: "#27CFA7" }}
              ></div>
              <span className="text-sm text-gray-600 mr-4">
                Course Completed
              </span>
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: "#3D7FF9" }}
              ></div>
              <span className="text-sm text-gray-600">Course Enrolled</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Chart
                options={options}
                series={series}
                type="area"
                height={300}
              />
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Table */}
        <CourseTable />
      </div>
    </div>
  );
};

export default StudentDashboard;
