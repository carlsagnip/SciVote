import { useState } from "react";
import VoteSubmitted from '../components/VoteSubmitted';
import VoteSummary from '../components/VoteSummary';
import Header from '../components/MainHeader';

export default function Vote({ studentId, onLogout }) {
  const [votes, setVotes] = useState({
    president: "",
    vicePresident: "",
    secretary: "",
    treasurer: "",
    auditor: "",
    pio: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const positions = [
    { id: 'president', title: 'School President', candidates: ['Justin Miguel Dimla', 'Simone Roy Abello'] },
    { id: 'vicePresident', title: 'Vice President', candidates: ['Czianel Santos', 'John Erwin Domingo'] },
    { id: 'secretary', title: 'Secretary', candidates: ['Justin Kurt Fajardo', 'Mel Moses Seeping', 'John Daniel Torreda'] },
    { id: 'treasurer', title: 'Treasurer', candidates: ['Mark Richard Eugenio', 'Gian Carlo Cruz'] },
    { id: 'auditor', title: 'Auditor', candidates: ['Mark Robert Bayudang', 'Jeru Balulao', 'Harold Isaiah Carag'] },
    { id: 'pio', title: 'Public Information Officer', candidates: ['Jhon Zen Mercado', 'Carl Kenneth Sagnip'] }
  ];

  const handleVoteChange = (position, candidate) => {
    setVotes((prev) => ({ ...prev, [position]: candidate }));
  };

  const handleSubmitVote = () => {
    console.log("Votes submitted:", votes);
    setSubmitted(true);
  };

  const totalPositions = positions.length;
  const votedCount = Object.values(votes).filter(Boolean).length;

  if (submitted && !showSummary) {
    return <VoteSubmitted 
      onViewSummary={() => setShowSummary(true)} 
      onExit={onLogout} 
      studentId={studentId}
    />;
  }

  if (showSummary) {
    return <VoteSummary 
      votes={votes} 
      positions={positions} 
      studentId={studentId} 
      onExit={onLogout} 
    />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header studentId={studentId} />


      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Student Government Election
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Choose one candidate per position.
          </p>


          <div className="space-y-8">
            {positions.map((position) => (
              <div key={position.id}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {position.title}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {position.candidates.map((candidate) => (
                    <label
                      key={candidate}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        votes[position.id] === candidate
                          ? "border-red-800 bg-red-50"
                          : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={position.id}
                        value={candidate}
                        checked={votes[position.id] === candidate}
                        onChange={() =>
                          handleVoteChange(position.id, candidate)
                        }
                        className="w-4 h-4 accent-red-800"
                      />
                      <span className="ml-3 text-gray-700">{candidate}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmitVote}
              disabled={votedCount < totalPositions}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                votedCount < totalPositions
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-red-800 text-white hover:bg-red-900"
              }`}
            >
              Submit Vote
            </button>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Progress: {votedCount}/{totalPositions} positions completed
              </p>
              {votedCount < totalPositions && (
                <p className="text-sm text-gray-500 mt-1">
                  Vote for all positions before submitting.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}