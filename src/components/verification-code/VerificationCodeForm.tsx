import React, { useState, useEffect, useRef } from "react";
import { Mail, Timer, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { useLocation } from "react-router-dom";

const VerificationCodeForm = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const email = location.state?.email || "No email provided";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (email === "No email provided") window.location.href = "/";
  }, [email]);
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setIsError(false);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value !== "") {
        verifyCode([...newCode.slice(0, 5), value]);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (codeArray: string[]) => {
    setIsVerifying(true);
    setIsError(false);

    try {
      const response1 = await authService.verifyOtp(email, codeArray.join(""));
      console.log(response1.data);
      const response = await authService.verifyEmail(email);
      console.log(response.data);
      setIsVerified(true);
      await setTimeout(() => {
        window.location.href = "/sign-in";
      }, 2000);
    } catch (error) {
      console.error("Verification failed:", error);
      setIsError(true);
    }
    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await authService.resendEmail(email, "Verification");
      setTimeLeft(1800);
      setIsResending(false);
      setIsVerified(false);
      setIsError(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend email failed:", error);
      setIsError(true);
    }
    setIsResending(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <style>
        {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-8px); }
              75% { transform: translateX(8px); }
            }
            .shake {
              animation: shake 0.3s ease-in-out;
            }
          `}
      </style>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Enter Verification Code
          </h1>
          <p className="text-gray-600">
            We've sent a verification code to your email address. Please enter
            it below.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                aria-label={`Digit ${index + 1} of verification code`}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerified}
                className={`w-10 h-12 sm:w-12 sm:h-14 text-black text-center text-xl font-semibold border-2 rounded-lg outline-none transition-all
                    ${
                      isVerified
                        ? "border-green-500 bg-green-50 text-green-700"
                        : isError
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
              />
            ))}
          </div>

          {isError && (
            <div className="flex items-center justify-center text-red-500 text-sm">
              <X className="w-4 h-4 mr-1" />
              <span>Incorrect code. Please try again.</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Timer className="w-4 h-4 mr-1" />
              <span>Code expires in: {formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleResendCode}
              disabled={isResending || timeLeft > 1740}
              className={`text-blue-600 hover:text-blue-700 font-medium transition-colors ${
                isResending || timeLeft > 1740
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </div>

          {isVerified ? (
            <button className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Verified</span>
            </button>
          ) : (
            <button
              onClick={() => verifyCode(code)}
              disabled={code.some((digit) => !digit) || isVerifying}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-300
                  ${
                    isVerifying
                      ? "bg-blue-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  text-white focus:ring-2 focus:ring-blue-200`}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-600">
          Didn't receive the code?{" "}
          <Link to="/contact" className="text-blue-600 hover:text-blue-700">
          Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerificationCodeForm;
