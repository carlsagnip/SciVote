import MainHeader from "./MainHeader";

export default function VoteSummary({ votes, positions, studentId, onExit }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader studentId={studentId} />

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Vote Summary</h2>
          <p className="text-center text-gray-600 mb-8">Your submitted votes for the student government elections.</p>

          <div className="space-y-6">
            {positions.map(position => (
              <div key={position.id} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{position.title}</h3>
                <div className={`p-4 rounded-lg ${votes[position.id] ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className="text-gray-700">
                    {votes[position.id] || 'No vote selected'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}