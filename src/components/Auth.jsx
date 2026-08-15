import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowRight,
  ArrowLeft,
  Moon,
  Sun,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Auth({ initialMode = "login", onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup, resetPassword } = useAuth();
  const { darkMode, toggleDarkMode, accentColor } = useTheme();

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setError("");
    setSuccessMsg("");
  }, [initialMode]);

  // Password Security Criteria
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasLength = password.length >= 8;

  const passedCriteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial, hasLength].filter(Boolean).length;
  const strengthLevels = ["Very Weak", "Fair", "Good", "Strong", "Excellent"];
  const strengthPercent = (passedCriteriaCount / 5) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (passedCriteriaCount < 4) {
        setError("Please fulfill at least 4 password security criteria.");
        return;
      }
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name.trim());
        setSuccessMsg("Account created! A verification link was sent to your email.");
      }
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email address or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered.");
      } else {
        setError(err.message || "Failed to authenticate.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email above to receive a password reset link.");
      return;
    }
    try {
      await resetPassword(email);
      setSuccessMsg("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("Could not send reset email. Ensure the address is valid.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 flex items-center justify-center p-4 relative">
      {/* Top Navbar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center max-w-xl mx-auto">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 cursor-pointer"
          >
            <span>Back to Home</span>
          </button>
        )}
        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle visual theme"
            className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition text-zinc-400 cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white">Task It</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Personal Task & Notes Workspace
            </p>
          </div>

          <div className="flex border-b border-zinc-800 mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccessMsg("");
              }}
              className={`pb-2.5 mr-6 transition cursor-pointer ${
                isLogin
                  ? "border-b-2 border-amber-400 text-amber-400 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccessMsg("");
              }}
              className={`pb-2.5 transition cursor-pointer ${
                !isLogin
                  ? "border-b-2 border-amber-400 text-amber-400 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {!isLogin && (
              <div>
                <label className="block font-medium text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g, Alex Kimani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="userabc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-zinc-400">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-zinc-400 hover:text-amber-400 transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Registration Password Strength Meter */}
            {!isLogin && password.length > 0 && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Security Strength</span>
                  <span className="font-semibold text-amber-400">
                    {strengthLevels[passedCriteriaCount - 1] || "Very Weak"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passedCriteriaCount <= 2
                        ? "bg-rose-500"
                        : passedCriteriaCount <= 3
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${strengthPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                  <span className={`flex items-center gap-1 ${hasLength ? "text-emerald-400" : "text-zinc-500"}`}>
                    {hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 8+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-400" : "text-zinc-500"}`}>
                    {hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Uppercase (A-Z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-400" : "text-zinc-500"}`}>
                    {hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Lowercase (a-z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-400" : "text-zinc-500"}`}>
                    {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Number (0-9)
                  </span>
                  <span className={`flex items-center gap-1 col-span-2 ${hasSpecial ? "text-emerald-400" : "text-zinc-500"}`}>
                    {hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block font-medium text-zinc-400 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 transition glow-btn cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : isLogin ? "Sign In" : "Create Account"}
   
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}