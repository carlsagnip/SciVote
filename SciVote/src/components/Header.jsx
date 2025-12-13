export default function Header({ onLogout }) {
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

          {/* Admin Actions */}
          <div className="flex items-center gap-4">
            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Accent Border */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </header>
  );
}
