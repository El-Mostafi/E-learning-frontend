import React, { useState } from 'react';

interface CouponInputProps {
  onApplyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!couponCode.trim()) {
    setError('Please enter a coupon code');
    return;
  }

  setIsApplying(true);
  setError('');
  setSuccess(false);

  try {
    const result = await onApplyCoupon(couponCode.trim());

    if (result.success) {
      setSuccess(true);
      setCouponCode('');
    } else {
      setError(result.error || 'Invalid coupon code');
    }
  } catch (err) {
    setError('An unexpected error occurred :'+ err);
  } finally {
    setIsApplying(false);
  }
};


  return (
    <div className="coupon-container mb-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isApplying}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isApplying}
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </form>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      {success? (
        <p className="text-green-500 text-sm mt-2">Coupon applied successfully!</p>
      ):
      (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          <span>Enter a valid coupon code to unlock your discount.</span>
        </div>
      )
    }
    </div>
  );
};

export default CouponInput;