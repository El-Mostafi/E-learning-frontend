import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  ShieldOff,
  AlertCircle,
  RefreshCw,
  Users,
  Camera,
  X,
} from "lucide-react";
import { FilterOptions, CreateUserDto } from "../types";
import usersService, {
  User,
  UserRole,
  UsersResponse,
  UserToEdit,
} from "../../../../services/usersService";
import axios from "axios";
import ImageCropDialog from "../ImageCropDialog";
import { cloudService } from "../../../../services/cloudService";

interface UserManagementProps {
  usersData: UsersResponse;
}
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif";

const UserManagement: React.FC<UserManagementProps> = ({ usersData }) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(usersData.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserToEdit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(usersData.currentPage);
  const [totalPages, setTotalPages] = useState(usersData.totalPages);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(usersData.totalUsers);
  const [loadingStatusUserId, setLoadingStatusUserId] = useState<string | null>(
    null
  );

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterUsers(term, filters, currentPage);
  };

  // Filter functionality
  const filterUsers = async (
    search: string,
    filterOptions: FilterOptions,
    currentPage: number
  ) => {
    try {
      setIsLoadingUsers(true);
      setUserError(null);
      console.log("Filter Options:", filterOptions, "Current Page:", currentPage, "Search:", search);
      const response = await usersService.getAllUsers({
        page: currentPage,
        limit: 8,
        role: filterOptions.role,
        status: filterOptions.status,
        search: search,
      });
      setFilteredUsers(response.users);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalUsers(response.totalUsers);
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

  // Handle filter change
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    };
    setFilters(newFilters);
    filterUsers(searchTerm, newFilters, currentPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    filterUsers(searchTerm, filters, pageNumber);
  };

  // Toggle user status
  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: string
  ) => {
    try {
      setLoadingStatusUserId(userId);
      setStatusError(null);

      // Determine new status - if no status or blocked, make active; if active, make blocked
      const newStatus =
        !currentStatus || currentStatus === "blocked" ? "active" : "blocked";

      // Call your backend API to update user status
      const response = await usersService.updateUserStatus(userId, newStatus);
      console.log(response);
      // Update the user in the local state
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      console.log(`User ${userId} status changed to ${newStatus}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data);
        setStatusError(
          err.response?.data?.message || "Failed to update user status."
        );
      } else {
        console.error("Unexpected error:", err);
        setStatusError("Failed to update user status.");
      }
    } finally {
      setLoadingStatusUserId(null);
    }
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Username",
        "Email",
        "Role",
        "Status",
        "Created Date",
        "Last Login",
        "Email Confirmed",
      ],
      ...filteredUsers.map((user) => [
        user.userName,
        user.email,
        user.role,
        user.status || "active", // Default to active if no status
        user.createdAt,
        user.lastLogin || "Never",
        user.emailConfirmed ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await usersService.deleteUserById(userId);
        filterUsers(searchTerm, filters, currentPage);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setDeleteError(
            err.response?.data?.message || "Failed to delete the User."
          );
        } else {
          console.error("Unexpected error:", err);
          setDeleteError("Unexpected error:");
        }
      }
    }
  };

  // Edit user
  const handleGetUser = async (userId: string) => {
    setShowEditModal(true);
    setIsLoadingUser(true);
    console.log(filteredUsers);
    try {
      const response = await usersService.getUserById(userId);
      console.log(" User Data:", response);
      if (response.role === "student") {
        response.biography = undefined;
        response.yearsOfExperience = undefined;
        response.expertise = undefined;
      } else if (response.role === "instructor") {
        response.educationLevel = undefined;
        response.fieldOfStudy = undefined;
      }
      setSelectedUser(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data);
        setEditError(
          err.response?.data?.message || "Failed to fetch User data."
        );
      } else {
        console.error("Unexpected error:", err);
        setEditError("Unexpected error:");
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const UserModal = ({ user, onClose, title }: any) => {
    const [formData, setFormData] = useState<
      CreateUserDto & {
        id?: number;
        status?: string;
        emailConfirmed?: boolean;
        profileImg?: string;
        publicId?: string;
      }
    >(
      user || {
        email: "",
        password: "",
        userName: "",
        role: "student" as UserRole,
        educationLevel: "",
        fieldOfStudy: "",
        expertise: "",
        yearsOfExperience: 0,
        biography: "",
      }
    );
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [createError, setCreateError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showImageCrop, setShowImageCrop] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<File | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string | null>(
      null
    );
    useEffect(() => {
      setErrors({});
      setCreateError(null);
      setEditError(null);
    }, []);
    const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }

      if (!formData.userName) {
        newErrors.userName = "Username is required";
      } else if (
        formData.userName.length < 3 &&
        formData.userName.length > 20
      ) {
        newErrors.userName = "Username must be between 3 and 20 characters";
      }
      if (!user && !formData.password) {
        if (!formData.password.trim()) {
          newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(formData.password)) {
          newErrors.password =
            "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(formData.password)) {
          newErrors.password =
            "Password must contain at least one lowercase letter.";
        } else if (!/[0-9]/.test(formData.password)) {
          newErrors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>/]/.test(formData.password)) {
          newErrors.password =
            "Password must contain at least one special character.";
        }
        newErrors.password = "Password is required";
      }
      if (!formData.profileImg)
        newErrors.profileImg = "Profile image is required";

      // Role-specific validation
      if (formData.role === "student") {
        if (!formData.educationLevel)
          newErrors.educationLevel = "Education level is required for students";
        if (!formData.fieldOfStudy)
          newErrors.fieldOfStudy = "Field of study is required for students";
      }

      if (formData.role === "instructor") {
        if (!formData.expertise)
          newErrors.expertise = "Expertise is required for instructors";
        if (!formData.yearsOfExperience || formData.yearsOfExperience < 0)
          newErrors.yearsOfExperience =
            "Years of experience is required for instructors";
        if (!formData.biography)
          newErrors.biography = "Biography is required for instructors";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleEditUser = async (user: UserToEdit) => {
      setEditError(null);
      try {
        console.log("User to update: ", user);
        if (user.role === "student") {
          user.biography = undefined;
          user.yearsOfExperience = undefined;
          user.expertise = undefined;
        } else if (user.role === "instructor") {
          user.educationLevel = undefined;
          user.fieldOfStudy = undefined;
        }
        const response = await usersService.updateUser(user.id, user);
        console.log(response);
        setFilteredUsers(
          filteredUsers.map((u) => {
            if (u.id === user.id) {
              return response;
            }
            return u;
          })
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setEditError(
            err.response?.data?.message || "Failed to update User data."
          );
        } else {
          console.error("Unexpected error:", err);
          setEditError("Unexpected error:");
        }
      } finally {
        setIsSubmitting(false);
        if (!editError && Object.keys(errors).length === 0) {
          onClose();
        }
      }
    };
    const handleAddUser = async (user: CreateUserDto) => {
      setCreateError(null);
      try {
        const response = await usersService.createUser(user);
        console.log(response);
        filterUsers(searchTerm, filters, currentPage);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data);
          setCreateError(
            err.response?.data?.message || "Failed to Create User data."
          );
        } else {
          console.error("Unexpected error:", err);
          setCreateError("Unexpected error:");
        }
      } finally {
        setIsSubmitting(false);
        if (!createError && Object.keys(errors).length === 0) {
          onClose();
        }
      }
    };
    const handleSubmit = async () => {
      if (validateForm()) {
        setIsSubmitting(true);
        if (title === "Edit User") {
          let updatedProfileImg = formData.profileImg;
          let updatedPublicId = formData.publicId;

          try {
            if (
              DEFAULT_AVATAR !== formData.profileImg &&
              user!.profileImg !== formData.profileImg
            ) {
              const { data: signatureData } =
                await cloudService.getSignatureImage();
              if (!signatureData) return console.error("Signature is missing.");
              if (!croppedImage) return console.error("Image is missing.");

              const { data: uploadData } = await cloudService.uploadFile(
                croppedImage,
                signatureData,
                "images_preset"
              );

              console.log("Uploaded asset:", uploadData);

              // Update local variables with new values
              updatedProfileImg = uploadData.secure_url;
              updatedPublicId = uploadData.public_id;

              // Still update state for UI purposes
              setFormData((prev) => ({
                ...prev,
                profileImg: uploadData.secure_url,
                publicId: uploadData.public_id,
              }));
            }
          } catch (error) {
            console.error("Error updating profile image:", error);
            setIsSubmitting(false);
            return;
          }

          // Use the updated variables
          handleEditUser({
            id: user.id,
            email: formData.email,
            userName: formData.userName,
            profileImg: updatedProfileImg || user.profileImg,
            publicId: updatedPublicId || user.publicId,
            role: formData.role,
            status: user.status || "active",
            educationLevel: formData.educationLevel || "",
            fieldOfStudy: formData.fieldOfStudy || "",
            expertise: formData.expertise || "",
            yearsOfExperience: formData.yearsOfExperience || 0,
            biography: formData.biography || "",
          });
        } else if (title === "Add User") {
          handleAddUser({
            email: formData.email,
            password: formData.password,
            userName: formData.userName,
            role: formData.role,
            educationLevel: formData.educationLevel || "",
            fieldOfStudy: formData.fieldOfStudy || "",
            expertise: formData.expertise || "",
            yearsOfExperience: formData.yearsOfExperience || 0,
            biography: formData.biography || "",
          });

        }else{
          setIsSubmitting(false);
        }
      }
    };
    const resetProfileImage = () => {
      setFormData((prev) => ({ ...prev, profileImage: DEFAULT_AVATAR }));
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

    const handleCroppedImage = async (
      croppedImage: File,
      previewUrl: string
    ) => {
      try {
        setCroppedImage(croppedImage);
        setFormData((prev) => ({ ...prev, profileImg: previewUrl }));
        setShowImageCrop(false);
        setSelectedImage(null);
        setSelectedImageName(null);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {isLoadingUser ? (
            <div className="container text-center py-5">
              <div className="spinner-border text-primary\" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              {editError && (
                <div className="alert alert-danger" role="alert">
                  <strong>Error</strong>
                  <div>⚠️ {editError}</div>
                </div>
              )}
              {createError && (
                <div className="alert alert-danger" role="alert">
                  <strong>Error</strong>
                  <div>⚠️ {createError}</div>
                </div>
              )}
              <div>
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Basic Information
                  </h4>
                </div>
                <div className="flex justify-center">
                  <div className="relative group mb-4 ">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                      <img
                        src={formData.profileImg || DEFAULT_AVATAR}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

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
                        {formData.profileImg !== DEFAULT_AVATAR && (
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

                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      hidden
                    />
                  </div>
                  {errors.profileImg && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.profileImg}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      title="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      title="Username"
                      type="text"
                      value={formData.userName}
                      onChange={(e) =>
                        setFormData({ ...formData, userName: e.target.value })
                      }
                      className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.userName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.userName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.userName}
                      </p>
                    )}
                  </div>

                  {!user && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          title="Password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      title="Role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {user && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        title="Status"
                        value={formData.status || "active"}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  )}

                  {/* Student-specific fields */}
                  {formData.role === "student" && (
                    <>
                      <div className="md:col-span-2">
                        <h4 className="text-md font-medium text-gray-900 mb-3 mt-4">
                          Student Information
                        </h4>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Education Level *
                        </label>
                        <select
                          title="Education Level"
                          value={formData.educationLevel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              educationLevel: e.target.value,
                            })
                          }
                          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.educationLevel
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Education Level</option>
                          <option value="high_school">High School</option>
                          <option value="associate">Associate Degree</option>
                          <option value="bachelor">Bachelor's Degree</option>
                          <option value="master">Master's Degree</option>
                          <option value="doctorate">Doctorate</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.educationLevel && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.educationLevel}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field of Study *
                        </label>
                        <input
                          type="text"
                          value={formData.fieldOfStudy}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fieldOfStudy: e.target.value,
                            })
                          }
                          className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.fieldOfStudy
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., Computer Science, Business, etc."
                        />
                        {errors.fieldOfStudy && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.fieldOfStudy}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Instructor-specific fields */}
                  {formData.role === "instructor" && (
                    <>
                      <div className="md:col-span-2">
                        <h4 className="text-md font-medium text-gray-900 mb-3 mt-4">
                          Instructor Information
                        </h4>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expertise *
                        </label>
                        <input
                          type="text"
                          value={formData.expertise}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expertise: e.target.value,
                            })
                          }
                          className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.expertise
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., Web Development, Data Science, etc."
                        />
                        {errors.expertise && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.expertise}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years of Experience *
                        </label>
                        <input
                          title="Years of Experience"
                          type="number"
                          min="0"
                          value={formData.yearsOfExperience}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              yearsOfExperience: parseInt(e.target.value) || 0,
                            })
                          }
                          className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.yearsOfExperience
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.yearsOfExperience && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.yearsOfExperience}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biography * (max 500 characters)
                        </label>
                        <textarea
                          value={formData.biography}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              biography: e.target.value,
                            })
                          }
                          rows={4}
                          maxLength={500}
                          className={`text-black w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.biography
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Tell us about your background and teaching experience..."
                        />
                        <div className="flex justify-between items-center mt-1">
                          {errors.biography && (
                            <p className="text-red-500 text-xs">
                              {errors.biography}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs ml-auto">
                            {formData.biography?.length || 0}/500
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
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
  };

  const UserListSkeleton = () => {
    return (
      <div className="w-[90%] py-4 center space-y-4">
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
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{userError}</p>
      <button
        onClick={() => {
          filterUsers(searchTerm, filters, currentPage);
        }}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );

  if (userError || !filterUsers) {
    return <ErrorDisplay />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              User Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and monitor all platform users
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
          <button
            onClick={() => {
              filterUsers(searchTerm, filters, currentPage);
            }}
            disabled={isLoadingUsers}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoadingUsers ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              title="Status"
              value={filters.status || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>

            <select
              title="Role"
              value={filters.role || "all"}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">⚠️ {deleteError}</div>
            <button
              onClick={() => setDeleteError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {statusError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">⚠️ {statusError}</div>
            <button
              onClick={() => setStatusError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoadingUsers ? (
            <UserListSkeleton />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Confirmed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userStatus = user.status || "blocked"; // Default to active if no status
                  const isLoadingStatus = loadingStatusUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.profileImg}
                            alt={user.userName.replace("|", " ")}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.userName.replace("|", " ")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "instructor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            userStatus === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userStatus === "active" ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.emailConfirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.emailConfirmed ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === "student"
                          ? `${user.coursesEnrolled || 0} courses enrolled`
                          : user.role === "instructor"
                          ? `${user.coursesCreated || 0} courses created`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.role !== "admin" && (
                          <div className="flex items-center justify-end space-x-2">
                            {/* Status Toggle Button */}
                            <button
                              title={
                                userStatus === "active"
                                  ? "Block User"
                                  : "Activate User"
                              }
                              onClick={() =>
                                handleToggleUserStatus(user.id, userStatus)
                              }
                              disabled={isLoadingStatus}
                              className={`p-1 rounded transition-colors ${
                                userStatus === "active"
                                  ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                                  : "text-green-600 hover:text-green-900 hover:bg-green-50"
                              } ${
                                isLoadingStatus
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isLoadingStatus ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                              ) : userStatus === "active" ? (
                                <ShieldOff className="w-4 h-4" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              title="Edit User"
                              onClick={() => {
                                handleGetUser(user.id);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              title="Delete User"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {totalUsers} users
      </div>

      {/* Pagination */}
      <div className="page-nav-wrap pt-5 text-center">
        <ul className="inline-flex gap-2 justify-center items-center">
          {currentPage > 1 && (
            <li>
              <a
                title="Previous"
                className="page-numbers"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              >
                <i className="far fa-arrow-left"></i>
              </a>
            </li>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) => {
              return (
                pageNum <= 2 || // first 2
                pageNum > totalPages - 2 || // last 2
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) // around current
              );
            })
            .reduce((acc, pageNum, idx, arr) => {
              if (idx > 0 && pageNum - arr[idx - 1] > 1) {
                acc.push("...");
              }
              acc.push(pageNum);
              return acc;
            }, [] as (number | string)[])
            .map((item, index) => (
              <li key={index}>
                {item === "..." ? (
                  <span className="page-numbers dots">...</span>
                ) : (
                  <a
                    className={`page-numbers ${
                      item === currentPage ? "current" : ""
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof item === "number") {
                        handlePageChange(item);
                      }
                    }}
                  >
                    {item}
                  </a>
                )}
              </li>
            ))}

          {currentPage < totalPages && (
            <li>
              <a
                title="Next"
                className="page-numbers"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              >
                <i className="far fa-arrow-right"></i>
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Modals */}
      {showAddModal && (
        <UserModal
          title="Add New User"
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && (
        <UserModal
          user={selectedUser}
          title="Edit User"
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
