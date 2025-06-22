import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { stripeService } from "../../services/stripeService";
import { cartService } from "../../services/cartService";
import { CheckCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cartDetails } from "../../services/interfaces/cart.interface";

const CheckoutArea = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [cart, setCart] = useState<cartDetails | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await cartService.getCart();
      if (!cartData || cartData.courses.length === 0) {
        navigate("/shop-cart");
      } else {
        setCart(cartData);
      }
      console.log("Cart data:", cartData);
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

      console.log("client secretttt", response.data.clientSecret);

      if (confirmError) {
        setProcessing(false);
        return setError(confirmError.message!);
      }

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      navigate("/my-courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    }
    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        lineHeight: "1.5",
        "::placeholder": {
          color: "#9ca3af",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  return (
    <>
      <style>
        {`
          .stripe-card-element {
            padding: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            background-color: #ffffff;
            transition: all 0.2s ease;
          }
          
          .stripe-card-element.StripeElement--focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .stripe-card-element.StripeElement--invalid {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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

          .toast-enter {
            animation: slideIn 0.5s ease forwards;
          }

          .toast-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 99999;
          }

          .payment-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            color: white;
            padding: 2rem;
            margin-bottom: 2rem;
          }

          .security-badge {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
          }

          .checkout-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem;
          }

          .payment-form {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            border: 1px solid #e5e7eb;
          }

          .amount-display {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: center;
          }

          .pay-button {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            font-size: 16px;
            padding: 16px 32px;
            width: 100%;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .pay-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }

          .pay-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .card-input-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.75rem;
          }

          .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            color: #dc2626;
            padding: 0.75rem;
            margin-top: 0.75rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .security-features {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
          }

          .security-feature {
            display: flex;
            align-items: center;
            gap: 0.25rem;
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="checkout-container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600">Secure payment </p>
          </div>

          {cart && (
            <div className="payment-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <div className="security-badge">
                  <Lock className="w-4 h-4" />
                  Secure Payment
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">
                ${cart.total.toFixed(2)}
              </div>
              <p className="opacity-90">
                {cart.courses.length} course{cart.courses.length > 1 ? "s" : ""}{" "}
                selected
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="card-input-label">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Details
            </div>

            <div className="stripe-card-element">
              <CardElement options={cardElementOptions} />
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="pay-button"
                disabled={!stripe || processing}
              >
                {processing ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  cart && `Pay $${cart.total.toFixed(2)}`
                )}
              </button>
            </div>

            <div className="security-features">
              <div className="security-feature">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>SSL Encrypted</span>
              </div>
              <div className="security-feature">
                <Lock className="w-4 h-4 text-green-600" />
                <span>PCI Compliant</span>
              </div>
              <div className="security-feature">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Stripe Secured</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutArea;
