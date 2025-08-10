import { useState } from 'react';

export default function Vote({ studentId, onLogout }) {
  const [votes, setVotes] = useState({
    president: '',
    vicePresident: '',
    secretary: '',
    treasurer: '',
    auditor: '',
    pio: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const positions = [
    { id: 'president', title: 'School President', candidates: ['Justin Miguel Dim Light', 'Simoan Roy Abella Danger'] },
    { id: 'vicePresident', title: 'Vice President', candidates: ['Czianel Kasi Eh', 'Erwin Shinzou Sasageyo'] },
    { id: 'secretary', title: 'Secretary', candidates: ['Justin Kurt Cubao', 'Mel Moses Sleeping', 'John Daniel Toledo'] },
    { id: 'treasurer', title: 'Treasurer', candidates: ['Mark Richard Bisaya', 'Gian Carlo Esposito', 'Joreen Faye'] },
    { id: 'auditor', title: 'Auditor', candidates: ['Mark Robert Binembang', 'Jeru Bakulao', 'Harolf Barag'] },
    { id: 'pio', title: 'Public Information Officer', candidates: ['Jhonzen Meralco', 'Carl Cannot Submit'] }
  ];

  const handleVoteChange = (position, candidate) => {
    setVotes(prev => ({ ...prev, [position]: candidate }));
  };

  const handleSubmitVote = () => {
    console.log('Votes submitted:', votes);
    setSubmitted(true);
  };

  const totalPositions = positions.length;
  const votedCount = Object.values(votes).filter(Boolean).length;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Vote Submitted!</h2>
          <p className="text-gray-600 mt-2">Thank you for participating in the student government elections.</p>
          <button
            onClick={onLogout}
            className="mt-6 bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-800 text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left side: Logo + Text */}
          <div className="flex items-center gap-4">
            <img src="logo2.png" alt="Logo" className="w-24 h-24 object-contain"/>
            <div>
              <h1 className="text-2xl font-bold">SciVote</h1>
              <p className="text-sm opacity-90">
                Honorato C. Perez, Sr. Memorial Science High School
              </p>
              <p className="text-sm opacity-90">
                Student ID: {studentId}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="bg-white text-red-800 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Student Government Election</h2>
          <p className="text-center text-gray-600 mb-8">Choose one candidate per position.</p>

          {/* Positions */}
          <div className="space-y-8">
            {positions.map(position => (
              <div key={position.id}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{position.title}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {position.candidates.map(candidate => (
                    <label
                      key={candidate}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        votes[position.id] === candidate
                          ? 'border-red-800 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={position.id}
                        value={candidate}
                        checked={votes[position.id] === candidate}
                        onChange={() => handleVoteChange(position.id, candidate)}
                        className="w-4 h-4 accent-red-800"
                      />
                      <span className="ml-3 text-gray-700">{candidate}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmitVote}
              disabled={votedCount < totalPositions}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                votedCount < totalPositions
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-red-800 text-white hover:bg-red-900'
              }`}
            >
              Submit Vote
            </button>
            {votedCount < totalPositions && (
              <p className="text-sm text-gray-500 mt-2">Vote for all positions before submitting.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
