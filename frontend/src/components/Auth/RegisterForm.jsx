import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInviteByToken } from "../../services/authService";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, CheckCircle, XCircle, Building2, Phone } from "lucide-react";

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("inviteToken") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  // Add skills input (comma-separated)
  const [skillsInput, setSkillsInput] = useState("");
  // Optional invite token
  const [inviteToken, setInviteToken] = useState(urlToken);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    if (inviteToken) {
      const validateToken = async () => {
        try {
          const details = await getInviteByToken(inviteToken);
          setForm(prev => ({
            ...prev,
            email: details.email || prev.email,
            company: details.company || prev.company,
          }));
          if (details.skills && details.skills.length > 0) {
            setSkillsInput(details.skills.join(", "));
          }
        } catch (err) {
          setError(err || "Invalid or expired invite token");
        }
      };
      validateToken();
    }
  }, [inviteToken]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
    setError("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = () => {
    if (!form.password) return null;
    const length = form.password.length;
    const hasUpper = /[A-Z]/.test(form.password);
    const hasLower = /[a-z]/.test(form.password);
    const hasNumber = /[0-9]/.test(form.password);
    const hasSpecial = /[!@#$%^&*]/.test(form.password);
    
    const score = [length >= 8, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score >= 4) return { level: "Strong", color: "bg-green-500", width: "100%" };
    if (score >= 3) return { level: "Medium", color: "bg-yellow-500", width: "66%" };
    return { level: "Weak", color: "bg-red-500", width: "33%" };
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: form.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { label: "One lowercase letter", met: /[a-z]/.test(form.password) },
    { label: "One number", met: /[0-9]/.test(form.password) },
    { label: "One special character", met: /[!@#$%^&*]/.test(form.password) },
  ];

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("Please fill in all required fields");
    }

    // Require skills
    if (!skillsInput || skillsInput.trim() === "") {
      return setError("Please provide at least one skill (comma-separated)");
    }

    if (!validateEmail(form.email)) {
      return setError("Please enter a valid email address");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (!form.agreeTerms) {
      return setError("Please agree to the terms and conditions");
    }

    try {
      setLoading(true);
      
      // Build skills array
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

      // Register with all form data (role/invite handled server-side)
      const result = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        password: form.password,
        role: "",
        skills,
        inviteToken: inviteToken || undefined
      });
      
      if (result.success) {
        setSuccess(true);
        // Store the generated employee ID in state to show to user
        const generatedId = result.user?.employeeId;
        setForm(prev => ({ ...prev, generatedId }));
        
        // Don't navigate automatically too fast, let them see the ID
        setTimeout(() => {
          navigate("/login");
        }, 5000); // 5 seconds to read ID
      } else {
        setError(result.error);
      }

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* WARNING: Creating an account will make the user an Admin when enabled in server config. */}
      <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm">
        <strong>Notice:</strong> By default, new accounts may be granted Admin rights depending on server configuration. Do not allow open self-registration in production.
      </div>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 text-sm flex items-center gap-2">
          <XCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-6 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 text-sm flex flex-col gap-3 shadow-lg animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-2 font-bold text-lg">
            <CheckCircle className="text-green-500" size={24} />
            Registration Successful!
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-700">
            <p className="text-gray-600 dark:text-gray-400 mb-1">Your Employee ID:</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              {form.generatedId || "Generating..."}
            </p>
          </div>
          <p className="text-gray-500 italic">Please use this ID to sign in. Redirecting to login in 5 seconds...</p>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      {/* Phone & Company Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="+1 234 567 890"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="company"
              required
              placeholder="ProManage Inc."
              value={form.company}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-12 pr-14 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {form.password && strength && (
          <div className="mt-3 space-y-2">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                style={{ width: strength.width }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {passwordRequirements.slice(0, 4).map((req, idx) => (
                <div key={idx} className={`flex items-center gap-1 text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                  {req.met ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {req.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full pl-12 pr-14 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {form.confirmPassword && form.password === form.confirmPassword && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <CheckCircle size={12} />
            Passwords match!
          </div>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 mt-1 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            I agree to the{" "}
            <span className="text-pink-600 hover:text-pink-500 font-medium">Terms of Service</span>{" "}
            and{" "}
            <span className="text-pink-600 hover:text-pink-500 font-medium">Privacy Policy</span>
          </span>
        </label>
      </div>

      {/* Skills Input (required) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Primary Skills <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="skills"
          placeholder="e.g. React, Node.js, MongoDB"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
        />
        <p className="text-xs text-gray-400 mt-1">Enter comma-separated skills. These are mandatory for account creation.</p>
      </div>

      {/* Invite Token (optional) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Invite Token <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          name="inviteToken"
          placeholder="Enter invite token if you have one"
          value={inviteToken}
          onChange={(e) => setInviteToken(e.target.value)}
          className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
        />
        <p className="text-xs text-gray-400 mt-1">If your organization uses invite tokens, paste it here.</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || success}
        className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-2xl shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </span>
        ) : success ? (
          <span className="flex items-center gap-2">
            <CheckCircle size={20} />
            Account Created!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Create Account <ArrowRight size={20} />
          </span>
        )}
      </button>

      {/* Login Link */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link 
          to="/login" 
          className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
