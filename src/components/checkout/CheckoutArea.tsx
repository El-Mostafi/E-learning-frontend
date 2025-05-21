import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { stripeService } from "../../services/stripeService";
import { cartService } from "../../services/cartService";
import { CheckCircle } from "lucide-react";
import { enrollmentService } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";

const CheckoutArea = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [cart, setCart] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await cartService.getCart();
      if (!cartData || cartData.courses.length === 0) {
        navigate("/shop-cart");
      } else{
        setCart(cartData)
      }
    };
    fetchCart();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!stripe || !elements) {
      return;
    }
    setProcessing(true);

    try {
      // Get cart details first
      const cart = await cartService.getCart();

      // Create payment intent with cart amount
      const response = await stripeService.createPaymentIntent();

      // Create payment method
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)!,
        });

      if (pmError) {
        setProcessing(false);
        return setError(pmError.message!);
      }

      // Confirm payment with client secret
      const { error: confirmError } = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      console.log("client secretttt", response.data.clientSecret)

      if (confirmError) {
        setProcessing(false);
        return setError(confirmError.message!);
      }
      
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    }
    setProcessing(false);
  };

  // Rest of the component remains the same...
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <>
      <style>
        {`
          .stripe-card-element {
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            background-color: white;
          }
          
          .stripe-card-element.StripeElement--focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 1px #4f46e5;
          }
          
          .stripe-card-element.StripeElement--invalid {
            border-color: #ef4444;
          }

          @keyframes slideIn {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(-100%);
              opacity: 0;
            }
          }

          .toast-enter {
            animation: slideIn 0.5s ease forwards;
          }

          .toast-exit {
            animation: slideOut 0.5s ease forwards;
          }
        .toast-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 99999;
          }
        `}
      </style>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="toast-container">
          <div className="bg-green-50 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 border border-green-200 toast-enter">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-medium">Payment succeeded!</span>
          </div>
        </div>
      )}
      <section className="checkout-section fix section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form onSubmit={handleSubmit}>
              {cart && (
                          <div className="total-amount mb-4 text-lg font-semibold">
                            Total to Pay: ${cart.total.toFixed(2)}
                          </div>
                        )}
                <div className="row g-4">
                  <div className="col-md-5 col-lg-4 col-xl-3">
                    <div className="checkout-radio">
                      <p className="primary-text">Select any one</p>
                      <div className="checkout-radio-wrapper">
                        <div className="checkout-radio-single">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="cCard"
                            name="pay-method"
                            value="Credit/Debit Cards"
                          />
                          <label htmlFor="cCard">Credit/Debit Cards</label>
                        </div>
                        <div className="checkout-radio-single">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="paypal"
                            name="pay-method"
                            value="PayPal"
                          />
                          <label htmlFor="paypal">PayPal</label>
                        </div>
                        <div className="checkout-radio-single">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="payoneer"
                            name="pay-method"
                            value="Payoneer"
                          />
                          <label htmlFor="payoneer">Payoneer</label>
                        </div>
                        <div className="checkout-radio-single">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="visa"
                            name="pay-method"
                            value="Visa"
                          />
                          <label htmlFor="visa">Visa</label>
                        </div>
                        <div className="checkout-radio-single">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="mastercard"
                            name="pay-method"
                            value="Mastercard"
                          />
                          <label htmlFor="mastercard">Mastercard</label>
                        </div>
                        <div className="checkout-radio-single">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="fastPay"
                            name="pay-method"
                            value="Fastpay"
                          />
                          <label htmlFor="fastPay">Fastpay</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 col-lg-8 col-xl-9">
                    <div className="checkout-single-wrapper">
                      <div className="checkout-single boxshado-single">
                        <h4>Billing address</h4>
                        <div className="checkout-single-form">
                          <div className="row g-4">
                            <div className="col-lg-6">
                              <div className="input-single">
                                <input
                                  type="text"
                                  name="user-first-name"
                                  id="userFirstName"
                                  tabIndex={0}
                                  placeholder="First Name"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-single">
                                <input
                                  type="text"
                                  name="user-last-name"
                                  id="userLastName"
                                  tabIndex={0}
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-single">
                                {/* <input
                                  type="email"
                                  name="user-check-email"
                                  id="userCheckEmail"
                                  required
                                  placeholder="Your Email"
                                /> */}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-single">
                                <select
                                  className="form-select"
                                  name="country"
                                  defaultValue="01"
                                  title="Country"
                                >
                                  <option value="01">USA</option>
                                  <option value="02">Aus</option>
                                  <option value="03">UK</option>
                                  <option value="04">NED</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-single">
                                <textarea
                                  name="user-address"
                                  id="userAddress"
                                  placeholder="Address"
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="checkout-single checkout-single-bg">
                        <h4>Payment Methods</h4>
                        <div className="checkout-single-form">
                          <p className="payment"></p>
                          <div className="row g-3">
                            <div className="col-lg-12">
                              <div className="input-single">
                                <label>Card Details</label>
                                <div className="stripe-card-element">
                                  <CardElement options={cardElementOptions} />
                                </div>
                                {error && (
                                  <div className="text-red-500 mt-2">
                                    {error}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="input-single input-check payment-save">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="save-for-next"
                            id="saveForNext"
                          />
                          <label htmlFor="saveForNext">
                            Save for my next payment
                          </label>
                        </div>
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="theme-btn"
                            disabled={!stripe || processing}
                          >
                            {processing ? "Processing..." : cart && `Pay ${cart.total.toFixed(2)}$`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutArea;
