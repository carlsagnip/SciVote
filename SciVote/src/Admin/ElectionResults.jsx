import { useState, useMemo } from 'react';
import { FaTrophy, FaMedal, FaDownload, FaPrint, FaCrown, FaChartBar } from 'react-icons/fa';

export default function ElectionResults({ candidates, registeredStudents, onBack }) {
  const [selectedPosition, setSelectedPosition] = useState('all');

  // Process election data
  const resultsData = useMemo(() => {
    // Group candidates by position
    const positionGroups = candidates.reduce((groups, candidate) => {
      const position = candidate.position;
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(candidate);
      return groups;
    }, {});

    // Sort candidates within each position by votes (descending)
    Object.keys(positionGroups).forEach(position => {
      positionGroups[position].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    });

    const winners = {};
    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
    const voterTurnout = registeredStudents.length > 0 ? 
      Math.round((totalVotes / registeredStudents.length) * 100) : 0;

    // Determine winners for each position
    Object.keys(positionGroups).forEach(position => {
      if (positionGroups[position].length > 0) {
        winners[position] = positionGroups[position][0]; // First candidate has highest votes
      }
    });

    return {
      positionGroups,
      winners,
      totalVotes,
      voterTurnout,
      totalCandidates: candidates.length,
      totalPositions: Object.keys(positionGroups).length
    };
  }, [candidates, registeredStudents]);

  const positions = Object.keys(resultsData.positionGroups);
  const filteredPositions = selectedPosition === 'all' ? positions : [selectedPosition];

  const exportResults = () => {
    const resultsReport = {
      title: 'Official Election Results',
      date: new Date().toLocaleString(),
      summary: {
        totalVotes: resultsData.totalVotes,
        totalCandidates: resultsData.totalCandidates,
        totalPositions: resultsData.totalPositions,
        voterTurnout: resultsData.voterTurnout + '%',
        registeredVoters: registeredStudents.length
      },
      winners: resultsData.winners,
      detailedResults: resultsData.positionGroups
    };

    const dataStr = JSON.stringify(resultsReport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `election-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Hero Section */}
        <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-700 rounded-3xl p-12 mb-12 overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-6">
                  <FaTrophy className="text-6xl text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                    Official Results
                  </h1>
                  <p className="text-red-100 text-xl font-medium">
                    Election completed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={exportResults}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center transform hover:scale-105"
                >
                  <FaDownload className="mr-2" />
                  Export
                </button>
                <button
                  onClick={printResults}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center transform hover:scale-105"
                >
                  <FaPrint className="mr-2" />
                  Print
                </button>
                <button
                  onClick={onBack}
                  className="bg-white text-red-800 hover:bg-red-50 px-8 py-3 rounded-xl transition-all duration-300 font-bold transform hover:scale-105 shadow-lg"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Quick Stats in Header */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-bold text-white">{resultsData.totalVotes}</div>
                <div className="text-red-200 font-medium mt-1">Total Votes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-bold text-white">{resultsData.voterTurnout}%</div>
                <div className="text-red-200 font-medium mt-1">Turnout Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-bold text-white">{resultsData.totalPositions}</div>
                <div className="text-red-200 font-medium mt-1">Positions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-bold text-white">{resultsData.totalCandidates}</div>
                <div className="text-red-200 font-medium mt-1">Candidates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Winners Showcase */}
        <div className="bg-white rounded-3xl p-10 mb-12 shadow-xl border border-slate-200/50">
          <div className="flex items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Election Winners</h2>
              <p className="text-slate-600 text-lg">Congratulations to our newly elected student leaders</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(resultsData.winners).map(([position, winner], index) => (
              <div key={position} className="group relative">
                {/* Winner Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 h-full transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-xl">
                  {/* Winner Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-3 shadow-lg">
                    <FaTrophy className="text-white text-xl" />
                  </div>
                  
                  {/* Position */}
                  <div className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold mb-4 inline-block">
                    {position}
                  </div>
                  
                  {/* Winner Info */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-red-800 transition-colors">
                      {winner.name}
                    </h3>
                    <p className="text-slate-600 font-medium">{winner.schoolId}</p>
                    <div className="inline-block bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {winner.partyList}
                    </div>
                    
                    {/* Vote Count */}
                    <div className="pt-4 border-t border-red-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Total Votes</span>
                        <span className="text-3xl font-bold text-red-800">{winner.votes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Position Filter */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaChartBar className="text-red-800 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-slate-800">Detailed Results</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter by Position
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="border-2 border-red-200 rounded-xl px-6 py-3 focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all font-medium bg-white"
              >
                <option value="all">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-10">
          {filteredPositions.map((position) => {
            const positionCandidates = resultsData.positionGroups[position];
            const totalPositionVotes = positionCandidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
            
            return (
              <div key={position} className="bg-white rounded-3xl p-10 shadow-xl border border-slate-200/50">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-4 mr-4">
                      <FaMedal className="text-3xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-800">{position}</h3>
                      <p className="text-slate-600 text-lg font-medium">{totalPositionVotes} votes cast</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {positionCandidates.map((candidate, index) => {
                    const voteCount = candidate.votes || 0;
                    const percentage = totalPositionVotes > 0 ? 
                      Math.round((voteCount / totalPositionVotes) * 100) : 0;
                    
                    return (
                      <div key={candidate.id} className={`
                        relative rounded-2xl p-8 border-2 transition-all duration-500 transform hover:scale-[1.02]
                        ${index === 0 ? 
                          'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg' : 
                          index === 1 ?
                          'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                          index === 2 ?
                          'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300' :
                          'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300'
                        }
                      `}>
                        {/* Rank Badge */}
                        <div className={`
                          absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg
                          ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                            'bg-gradient-to-br from-slate-400 to-slate-500'
                          }
                        `}>
                          {index + 1}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex-1">
                            <h4 className={`text-2xl font-bold mb-2 ${
                              index === 0 ? 'text-yellow-800' : 'text-slate-800'
                            }`}>
                              {candidate.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-slate-600">
                              <span className="font-semibold">{candidate.schoolId}</span>
                              <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {candidate.partyList}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-4xl font-bold mb-1 ${
                              index === 0 ? 'text-yellow-600' : 'text-slate-700'
                            }`}>
                              {voteCount.toLocaleString()}
                            </div>
                            <div className="text-slate-600 font-semibold text-lg">{percentage}%</div>
                          </div>
                        </div>
                        
                        {/* Modern Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                                index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                'bg-gradient-to-r from-slate-400 to-slate-500'
                              }`}
                              style={{ 
                                width: `${percentage}%`,
                                boxShadow: index === 0 ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                              }}
                            ></div>
                          </div>
                          <div className="absolute right-2 top-0 h-4 flex items-center">
                            <span className="text-xs font-bold text-white drop-shadow">
                              {percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Winner Crown */}
                        {index === 0 && (
                          <div className="absolute -top-2 right-8">
                            <FaCrown className="text-3xl text-white animate-bounce" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {positionCandidates.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <FaTrophy className="text-4xl text-slate-400" />
                    </div>
                    <p className="text-xl font-semibold">No candidates for this position</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}