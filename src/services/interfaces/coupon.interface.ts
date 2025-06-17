
export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  maxUses: number;
  expiryDate: string; 
}

export interface CreateCouponRequest {
  code: string;
  discountPercentage: number;
  maxUses: number;
  expiryDate: string;
}

export interface UpdateCouponRequest {
  code?: string;
  discountPercentage?: number;
  maxUses?: number;
  expiryDate?: string; 
}

export interface CourseWithCoupons {
  courseId: string;
  courseTitle: string;
  thumbnailPreview: string;
  coupons: Coupon[];
  totalCoupons?: number;
  activeCoupons?: number;
  expiredCoupons?: number;
}

export interface AllCoursesWithCouponsResponse {
  totalCourses: number;
  courses: CourseWithCoupons[];
}

export interface SingleCourseWithCouponsResponse {
  courseId: string;
  courseTitle: string;
  thumbnailPreview: string;
  coupons: Coupon[];
}

export interface CouponResponse {
  courseTitle: string;
  coupon: Coupon;
}

export interface CreateCouponResponse {
  message: string;
  coupon: Coupon;
}

export interface UpdateCouponResponse {
  message: string;
  coupon: Coupon;
}

export interface DeleteCouponResponse {
  message: string;
}
export interface CouponFilters {
  status: 'all' | 'active' | 'expired' | 'expiring-soon';
  searchTerm: string;
  sortBy: 'code' | 'discount' | 'expiry' | 'course';
  sortOrder: 'asc' | 'desc';
  discountRange: {
    min: number;
    max: number;
  };
}
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}