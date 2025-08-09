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

  const handleVoteChange = (position, candidate) => {
    setVotes(prev => ({
      ...prev,
      [position]: candidate
    }));
  };

  const handleSubmitVote = () => {
    console.log('Votes submitted:', votes);
    setSubmitted(true);
  };

  const positions = [
    {
      id: 'president',
      title: 'School President',
      candidates: ['Dhil Doe', 'Mah Negger',]
    },
    {
      id: 'vicePresident',
      title: 'Vice President',
      candidates: ['Pinning Garcia', 'Erwin Domingo',]
    },
    {
      id: 'secretary',
      title: 'Secretary',
      candidates: ['Justin Kurt Cubao', 'Peter Griffin', 'John Daniel']
    },
    {
      id: 'treasurer',
      title: 'Treasurer',
      candidates: ['Mark Richard', 'Gian Carlo', 'Joreen Faye']
    },
    {
      id: 'auditor',
      title: 'Auditor',
      candidates: ['Miles Morales', 'Jeru Balulao', 'Harolf Barag']
    },
    {
      id: 'pio',
      title: 'Public Information Officer',
      candidates: ['Jhonzen Mercado', 'Carl Kenneth']
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vote Submitted!</h2>
            <p className="text-gray-600">Thank you for participating in the SciVote election.</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors duration-200"
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-red-800">SciVote</h1>
            <p className="text-sm text-gray-600">Honorato C. Perez, Sr. Memorial Science High School
            Voting System</p>
            <p className="text-sm text-gray-600">Student ID: {studentId}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-900 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Student Government Election
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Cast your vote for each position. You can only vote once per position.
          </p>

          {/* Voting Positions */}
          <div className="space-y-8">
            {positions.map((position) => (
              <div key={position.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {position.title}
                </h3>
                <div className="grid gap-3">
                  {position.candidates.map((candidate) => (
                    <label
                      key={candidate}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
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
                        className="w-4 h-4 text-red-800 border-gray-300 focus:ring-red-800"
                      />
                      <span className="ml-3 text-gray-700 font-medium">
                        {candidate}
                      </span>
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
              disabled={Object.values(votes).some(vote => vote === '')}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                Object.values(votes).some(vote => vote === '')
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-red-800 text-white hover:bg-red-900'
              }`}
            >
              Submit Vote
            </button>
            {Object.values(votes).some(vote => vote === '') && (
              <p className="text-sm text-gray-500 mt-2">
                Please vote for all positions before submitting
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}