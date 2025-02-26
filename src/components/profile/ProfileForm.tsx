import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  Lock,
  Eye,
  EyeOff,
  Settings,
  X,
  BookOpen,
  UserCircle,
  ChevronRight,
  Clock,
  Trophy,
  Heart,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  LogOut,
} from "lucide-react";
import Count from "../../common/Count";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ImageCropDialog from "./ImageCropDialog";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { cloudService } from "../../services/cloudService";
import axios from "axios";

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
      formatter: (value: number) => `$${value}Hr`,
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

const series = [
  {
    name: "Study",
    data: [8, 15, 9, 20, 10, 33, 13, 22, 8, 17, 10, 15],
  },
  {
    name: "Test",
    data: [8, 24, 18, 40, 18, 48, 22, 38, 18, 30, 20, 28],
  },
];
const skillsData = [
  { name: "Programming", value: 40 },
  { name: "Design", value: 25 },
  { name: "Data Science", value: 20 },
  { name: "Soft Skills", value: 15 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#3D7FF9",
  "#27CFA7",
];
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif";

interface ParentFormData {
  firstName: string;
  lastName: string;
  newPassword: string;
  confirmPassword: string;
}
interface Errors extends ParentFormData {
  apiErrors?: Array<{ message: string }>;
}
function ProfileForm() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );
  const [showProfileDisconnectConfirm, setShowProfileDisconnectConfirm] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Errors>>({});
  // User profile state
  const [profile, setProfile] = useState({
    firstName: user?.userName?.split("|")[0] || "John",
    lastName: user?.userName?.split("|")[1] || "Doe",
    email: user?.email || "john.doe@example.com",
    studentId: "STU123456",
    department: "Computer Science",
    year: "3rd Year",
    profileImage: user?.profileImg || DEFAULT_AVATAR,
    newPassword: "",
    confirmPassword: "",
    totalHoursLearned: 156,
    coursesCompleted: 12,
    activeCourses: 3,
    badges: [
      { name: "Python Master", icon: "🐍" },
      { name: "Data Wizard", icon: "📊" },
      { name: "Quick Learner", icon: "⚡" },
    ],
    wishlist: [
      { name: "Advanced Machine Learning", instructor: "Dr. Sarah Chen" },
      { name: "Web Security Fundamentals", instructor: "Prof. James Wilson" },
      { name: "Cloud Architecture", instructor: "Michael Cloud" },
    ],
    completedCourses: [
      { name: "Introduction to Python", grade: "A", date: "2024-02-15" },
      { name: "Data Structures", grade: "A-", date: "2024-01-20" },
      { name: "Web Development Basics", grade: "B+", date: "2023-12-10" },
    ],
    socialLinks: {
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      twitter: "twitter.com/johndoe",
      portfolio: "johndoe.dev",
    },
  });
  const getValidationError = (name: string, value: string): string => {
    let error = "";

    if (name === "firstName") {
      if (!value.trim()) {
        error = "First Name is required.";
      } else if (value.length < 3) {
        error = "First Name must be at least 3 characters.";
      } else if (value.length > 20) {
        error = "First Name must be less than 20 characters.";
      } else if (/[|]/.test(value)) {
        error = "First Name must not contain the '|' character.";
      }
    }

    if (name === "lastName") {
      if (!value.trim()) {
        error = "Last Name is required.";
      } else if (value.length < 3) {
        error = "Last Name must be at least 3 characters.";
      } else if (value.length > 20) {
        error = "Last Name must be less than 20 characters.";
      } else if (/[|]/.test(value)) {
        error = "Last Name must not contain the '|' character.";
      }
    }
    if (name === "newPassword") {
      if (!value.trim()) {
        error = "Password is required.";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters.";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(value)) {
        error = "Password must contain at least one number.";
      } else if (!/[!@#$%^&*(),.?":{}|<>/]/.test(value)) {
        error = "Password must contain at least one special character.";
      }
    }

    if (name === "confirmPassword") {
      if (!value.trim()) {
        error = "Confirm Password is required.";
      } else if (value !== profile.newPassword) {
        error = "Passwords do not match.";
      }
    }

    return error;
  };
  const validateField = (name: string, value: string) => {
    const error = getValidationError(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));

    validateField(name, value);
  };
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Errors> = {};

    const firstNameError = getValidationError("firstName", profile.firstName);
    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    const lastNameError = getValidationError("lastName", profile.lastName);
    if (lastNameError) {
      newErrors.lastName = lastNameError;
    }

    const newPasswordError = getValidationError(
      "newPassword",
      profile.newPassword
    );
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    const confirmPasswordError = getValidationError(
      "confirmPassword",
      profile.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    profile.firstName,
    profile.lastName,
    profile.newPassword,
    profile.confirmPassword,
  ]);
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    try {
      if (DEFAULT_AVATAR !== profile.profileImage) {
        const { data: signatureData } = await cloudService.getSignature();
        if (!signatureData) return console.error("Signature is missing.");

        if (!croppedImage) return console.error("Image is missing.");

        const { data: uploadData } = await cloudService.uploadFile(
          croppedImage,
          signatureData,
          "images_preset"
        );

        console.log("Uploaded asset:", uploadData);

        setProfile((prev) => ({
          ...prev,
          profileImage: uploadData.secure_url,
        }));

        const { data: updateData } = await authService.updateUser(
          `${profile.firstName}|${profile.lastName}`,
          uploadData.secure_url
        );

        console.log("User updated:", updateData);
      } else {
        setProfile((prev) => ({ ...prev, profileImage: DEFAULT_AVATAR }));
        if (user!.profileImg === profile.profileImage) {
          const { data: updateData } = await authService.updateUser(
            `${profile.firstName}|${profile.lastName}`,
            profile.profileImage
          );

          console.log("User updated:", updateData);
        }
      }
      const { data: userData } = await authService.getCurrentUser();
      setUser(userData.currentUser);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiErrors: error.response?.data.errors || "An error occurred",
        }));
      } else {
        console.error("Unexpected error:", error);
      }

      window.scrollTo({ top: 300, behavior: "smooth" });
    } finally {
      setIsSaving(false); // Ensure state is updated after completion
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const response = await authService.resetPassword(
        user!.email,
        profile.newPassword
      );
      console.log("Password updated:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiErrors: error.response?.data.errors || "An error occurred",
        }));
      } else {
        console.error("Unexpected error:", error);
      }
    }
    setIsChangingPassword(false);
    setProfile((prev) => ({
      ...prev,
      newPassword: "",
      confirmPassword: "",
    }));
    setIsSaving(false);
  };

  const handleImageClick = async () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageName(file.name);
        setSelectedImage(reader.result as string);
        setShowImageCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCroppedImage = async (croppedImage: File, previewUrl: string) => {
    try {
      setCroppedImage(croppedImage);
      setProfile((prev) => ({ ...prev, profileImage: previewUrl }));
      setShowImageCrop(false);
      setSelectedImage(null);
      setSelectedImageName(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const resetProfileImage = () => {
    setProfile((prev) => ({ ...prev, profileImage: DEFAULT_AVATAR }));
  };
  const handleDisconnectProfile = async () => {
    try {
      const response = await authService.signout();
      console.log("Profile disconnected:", response!.data);
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting profile:", error);
    }
    setShowProfileDisconnectConfirm(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {activeTab === "settings" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:!opacity-100 transition-opacity">
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
                    <div className="relative z-10 flex flex-col items-center space-y-1">
                      <button
                        aria-label="Change profile image"
                        onClick={handleImageClick}
                        className="p-1 bg-white rounded-full text-gray-700 hover:!text-blue-600 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                      {profile.profileImage !== DEFAULT_AVATAR && (
                        <button
                          aria-label="Reset profile image"
                          onClick={resetProfileImage}
                          className="p-1 bg-white rounded-full text-gray-700 hover:!text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="file-upload"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  hidden
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-600">{profile.studentId}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <UserCircle className="w-5 h-5 mr-3" />
                  <span>Profile</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowProfileDisconnectConfirm(true)}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Hours Learned</span>
                  </div>
                  <span className="font-semibold">
                    {profile.totalHoursLearned}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-semibold">
                    {profile.coursesCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="text-sm">Active Courses</span>
                  </div>
                  <span className="font-semibold">{profile.activeCourses}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <a
                  href={`https://${profile.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Github className="w-4 h-4 mr-2" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href={`https://${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a
                  href={`https://${profile.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  <span className="text-sm">Twitter</span>
                </a>
                <a
                  href={`https://${profile.socialLinks.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm">Portfolio</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {activeTab === "profile" ? (
                // Profile View with Learning Dashboard
                <div className="space-y-8">
                  {/* Learning Statistics */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Learning Dashboard
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">
                            Time Spent
                          </h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">
                          <span
                            className="odometer"
                            data-count={profile.totalHoursLearned}
                          >
                            <Count
                              number={profile.totalHoursLearned}
                              text="h"
                            />
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total learning time
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Trophy className="w-5 h-5 text-green-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">
                            Achievements
                          </h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                          <span
                            className="odometer"
                            data-count={profile.badges.length}
                          >
                            <Count number={profile.badges.length} text="" />
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">Badges earned</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                        <div className="flex items-center mb-2">
                          <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">
                            Courses
                          </h3>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">
                          <span
                            className="odometer"
                            data-count={profile.coursesCompleted}
                          >
                            <Count number={profile.coursesCompleted} text="" />
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Completed courses
                        </p>
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
                            style={{ backgroundColor: COLORS[5] }}
                          ></div>
                          <span className="text-sm text-gray-600 mr-4">
                            test
                          </span>
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[4] }}
                          ></div>
                          <span className="text-sm text-gray-600">Study</span>
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

                    {/* Skills Distribution */}
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Skills Distribution
                      </h3>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={skillsData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {skillsData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        {skillsData.map((skill, index) => (
                          <div key={skill.name} className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <span className="text-sm text-gray-600">
                              {skill.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Badges & Achievements
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {profile.badges.map((badge, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-xl shadow-sm text-center"
                        >
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <h4 className="text-sm font-medium text-gray-800">
                            {badge.name}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Wishlist */}
                    <div>
                      <div className="flex items-center mb-4">
                        <Heart className="w-5 h-5 text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Course Wishlist
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {profile.wishlist.map((course, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-sm"
                          >
                            <h4 className="font-medium text-gray-800">
                              {course.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              by {course.instructor}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Completed Courses */}
                    <div>
                      <div className="flex items-center mb-4">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Completed Courses
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {profile.completedCourses.map((course, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-sm"
                          >
                            <h4 className="font-medium text-gray-800">
                              {course.name}
                            </h4>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Grade: {course.grade}
                              </span>
                              <span className="text-gray-600">
                                {new Date(course.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Settings View
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Account Settings
                  </h2>
                  {errors.apiErrors && errors.apiErrors.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      <strong>Error</strong>
                      {errors.apiErrors.map((error, index) => (
                        <div key={index}>⚠️ {error.message}</div>
                      ))}
                    </div>
                  )}
                  {!isChangingPassword ? (
                    <div className="space-y-8">
                      <form
                        onSubmit={handleProfileUpdate}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              First Name
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              name="firstName"
                              value={profile.firstName}
                              onChange={handleChange}
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                            {errors.firstName && (
                              <p className="text-danger">{errors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Last Name
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              name="lastName"
                              value={profile.lastName}
                              onChange={handleChange}
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                            {errors.lastName && (
                              <p className="text-danger">{errors.lastName}</p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email
                            </label>
                            <input
                              id="email"
                              type="email"
                              value={profile.email}
                              disabled
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="department"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Department
                            </label>
                            <input
                              id="department"
                              type="text"
                              value={profile.department}
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="year"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Year
                            </label>
                            <select
                              id="year"
                              value={profile.year}
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  year: e.target.value,
                                }))
                              }
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            >
                              <option>1st Year</option>
                              <option>2nd Year</option>
                              <option>3rd Year</option>
                              <option>4th Year</option>
                            </select>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Social Links
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label
                                htmlFor="github"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                GitHub
                              </label>
                              <div className="flex items-center">
                                <Github className="w-5 h-5 text-gray-400 mr-2" />
                                <input
                                  id="github"
                                  type="text"
                                  value={profile.socialLinks.github}
                                  onChange={(e) =>
                                    setProfile((prev) => ({
                                      ...prev,
                                      socialLinks: {
                                        ...prev.socialLinks,
                                        github: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="linkedin"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                LinkedIn
                              </label>
                              <div className="flex items-center">
                                <Linkedin className="w-5 h-5 text-gray-400 mr-2" />
                                <input
                                  id="linkedin"
                                  type="text"
                                  value={profile.socialLinks.linkedin}
                                  onChange={(e) =>
                                    setProfile((prev) => ({
                                      ...prev,
                                      socialLinks: {
                                        ...prev.socialLinks,
                                        linkedin: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="twitter"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Twitter
                              </label>
                              <div className="flex items-center">
                                <Twitter className="w-5 h-5 text-gray-400 mr-2" />
                                <input
                                  id="twitter"
                                  type="text"
                                  value={profile.socialLinks.twitter}
                                  onChange={(e) =>
                                    setProfile((prev) => ({
                                      ...prev,
                                      socialLinks: {
                                        ...prev.socialLinks,
                                        twitter: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="portfolio"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Portfolio Website
                              </label>
                              <div className="flex items-center">
                                <Globe className="w-5 h-5 text-gray-400 mr-2" />
                                <input
                                  id="portfolio"
                                  type="text"
                                  value={profile.socialLinks.portfolio}
                                  onChange={(e) =>
                                    setProfile((prev) => ({
                                      ...prev,
                                      socialLinks: {
                                        ...prev.socialLinks,
                                        portfolio: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Security
                        </h3>
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Lock className="w-5 h-5 mr-2" />
                          <span>Change Password</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Change Password Form
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={profile.newPassword}
                              name="newPassword"
                              onChange={handleChange}
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="text-danger">{errors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={profile.confirmPassword}
                              name="confirmPassword"
                              onChange={handleChange}
                              className="w-full text-black px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-danger">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* {passwordError && (
                        <div className="flex items-center justify-center text-red-500 text-sm">
                          <X className="w-4 h-4 mr-1" />
                          <span>{passwordError}</span>
                        </div>
                      )} */}

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(false)}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                        >
                          {isSaving ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showProfileDisconnectConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Disconnect Profile
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to disconnect your profile? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowProfileDisconnectConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnectProfile}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageCrop && selectedImage && selectedImageName && (
        <ImageCropDialog
          imageName={selectedImageName}
          imageUrl={selectedImage}
          onClose={() => {
            setShowImageCrop(false);
            setSelectedImage(null);
            setSelectedImageName(null);
          }}
          onSave={handleCroppedImage}
        />
      )}
    </div>
  );
}

export default ProfileForm;
