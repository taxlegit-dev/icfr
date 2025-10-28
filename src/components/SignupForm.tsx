"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SignupForm() {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(pathname === "/login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.phone) {
      setMessage("Please enter phone number");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage("OTP sent to your phone");
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("Error sending OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      setMessage("Please enter OTP");
      return;
    }
    if (!isLogin && (!formData.firstName || !formData.lastName)) {
      setMessage("Please fill all fields");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
          firstName: isLogin ? undefined : formData.firstName,
          lastName: isLogin ? undefined : formData.lastName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(isLogin ? "Login successful!" : "Signup successful!");
        setTimeout(() => {
          setFormData({ firstName: "", lastName: "", phone: "", otp: "" });
          setOtpSent(false);
          setMessage("");
        }, 2000);
      } else {
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      setMessage("Error verifying OTP");
    }
    setLoading(false);
  };

  const toggleMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
    setFormData({ firstName: "", lastName: "", phone: "", otp: "" });
    setOtpSent(false);
    setMessage("");
    // Navigate to the appropriate page
    window.location.href = newIsLogin ? "/login" : "/signup";
  };

  return (
    <div className=" text-black min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isLogin ? "Login to continue" : "Sign up to get started"}
          </p>

          <div className="space-y-4">
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: !isLogin ? "200px" : "0px",
                opacity: !isLogin ? 1 : 0,
              }}
            >
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              disabled={otpSent}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            />

            {!otpSent ? (
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            ) : (
              <div
                className="space-y-4 animate-fade-in"
                style={{
                  animation: "fadeIn 0.3s ease-in",
                }}
              >
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                />
                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    `Verify & ${isLogin ? "Login" : "Signup"}`
                  )}
                </button>
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setFormData({ ...formData, otp: "" });
                    setMessage("");
                  }}
                  className="w-full text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all text-sm"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {message && (
              <div
                className={`text-center p-3 rounded-lg transition-all duration-300 ${
                  message.includes("successful")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                style={{
                  animation: "slideDown 0.3s ease-out",
                }}
              >
                {message}
              </div>
            )}

            <div className="text-center pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
