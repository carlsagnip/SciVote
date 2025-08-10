import ErrorBanner from "../components/ErrorBanner";

export default function AdminLogin({
  adminCredentials,
  setAdminCredentials,
  handleAdminLogin,
  errorMessage,
  setErrorMessage
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-800 text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="logo2.png"
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold">SciVote Admin</h1>
              <p className="text-sm opacity-90">
                Honorato C. Perez, Sr. Memorial Science High School
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto p-6 mt-20">
        <div className="bg-white rounded-lg shadow-md p-8 relative">
          {/* Error message absolutely positioned */}
          {errorMessage && (
            <div className="absolute -top-12 left-0 w-full">
              <ErrorBanner
                message={errorMessage}
                onClose={() => setErrorMessage("")}
              />
            </div>
          )}

          <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

          <input
            type="text"
            placeholder="Admin Username"
            value={adminCredentials.username}
            onChange={(e) =>
              setAdminCredentials({
                ...adminCredentials,
                username: e.target.value,
              })
            }
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={adminCredentials.password}
            onChange={(e) =>
              setAdminCredentials({
                ...adminCredentials,
                password: e.target.value,
              })
            }
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleAdminLogin}
            className="w-full bg-red-800 text-white p-3 rounded hover:bg-red-900"
          >
            Login
          </button>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Demo: admin / admin123
          </p>
        </div>
      </main>
    </div>
  );
}
