import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  Star,
  Trophy,
  ChevronRight,
  Tag,
  Check,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Copy,
  Search,
  Filter,
  ChevronDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Count from "../../../common/Count";
import { ResponsiveContainer } from "recharts";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Link } from "react-router-dom";
import InstructorService from "../../../services/instructorsService";
import axios from "axios";
import { QuickStats } from ".";
import { DashboardStats } from "../../../services/interfaces/instructor.interface";
import couponService from "../../../services/couponService";
import {
  Coupon,
  CouponFilters,
  CourseWithCoupons,
  Toast,
} from "../../../services/interfaces/coupon.interface";
import { ConfirmationDialog, CouponModal, ToastContainer } from "./CouponModal";

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
    UserName: string;
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
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState<boolean>(true);
  const [coursesWithCoupons, setCoursesWithCoupons] = useState<
    CourseWithCoupons[]
  >([]);
  const [filters, setFilters] = useState<CouponFilters>({
    status: "all",
    searchTerm: "",
    sortBy: "course",
    sortOrder: "asc",
    discountRange: { min: 0, max: 100 },
  });
  const [showFilters, setShowFilters] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

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
          averageRating: response.averageRating,
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
  useEffect(() => {
    const fetchCouponsData = async () => {
      try {
        setCouponsLoading(true);
        const response =
          await couponService.getAllInstructorCoursesWithCoupons();
        console.log("Coupons Data:", response);
        setCoursesWithCoupons(response.courses);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setCouponsLoading(false);
      }
    };

    fetchCouponsData();
  }, []);

  const refreshCoupons = async () => {
    const response = await couponService.getAllInstructorCoursesWithCoupons();
    setCoursesWithCoupons(response.courses);
  };

  const handleCreateCoupon = (courseId: string, courseTitle: string) => {
    setSelectedCourse({ id: courseId, title: courseTitle });
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const handleEditCoupon = async (
    courseId: string,
    courseTitle: string,
    coupon: Coupon
  ) => {
    await setSelectedCourse({ id: courseId, title: courseTitle });
    await setEditingCoupon(coupon);
    await setModalOpen(true);
    console.log(coupon);
  };

  const handleDeleteCoupon = (
    courseId: string,
    couponId: string,
    couponCode: string
  ) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Coupon",
      message: `Are you sure you want to delete the coupon "${couponCode}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await couponService.deleteCoupon(courseId, couponId);
          console.log("Coupon deleted:", response);
          await refreshCoupons();
          addToast("success", `Coupon "${couponCode}" deleted successfully`);
        } catch (error) {
          console.error("Error deleting coupon:", error);
          addToast("error", "Failed to delete coupon. Please try again.");
        }
      },
    });
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      addToast("success", `Coupon code "${code}" copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy coupon code:", err);
      addToast("error", "Failed to copy coupon code. Please try again.");
    }
  };

  const getFilteredAndSortedCoupons = () => {
    if (
      filters.status === "all" &&
      filters.searchTerm === "" &&
      filters.sortBy === "course" &&
      filters.sortOrder === "asc" &&
      filters.discountRange.min === 0 &&
      filters.discountRange.max === 100
    ) {
      return coursesWithCoupons;
    }else if (
      filters.status === "all" &&
      filters.searchTerm !== "" &&
      filters.sortBy === "course" &&
      filters.sortOrder === "asc" &&
      filters.discountRange.min === 0 &&
      filters.discountRange.max === 100
    ) {
      return coursesWithCoupons.filter((course) => {
        if(course.coupons.length !== 0){
          return course.coupons.some((coupon) => {
            const searchLower = filters.searchTerm.toLowerCase();
            return (
              coupon.code.toLowerCase().includes(searchLower) ||
              course.courseTitle.toLowerCase().includes(searchLower)
            );
          });
        }
        else{
          return (
            course.courseTitle.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        }
      })
    }
    const filteredCourses = coursesWithCoupons
      .map((course) => {
        const filteredCoupons = course.coupons.filter((coupon) => {
          // Status filter
          if (filters.status !== "all") {
            const status = couponService.getCouponStatus(coupon);
            if (status !== filters.status) return false;
          }

          // Search filter
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            if (
              !coupon.code.toLowerCase().includes(searchLower) &&
              !course.courseTitle.toLowerCase().includes(searchLower)
            ) {
              return false;
            }
          }

          // Discount range filter
          if (
            coupon.discountPercentage < filters.discountRange.min ||
            coupon.discountPercentage > filters.discountRange.max
          ) {
            return false;
          }

          return true;
        });

        // Sort coupons
        filteredCoupons.sort((a, b) => {
          let comparison = 0;

          switch (filters.sortBy) {
            case "code":
              comparison = a.code.localeCompare(b.code);
              break;
            case "discount":
              comparison = a.discountPercentage - b.discountPercentage;
              break;
            case "expiry":
              comparison =
                new Date(a.expiryDate).getTime() -
                new Date(b.expiryDate).getTime();
              break;
            case "course":
              comparison = course.courseTitle.localeCompare(course.courseTitle);
              break;
          }

          return filters.sortOrder === "desc" ? -comparison : comparison;
        });

        return {
          ...course,
          coupons: filteredCoupons,
        };
      })
      .filter((course) => course.coupons.length > 0);

    return filteredCourses;
  };

  const filteredCoursesWithCoupons = getFilteredAndSortedCoupons();
  const totalFilteredCoupons = filteredCoursesWithCoupons.reduce(
    (sum, course) => sum + course.coupons.length,
    0
  );

  const clearFilters = () => {
    setFilters({
      status: "all",
      searchTerm: "",
      sortBy: "course",
      sortOrder: "asc",
      discountRange: { min: 0, max: 100 },
    });
  };

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

  // Calculate coupon statistics
  const allCoupons = coursesWithCoupons.flatMap((course) => course.coupons);
  const couponStats = couponService.getCouponStats(allCoupons);

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />
      {/* Learning Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Instructor Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Students Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Students</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              <Count number={data.totalStudents} text="" />
            </p>
            <p className="text-sm text-gray-600">Total enrolled</p>
          </div>

          {/* Courses Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <BookOpen className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Courses</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">
              <Count number={data.coursesCreated} text="" />
            </p>
            <p className="text-sm text-gray-600">Created courses</p>
          </div>

          {/* Rating Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Star className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              <Count
                number={Number(integerPart)}
                text={fractionalPart ? `.${fractionalPart}` : ""}
              />
            </p>
            <p className="text-sm text-gray-600">Average rating</p>
          </div>

          {/* Coupons Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Tag className="w-6 h-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Coupons</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {couponsLoading ? (
                <div className="animate-pulse bg-orange-200 h-8 w-16 rounded"></div>
              ) : (
                <Count number={couponStats.active} text="" />
              )}
            </p>
            <p className="text-sm text-gray-600">Active coupons</p>
          </div>
        </div>
        {!couponsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {couponStats.total}
                  </p>
                  <p className="text-sm text-gray-600">Total Coupons</p>
                </div>
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {couponStats.active}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <Check className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {couponStats.expiringSoon}
                  </p>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {couponStats.expired}
                  </p>
                  <p className="text-sm text-gray-600">Expired</p>
                </div>
                <Clock className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        )}

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
                          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-600 p-6 min-h-[386px]">
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
                            <h3 className="line-clamp-2">
                              <Link to="/my-courses">
                                {`${course.title}`.substring(0, 80) + "..."}
                              </Link>
                            </h3>
                            <div className="client-items">
                              <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                                <img
                                  src={
                                    profile.profileImage ||
                                    "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                                  }
                                  alt={`${profile.UserName.replace("|", " ")} `}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif";
                                  }}
                                />
                              </div>
                              <p>
                                {profile.UserName.replace("|", " ")}
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

      {/* Coupon Management Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm overflow-auto max-h-[600px]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Coupon Management
            </h3>
            {totalFilteredCoupons !== allCoupons.length ? (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                {totalFilteredCoupons} of {allCoupons.length} (Coupons)
              </span>
            ) : (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                {totalFilteredCoupons} of {allCoupons.length} (Coupons)
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Manage discount coupons for your courses
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search coupons or courses..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm ${
                showFilters
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    title="Status"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="expiring-soon">Expiring Soon</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    title="Sort By"
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        sortBy: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="expiry">Expiry Date</option>
                    <option value="code">Coupon Code</option>
                    <option value="discount">Discount %</option>
                    <option value="course">Course Name</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                      }))
                    }
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    {filters.sortOrder === "asc" ? (
                      <>
                        <SortAsc className="w-4 h-4" />
                        Ascending
                      </>
                    ) : (
                      <>
                        <SortDesc className="w-4 h-4" />
                        Descending
                      </>
                    )}
                  </button>
                </div>

                {/* Clear Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actions
                  </label>
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Discount Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Range: {filters.discountRange.min}% -{" "}
                  {filters.discountRange.max}%
                </label>
                <div className="flex items-center gap-4">
                  <input
                    title="Discount Range"
                    type="range"
                    min="0"
                    max="100"
                    value={filters.discountRange.min}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        discountRange: {
                          ...prev.discountRange,
                          min: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="flex-1"
                  />
                  <input
                    title="Discount Range"
                    type="range"
                    min="0"
                    max="100"
                    value={filters.discountRange.max}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        discountRange: {
                          ...prev.discountRange,
                          max: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {couponsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-24 sm:h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredCoursesWithCoupons.length > 0 ? (
              filteredCoursesWithCoupons.map((course) => (
                <div
                  key={course.courseId}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  {/* Course Header - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <img
                        src={
                          course.thumbnailPreview ||
                          "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                        }
                        alt={course.courseTitle}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                          {course.courseTitle}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {course.coupons.length} coupon
                          {course.coupons.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleCreateCoupon(course.courseId.toString(), course.courseTitle)
                      }
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Coupon
                    </button>
                  </div>

                  {/* Coupons Grid - Mobile Optimized */}
                  {course.coupons.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {course.coupons.map((coupon) => {
                      const status = couponService.getCouponStatus(coupon);
                      const statusColors = {
                        active: "bg-green-100 text-green-800 border-green-200",
                        "expiring-soon":
                          "bg-orange-100 text-orange-800 border-orange-200",
                        expired: "bg-red-100 text-red-800 border-red-200",
                      };

                      return (
                        <div
                          key={coupon._id}
                          className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3"
                        >
                          {/* Coupon Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <div
                                onClick={() => handleCopyCode(coupon.code)}
                                className="font-mono text-sm sm:text-lg font-bold text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between sm:justify-start"
                              >
                                <span className="truncate">{coupon.code}</span>
                                <Copy className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-blue-500 flex-shrink-0" />
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]} self-start`}
                              >
                                {status.replace("-", " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 self-end sm:self-auto">
                              <button
                                title="Edit"
                                onClick={() =>
                                  handleEditCoupon(
                                    course.courseId,
                                    course.courseTitle,
                                    coupon
                                  )
                                }
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                title="Delete"
                                onClick={() =>
                                  handleDeleteCoupon(
                                    course.courseId,
                                    coupon._id,
                                    coupon.code
                                  )
                                }
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Coupon Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Discount:</span>
                              <span className="font-medium text-gray-800">
                                {coupon.discountPercentage}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Max Uses:</span>
                              <span className="font-medium text-gray-800">
                                {coupon.maxUses}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expires:</span>
                              <span className="font-medium text-gray-800">
                                {couponService.formatExpiryDate(coupon)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  ): (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <Tag className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <p className="text-sm sm:text-base">No coupons created for this course yet.</p>
                    <button
                      onClick={() =>
                        handleCreateCoupon(course.courseId.toString(), course.courseTitle)
                      }
                      className="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm sm:text-base"
                    >
                      Create your first coupon
                    </button>
                  </div>
                )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12 text-gray-500">
                {filters.searchTerm ||
                filters.status !== "all" ||
                filters.discountRange.min > 0 ||
                filters.discountRange.max < 100 ? (
                  <>
                    <Filter className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <h4 className="text-base sm:text-lg font-medium mb-2">
                      No coupons match your filters
                    </h4>
                    <p className="text-sm sm:text-base mb-4">
                      Try adjusting your search criteria or clear all filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm sm:text-base"
                    >
                      Clear all filters
                    </button>
                  </>
                ) : coursesWithCoupons.length === 0 ? (
                  <>
                    <Tag className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <h4 className="text-base sm:text-lg font-medium mb-2">
                      No courses with coupons yet
                    </h4>
                    <p className="text-sm sm:text-base">
                      Create coupons for your courses to offer discounts to
                      students.
                    </p>
                  </>
                ) : (
                  <>
                    <Tag className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <h4 className="text-base sm:text-lg font-medium mb-2">
                      No coupons found
                    </h4>
                    <p className="text-sm sm:text-base">
                      No coupons match your current filter criteria.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseId={selectedCourse?.id || ""}
        courseTitle={selectedCourse?.title || ""}
        coupon={editingCoupon}
        onSave={refreshCoupons}
      />
    </div>
  );
};

export default InstructorDashboard;
