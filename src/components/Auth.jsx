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
        setSuccessMsg("Account created successfully!");
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
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 relative transition-colors duration-200">
      {/* Top Navbar Actions */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center max-w-md mx-auto">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs cursor-pointer shadow-xs"
          >
          
            <span>Back to Home</span>
          </button>
        )}
        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle visual theme"
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 cursor-pointer shadow-xs"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-12 sm:mt-0">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-7 sm:p-9 shadow-xl dark:shadow-2xl transition-all">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Task It</h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Personal Task & Notes Workspace
            </p>
          </div>

          <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccessMsg("");
              }}
              className={`pb-2.5 mr-6 transition cursor-pointer ${
                isLogin
                  ? "border-b-2 text-zinc-900 dark:text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
              style={{ borderColor: isLogin ? accentColor : "transparent", color: isLogin ? accentColor : undefined }}
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
                  ? "border-b-2 text-zinc-900 dark:text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
              style={{ borderColor: !isLogin ? accentColor : "transparent", color: !isLogin ? accentColor : undefined }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {!isLogin && (
              <div>
                <label className="block font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alex Kim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="userabc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-zinc-600 dark:text-zinc-400">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer"
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
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Registration Password Strength Meter */}
            {!isLogin && password.length > 0 && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400">Security Strength</span>
                  <span className="font-semibold" style={{ color: accentColor }}>
                    {strengthLevels[passedCriteriaCount - 1] || "Very Weak"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
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
                  <span className={`flex items-center gap-1 ${hasLength ? "text-emerald-500" : "text-zinc-400"}`}>
                    {hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 8+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-500" : "text-zinc-400"}`}>
                    {hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Uppercase (A-Z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-500" : "text-zinc-400"}`}>
                    {hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Lowercase (a-z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-500" : "text-zinc-400"}`}>
                    {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Number (0-9)
                  </span>
                  <span className={`flex items-center gap-1 col-span-2 ${hasSpecial ? "text-emerald-500" : "text-zinc-400"}`}>
                    {hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: accentColor }}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white transition hover:opacity-90 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}