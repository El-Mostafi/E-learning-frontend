import React, { useEffect, useState } from "react";
import { Users, BookOpen, Star, Trophy, ChevronRight } from "lucide-react";
import Count from "../../../common/Count";
import { ResponsiveContainer } from "recharts";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Link } from "react-router-dom";
import InstructorService, {
} from "../../../services/instructorsService";
import axios from "axios";
import { QuickStats } from ".";
import { DashboardStats } from "../../../services/interfaces/instructor.interface";


const instructorOptions: ApexOptions = {
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
  colors: ["#3D7FF9"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 1,
    colors: ["#3D7FF9"],
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
    colors: ["#3D7FF9"],
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

interface InstructorDashboardProps {
  profile: {
    profileImage: string;
    firstName: string;
    lastName: string;
  };
  setQuickStat: React.Dispatch<React.SetStateAction<QuickStats | null>>;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  profile,
  setQuickStat,
}) => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await InstructorService.getDashboardStats();
        setData(response);
        console.log("Dashboard Data:", response);
        setQuickStat({
          totalStudents: response.totalStudents,
          coursesCreated: response.coursesCreated,
          averageRating: response.averageRating});
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
  const instructorSeries = [
    {
      name: "Student Number",
      data: data.enrollmentsByMonth,
    },
  ];

  // Logic to split the average rating into integer and fractional parts
  const averageRatingString = data.averageRating.toFixed(1);
  const [integerPart, fractionalPart] = averageRatingString.split(".");

  return (
    <div className="space-y-8">
      {/* Learning Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Instructor Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Students Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Students</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              <Count number={data.totalStudents} text="" />
            </p>
            <p className="text-sm text-gray-600">Total enrolled</p>
          </div>

          {/* Courses Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Courses</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              <Count number={data.coursesCreated} text="" />
            </p>
            <p className="text-sm text-gray-600">Created courses</p>
          </div>

          {/* Rating Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              <Count
                number={Number(integerPart)}
                text={fractionalPart ? `.${fractionalPart}` : ""}
              />
            </p>
            <p className="text-sm text-gray-600">Average rating</p>
          </div>
        </div>

        {/* Enrollment Chart - uses the dynamic instructorSeries */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Number of Students Enrolled Over Time
            </h3>
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: "#3D7FF9" }}
              ></div>
              <span className="text-sm text-gray-600">Student Number</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Chart
                options={instructorOptions}
                series={instructorSeries}
                type="area"
                height={300}
              />
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course Sections */}
      <div className="grid grid-cols-1 md:grid-cols gap-8">
        {/* Popular Courses - DYNAMICALLY RENDERED */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Popular Courses
              </h3>
            </div>
            <Link
              to="/my-courses"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="row">
              {data.popularCourses.length > 0 ? (
                data.popularCourses.map((course) => (
                  <>
                    <div className="col-xl-4 col-lg-6 col-md-6">
                      <div className="courses-card-main-items">
                        <div className="courses-card-items style-2">
                          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-600 p-6 ">
                            <div className="relative z-10">
                              <img
                                src={
                                  course.thumbnail ||
                                  "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                                }
                                alt={course.title}
                                className="w-full h-48 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                              />
                              <div className="mt-4 space-y-2">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {course.level || "Not Specified!"}
                                </div>
                                <h4 className="text-xl font-bold text-white mt-2">
                                  {course.title}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="courses-content">
                            <ul className="post-cat">
                              <li>
                                <Link to="/courses">
                                  {course.category || "Not Specified!"}
                                </Link>
                              </li>
                              <li>
                                <i className="fas fa-star mr-2"></i>
                                <span className="fw-bold me-1">
                                  {course.rating}
                                </span>
                              </li>
                            </ul>
                            <h3>
                              <Link to="/my-courses">
                                {`${course.title}`.substring(0, 80) + "..."}
                              </Link>
                            </h3>
                            <div className="client-items">
                              <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                                <img
                                  src={
                                    profile.profileImage ||
                                    "https://via.placeholder.com/40x40"
                                  }
                                  alt={`${profile.firstName} ${profile.lastName}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/40x40";
                                  }}
                                />
                              </div>
                              <p>
                                {profile.firstName} {profile.lastName}
                              </p>
                            </div>
                            <ul className="post-class">
                              <li>
                                <i className="far fa-books"></i>
                                Lessons
                              </li>
                              <li>
                                <i className="far fa-user"></i>
                                {course.studentCount} Students
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  No popular courses to display yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
