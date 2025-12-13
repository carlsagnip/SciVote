import ErrorBanner from "../components/ErrorBanner";
import { User, Lock, ArrowRight, Eye } from "lucide-react";

function Header({ onBackToLogin }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-800 via-red-900 to-red-950 text-white shadow-2xl border-b border-red-700/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          {/* Admin Branding */}
          <div className="flex items-center gap-4">
            {/* Admin Icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Brand Text */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                SRLVote Admin
              </h1>
              <p className="text-red-200/80 text-sm font-medium tracking-wide">
                Election Management Dashboard
              </p>
            </div>
          </div>

          {/* Return to Voter View Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLogin}
              className="bg-white/10 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-xl hover:bg-white/20 focus:ring-2 focus:ring-white/30 transition-all duration-200 flex items-center space-x-2 group border border-white/20"
            >
              <Eye className="h-4 w-4" />
              <span>Return to Voter View</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Bottom Accent Border */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </header>
  );
}

export default function AdminLogin({
  adminCredentials,
  setAdminCredentials,
  handleAdminLogin,
  errorMessage,
  setErrorMessage,
  onBackToLogin, // Add this prop for navigation back to login
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdminLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onBackToLogin={onBackToLogin} />

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16 pt-96">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-visible relative">
            {/* Error Banner - Positioned absolutely outside the card to prevent any layout shift */}
            {errorMessage && (
              <div className="absolute -top-4 left-0 right-0 z-20">
                <ErrorBanner
                  message={errorMessage}
                  onClose={() => setErrorMessage("")}
                />
              </div>
            )}

            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-800 to-red-900 px-8 py-6 rounded-t-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                  SRLVote Administrator
                </h2>
                <p className="text-red-100 text-sm mt-1">(admin only)</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={adminCredentials.username}
                    onChange={(e) =>
                      setAdminCredentials({
                        ...adminCredentials,
                        username: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminCredentials.password}
                    onChange={(e) =>
                      setAdminCredentials({
                        ...adminCredentials,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-800 to-red-900 text-white font-semibold py-3 px-4 rounded-xl hover:from-red-900 hover:to-red-950 focus:ring-4 focus:ring-red-300 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Demo Credentials */}
              <div className="pt-4 border-t border-gray-100">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Demo Credentials
                  </p>
                  <p className="text-sm text-blue-700">
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      admin
                    </span>{" "}
                    /
                    <span className="font-mono bg-white px-2 py-1 rounded ml-1">
                      admin123
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
