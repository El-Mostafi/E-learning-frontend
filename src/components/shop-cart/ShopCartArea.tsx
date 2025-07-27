import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/api";
import { cartDetails } from "../../services/interfaces/cart.interface";
// import { enrollmentService } from "../../services/enrollmentService";
// import { cartService } from "../../services/cartService";
import { ShoppingBag, ShieldCheck } from 'lucide-react';

const ShopCartArea = () => {
  const [cart, setCart] = useState<cartDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponInputs, setCouponInputs] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get<cartDetails>("/cart");
        setCart(response.data);
        console.log("Cart data:", response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (courseId: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete("/cart/remove", { data: { courseId } });
      const { data } = await axiosInstance.get<cartDetails>("/cart");
      setCart(data);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCouponApply = async (courseId: string) => {
    const code = couponInputs[courseId];
    if (!code) return;

    try {
      setLoading(true);
      await axiosInstance.post("/cart/apply-coupon", {
        courseId,
        couponCode: code,
      });
      const { data } = await axiosInstance.get<cartDetails>("/cart");
      setCart(data);
      setCouponInputs((prev) => ({ ...prev, [courseId]: "" }));
    } catch (error) {
      console.error("Coupon application failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.courses.length === 0) {
    return (
      <div className="container min-vh-100 d-flex align-items-center">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <div className="p-4 p-md-5 mb-4">
              <div className="card-body">
                <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                <h3 className="display-5 mb-3">Your cart is empty</h3>
                <p className="lead text-muted mb-4">
                  Looks like you haven't added any courses to your cart yet.
                </p>
                <Link to="/courses" className="theme-btn">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-100 py-5 px-5" >
        <div className="row g-4 w-full">
          {/* Cart Items Section */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h3 mb-4">
                  Shopping Cart ({cart.courses.length})
                </h2>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "45%" }}>Course</th>
                        <th className="text-end">Price</th>
                        <th className="text-center">Coupon</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.courses.map((course) => (
                        <tr key={course._id}>
                          {/* Course Thumbnail and Title */}
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <button
                                title="Remove Course"
                                onClick={() => handleRemoveFromCart(course._id)}
                                className="btn btn-link text-danger p-0"
                              >
                                <i className="fas fa-trash fa-sm"></i>
                              </button>
                              <img
                                src={course.thumbnailPreview || "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"}
                                alt={course.title}
                                className="rounded-2"
                                style={{
                                  width: "80px",
                                  height: "45px",
                                  objectFit: "cover",
                                }}
                              />
                              <h3 className="h6 mb-0 text-truncate">
                                {course.title}
                              </h3>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="text-end">
                            <div className="d-flex flex-column">
                              {course.appliedCoupon ? (
                                <>
                                  <span className="text-decoration-line-through text-muted small">
                                    ${course.price.toFixed(2)}
                                  </span>
                                  <span className="text-danger fw-semibold">
                                    ${course.discountedPrice.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span>${course.price.toFixed(2)}</span>
                              )}
                            </div>
                          </td>

                          {/* Coupon Section */}
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div
                                className="input-group input-group-sm"
                                style={{ maxWidth: "200px" }}
                              >
                                <input
                                  type="text"
                                  placeholder="Coupon code"
                                  value={couponInputs[course._id] || ""}
                                  onChange={(e) =>
                                    setCouponInputs((prev) => ({
                                      ...prev,
                                      [course._id]: e.target.value,
                                    }))
                                  }
                                  className="form-control border-end-0"
                                />
                                <button
                                  onClick={() => handleCouponApply(course._id)}
                                  className="btn btn-outline-primary"
                                >
                                  Apply
                                </button>
                              </div>
                              {course.appliedCoupon && (
                                <span className="badge bg-success bg-opacity-10 text-success">
                                  {course.appliedCoupon.code}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Subtotal */}
                          <td className="text-end fw-semibold">
                            ${course.discountedPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h3 className="h5 mb-4">Order Summary</h3>

                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span>Subtotal:</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  {cart.totalDiscount > 0 && (
                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span>Discounts:</span>
                      <span className="text-danger">
                        -${cart.totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="fw-semibold">Total:</span>
                    <span className="fw-semibold">
                      ${cart.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {cart.total === 0 && (
                  <div className="d-grid mt-4">
                    <Link
                      to="/my-courses"
                      className="btn btn-primary btn-lg w-100"
                      // onClick={async () => {
                      //   try {
                      //     for (const course of cart.courses) {
                      //       await enrollmentService.enroll(
                      //         course._id
                      //       );
                      //     }
                      //   } catch (error) {
                      //     console.error("Enrollment failed:", error);
                      //   }
                      //   try {
                      //     const response = await cartService.clearCart();
                      //     if (response){
                      //       setCart(null);
                      //     }
                      //   }catch (error) {
                      //     console.error("Error clearing cart:", error);
                      //   }
                      // }}
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                )}
                {cart.total > 0 && (
                  <div className="d-grid mt-4">
                    <Link
                      to="/checkout"
                      className="btn btn-primary btn-lg w-100"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                )}

                <div className="mt-3 text-center small text-muted">
                  <i className="fas fa-lock me-2"></i>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
                  <Link 
                    to="/courses" 
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Continue Shopping
                  </Link>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <ShieldCheck size={16} className="mr-2" />
                    Secure checkout with SSL encryption
                  </div>
                </div>
              </div>
        </div>
    </>
  );
};

export default ShopCartArea;
