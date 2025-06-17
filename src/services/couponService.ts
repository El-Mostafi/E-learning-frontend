// services/couponService.ts

import axiosInstance from "./api";
import {
  Coupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  AllCoursesWithCouponsResponse,
  SingleCourseWithCouponsResponse,
  CouponResponse,
  CreateCouponResponse,
  UpdateCouponResponse,
  DeleteCouponResponse,
} from "./interfaces/coupon.interface";

const CouponService = {
  createCoupon: async (
    courseId: string,
    couponData: CreateCouponRequest
  ): Promise<CreateCouponResponse> => {
    const response = await axiosInstance.post<CreateCouponResponse>(
      `/instructors/courses/${courseId}/coupons`,
      couponData
    );
    return response.data;
  },

  getAllInstructorCoursesWithCoupons:
    async (): Promise<AllCoursesWithCouponsResponse> => {
      const response = await axiosInstance.get<AllCoursesWithCouponsResponse>(
        "/instructors/courses/coupons"
      );
      return response.data;
    },

  getCourseCoupons: async (
    courseId: string
  ): Promise<SingleCourseWithCouponsResponse> => {
    const response = await axiosInstance.get<SingleCourseWithCouponsResponse>(
      `/instructors/courses/${courseId}/coupons`
    );
    return response.data;
  },

  getCouponById: async (
    courseId: string,
    couponId: string
  ): Promise<CouponResponse> => {
    const response = await axiosInstance.get<CouponResponse>(
      `/instructors/courses/${courseId}/coupons/${couponId}`
    );
    return response.data;
  },

  updateCoupon: async (
    courseId: string,
    couponId: string,
    updateData: UpdateCouponRequest
  ): Promise<UpdateCouponResponse> => {
    const response = await axiosInstance.put<UpdateCouponResponse>(
      `/instructors/courses/${courseId}/coupons/${couponId}`,
      updateData
    );
    return response.data;
  },

  deleteCoupon: async (
    courseId: string,
    couponId: string
  ): Promise<DeleteCouponResponse> => {
    const response = await axiosInstance.delete<DeleteCouponResponse>(
      `/instructors/courses/${courseId}/coupons/${couponId}`
    );
    return response.data;
  },

  isCouponActive: (coupon: Coupon): boolean => {
    return new Date(coupon.expiryDate) > new Date();
  },

  getDaysUntilExpiry: (coupon: Coupon): number => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  formatExpiryDate: (coupon: Coupon): string => {
    return new Date(coupon.expiryDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  getCouponStatus: (coupon: Coupon): "active" | "expired" | "expiring-soon" => {
    const daysUntilExpiry = CouponService.getDaysUntilExpiry(coupon);

    if (daysUntilExpiry < 0) {
      return "expired";
    } else if (daysUntilExpiry <= 7) {
      return "expiring-soon";
    } else {
      return "active";
    }
  },

  filterCouponsByStatus: (
    coupons: Coupon[],
    status: "active" | "expired" | "expiring-soon"
  ): Coupon[] => {
    return coupons.filter(
      (coupon) => CouponService.getCouponStatus(coupon) === status
    );
  },

  getCouponStats: (coupons: Coupon[]) => {
    const now = new Date();
    const active = coupons.filter(
      (coupon) => new Date(coupon.expiryDate) > now
    );
    const expired = coupons.filter(
      (coupon) => new Date(coupon.expiryDate) <= now
    );
    const expiringSoon = active.filter(
      (coupon) => CouponService.getDaysUntilExpiry(coupon) <= 7
    );

    return {
      total: coupons.length,
      active: active.length,
      expired: expired.length,
      expiringSoon: expiringSoon.length,
      totalDiscountOffered: coupons.reduce(
        (sum, coupon) => sum + coupon.discountPercentage,
        0
      ),
      averageDiscount:
        coupons.length > 0
          ? Math.round(
              coupons.reduce(
                (sum, coupon) => sum + coupon.discountPercentage,
                0
              ) / coupons.length
            )
          : 0,
    };
  },
};

export default CouponService;
