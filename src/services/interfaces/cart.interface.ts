export interface cartDetails {
    userId: string;
    _id: string;
    courses: {
      _id: string;
      title: string;
      thumbnailPreview: string;
      price: number;
      appliedCoupon?: {
        code: string;
        discountPercentage: number;
      };
      discountedPrice: number;
    }[];
    subtotal: number;
    totalDiscount: number;
    total: number;
  }