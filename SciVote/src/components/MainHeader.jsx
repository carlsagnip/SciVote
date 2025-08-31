export default function MainHeader({ studentData }) {
  return (
    <header className="bg-gradient-to-r from-red-800 via-red-900 to-red-950 text-white shadow-2xl border-b border-red-700/20">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo + Branding */}
          <div className="flex items-center gap-4">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Brand Text */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                SciVote
              </h1>
              <p className="text-red-200/80 text-sm font-medium tracking-wide">
                A voting system
              </p>
            </div>
          </div>

          {/* Student Info */}
          {studentData ? (
            <div className="flex items-center gap-4">
              {/* Student Details */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="font-semibold text-white text-lg">
                    {studentData.fullName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-red-200/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="text-red-200/80 text-sm font-mono">
                    {studentData.schoolId}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <p className="text-red-100 text-sm font-medium">
                Authentication Required
              </p>
            </div>
          )}
        </div>

        {/* Bottom Border Accent */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </header>
  );
}