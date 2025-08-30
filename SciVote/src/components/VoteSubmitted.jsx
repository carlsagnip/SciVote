import MainHeader from "./MainHeader";

export default function VoteSubmitted({ onViewSummary, onExit, studentId }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <MainHeader studentId={studentId} />

      {/* Main Content */}
      <div className="flex items-center justify-center p-4" style={{minHeight: 'calc(100vh - 120px)'}}>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Vote Submitted!</h2>
          <p className="text-gray-600 mt-2">Thank you for participating in the student government elections.</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={onViewSummary}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View Vote Summary
            </button>
            <button
              onClick={onExit}
              className="w-full bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}