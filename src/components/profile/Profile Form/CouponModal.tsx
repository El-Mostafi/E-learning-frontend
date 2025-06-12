import React, { useEffect, useState } from "react";
import {
  X,
  RefreshCw,
  AlertTriangle,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import couponService from "../../../services/couponService";
import { Coupon, Toast } from "../../../services/interfaces/coupon.interface";
import axios from "axios";

export const CouponModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  coupon = null,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  coupon?: Coupon | null;
  onSave: () => void;
}) => {
  // 1. Initialize state for a new, empty form.
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 10,
    maxUses: 100,
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    code: "",
    discountPercentage: "",
    maxUses: "",
    expiryDate: "",
  });
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (coupon) {
        setFormData({
          code: coupon.code || "",
          discountPercentage: coupon.discountPercentage || 10,
          maxUses: coupon.maxUses || 100,
          expiryDate: coupon.expiryDate
            ? new Date(coupon.expiryDate).toISOString().split("T")[0]
            : "",
        });
      } else {
        setFormData({
          code: "",
          discountPercentage: 10,
          maxUses: 100,
          expiryDate: "",
        });
      }
      // Clear errors when modal opens
      setErrors({
        code: "",
        discountPercentage: "",
        maxUses: "",
        expiryDate: "",
      });
      setBackendError(null);
    }
  }, [isOpen, coupon]);

  const validateForm = () => {
    const newErrors = {
      code: "",
      discountPercentage: "",
      maxUses: "",
      expiryDate: "",
    };

    // Validate coupon code
    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters long";
    } else if (formData.code.length > 20) {
      newErrors.code = "Coupon code must be less than 20 characters";
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code =
        "Coupon code can only contain uppercase letters and numbers";
    }

    // Validate discount percentage
    if (!formData.discountPercentage || formData.discountPercentage < 1) {
      newErrors.discountPercentage = "Discount must be at least 1%";
    } else if (formData.discountPercentage > 100) {
      newErrors.discountPercentage = "Discount cannot exceed 100%";
    }

    // Validate max uses
    if (!formData.maxUses || formData.maxUses < 1) {
      newErrors.maxUses = "Maximum uses must be at least 1";
    } else if (formData.maxUses > 10000) {
      newErrors.maxUses = "Maximum uses cannot exceed 10,000";
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else {
      const selectedDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (selectedDate <= tomorrow) {
        newErrors.expiryDate = "Expiry date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setBackendError(null);

    try {
      const couponData = {
        ...formData,
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };

      if (coupon) {
        await couponService.updateCoupon(courseId, coupon._id, couponData);
        console.log("Coupon updated:", couponData);
      } else {
        const response = await couponService.createCoupon(courseId, couponData);
        console.log("Coupon created:", response);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving coupon:", error);
      if (axios.isAxiosError(error)) {
        setBackendError(
          error.response?.data.errors[0].message ||
            "An error occurred while saving the coupon. Please try again."
        );
      } else {
        setBackendError(
          "An error occurred while saving the coupon. Please try again."
        );
      }
      if(!backendError) {
        setBackendError(
          "An error occurred while saving the coupon. Please try again."
        );
      }
    } finally {
      
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const prefix = "COURSE";
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const code = `${prefix}${randomChars}`;
    setFormData((prev) => ({ ...prev, code }));
    // Clear code error when generating new code
    setErrors((prev) => ({ ...prev, code: "" }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-h-[90vh] w-full max-w-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {coupon ? "Edit Coupon" : "Create New Coupon"}
          </h3>
          <button
            title="Close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-800 font-medium">
            Course: {courseTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {backendError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{backendError}</p>
            </div>
          )}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                });
                // Clear error when user starts typing
                if (errors.code) {
                  setErrors((prev) => ({ ...prev, code: "" }));
                }
                if (backendError) {
                  setBackendError("");
                }
              }}
              placeholder="Coupon code"
              className={`w-full px-3 py-2 pr-10 text-black border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.code ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={generateCouponCode}
              className="absolute right-2 top-1/2  -translate-y-1/2 text-gray-400 hover:text-gray-600 pt-4"
              title="Generate code"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage
            </label>
            <div className="relative">
              <input
                title="Enter a number between 1 and 100"
                type="number"
                min="1"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    discountPercentage: parseInt(e.target.value),
                  });
                  // Clear error when user starts typing
                  if (errors.discountPercentage) {
                    setErrors((prev) => ({ ...prev, discountPercentage: "" }));
                  }
                }}
                className={`text-black w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.discountPercentage ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.discountPercentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountPercentage}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Uses
            </label>
            <input
              title="Enter a number greater than 0"
              type="number"
              min="1"
              value={formData.maxUses}
              onChange={(e) => {
                setFormData({ ...formData, maxUses: parseInt(e.target.value) });
                // Clear error when user starts typing
                if (errors.maxUses) {
                  setErrors((prev) => ({ ...prev, maxUses: "" }));
                }
              }}
              className={`text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.maxUses ? "border-red-500" : ""
              }`}
            />
            {errors.maxUses && (
              <p className="text-red-500 text-sm mt-1">{errors.maxUses}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <input
                title="Select a date in the future"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => {
                  setFormData({ ...formData, expiryDate: e.target.value });
                  // Clear error when user starts typing
                  if (errors.expiryDate) {
                    setErrors((prev) => ({ ...prev, expiryDate: "" }));
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                className={`text-black w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.expiryDate ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : coupon ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) => {
  return (
    <div className="fixed top-[15%] right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : toast.type === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-blue-50 border border-blue-200 text-blue-800"
          } animate-slide-in`}
        >
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          {toast.type === "info" && (
            <AlertCircle className="w-5 h-5 text-blue-600" />
          )}

          <span className="text-sm font-medium flex-1">{toast.message}</span>

          <button
            title="Close"
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Modern Confirmation Dialog
export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <Trash2 className="w-6 h-6 text-red-600" />,
      confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      iconBg: "bg-red-100",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      confirmButton: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
      iconBg: "bg-orange-100",
    },
    info: {
      icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
      confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      iconBg: "bg-blue-100",
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-auto transform transition-all duration-200 scale-100">
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full ${currentStyle.iconBg} flex items-center justify-center`}
          >
            {currentStyle.icon}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentStyle.confirmButton}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
