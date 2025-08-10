export default function Tally({ candidates, registeredStudents, onBack }) {
  const getTotalVotes = () =>
    candidates.reduce((total, c) => total + c.votes, 0);

  const getPositionTally = () => {
    const positions = {};
    candidates.forEach(c => {
      if (!positions[c.position]) positions[c.position] = [];
      positions[c.position].push(c);
    });
    Object.keys(positions).forEach(pos => {
      positions[pos].sort((a, b) => b.votes - a.votes);
    });
    return positions;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Voting Tally Summary</h2>
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>

      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-800">Total Votes: {getTotalVotes()}</h3>
        <p className="text-red-600">Registered Students: {registeredStudents.length}</p>
      </div>

      {Object.entries(getPositionTally()).map(([position, list]) => (
        <div key={position} className="mb-8">
          <h3 className="text-xl font-bold border-b pb-2 mb-3">{position}</h3>
          {list.map((candidate, index) => {
            const percentage = getTotalVotes() > 0 ? (candidate.votes / getTotalVotes() * 100).toFixed(1) : 0;
            return (
              <div key={candidate.id} className="flex items-center justify-between bg-gray-50 p-3 rounded mb-2">
                <span>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {candidate.name} - {candidate.votes} votes ({percentage}%)</span>
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
