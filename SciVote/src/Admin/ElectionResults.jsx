import { useState, useMemo } from 'react';
import { Trophy, Download, Printer, Award } from 'lucide-react';

export default function ElectionResults({ candidates, registeredStudents, onBack }) {
  const [selectedPosition, setSelectedPosition] = useState('all');

  const resultsData = useMemo(() => {
    const positionGroups = candidates.reduce((groups, candidate) => {
      const position = candidate.position;
      if (!groups[position]) groups[position] = [];
      groups[position].push(candidate);
      return groups;
    }, {});

    Object.keys(positionGroups).forEach(position => {
      positionGroups[position].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    });

    const winners = {};
    Object.keys(positionGroups).forEach(position => {
      if (positionGroups[position].length > 0) {
        winners[position] = positionGroups[position][0];
      }
    });

    const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
    const voterTurnout = registeredStudents.length > 0 ? 
      Math.round((totalVotes / registeredStudents.length) * 100) : 0;

    return { positionGroups, winners, totalVotes, voterTurnout };
  }, [candidates, registeredStudents]);

  const positions = Object.keys(resultsData.positionGroups);
  const filteredPositions = selectedPosition === 'all' ? positions : [selectedPosition];

  const exportResults = () => {
    const report = {
      title: 'Election Results',
      date: new Date().toLocaleString(),
      totalVotes: resultsData.totalVotes,
      voterTurnout: resultsData.voterTurnout + '%',
      winners: resultsData.winners,
      results: resultsData.positionGroups
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `election-results-${new Date().toISOString().split('T')[0]}.json`);
    link.click();
  };

  const printResults = () => {
    window.print();
  };

  const downloadPDF = async () => {
    // Use browser's print to PDF functionality
    try {
      await window.print();
    } catch (error) {
      console.error('Print failed:', error);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-area, .print-area * {
            visibility: visible;
          }
          
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .print-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #dc2626;
          }
          
          .print-winner-card {
            break-inside: avoid;
            margin-bottom: 15px;
          }
          
          .print-position-section {
            break-inside: avoid;
            margin-bottom: 25px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Screen Header - No Print */}
          <div className="no-print bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Trophy className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Election Results</h1>
                  <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={exportResults}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{resultsData.totalVotes}</div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{resultsData.voterTurnout}%</div>
                <div className="text-sm text-gray-600">Turnout</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{positions.length}</div>
                <div className="text-sm text-gray-600">Positions</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
                <div className="text-sm text-gray-600">Candidates</div>
              </div>
            </div>

            {/* Filter */}
            <div className="mt-6">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Print Area */}
          <div className="print-area">
            {/* Print Header */}
            <div className="print-header hidden print:block mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Official Election Results</h1>
              <p className="text-gray-600">
                Date: {new Date().toLocaleDateString()} | Total Votes: {resultsData.totalVotes} | Turnout: {resultsData.voterTurnout}%
                {selectedPosition !== 'all' && ` | Position: ${selectedPosition}`}
              </p>
            </div>

            {/* Winners Section - Only show filtered winner if not 'all' */}
            {(selectedPosition === 'all' || resultsData.winners[selectedPosition]) && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-red-600" />
                  {selectedPosition === 'all' ? 'Winners' : `Winner - ${selectedPosition}`}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedPosition === 'all' ? (
                    Object.entries(resultsData.winners).map(([position, winner]) => (
                      <div key={position} className="print-winner-card border-2 border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="text-sm font-semibold text-red-800 mb-2">{position}</div>
                        <div className="font-bold text-lg text-gray-900">{winner.name}</div>
                        <div className="text-sm text-gray-600">{winner.schoolId}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{winner.partyList}</span>
                          <span className="text-lg font-bold text-red-600">{winner.votes || 0} votes</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="print-winner-card border-2 border-red-200 bg-red-50 rounded-lg p-4 md:col-span-2">
                      <div className="text-sm font-semibold text-red-800 mb-2">{selectedPosition}</div>
                      <div className="font-bold text-lg text-gray-900">{resultsData.winners[selectedPosition].name}</div>
                      <div className="text-sm text-gray-600">{resultsData.winners[selectedPosition].schoolId}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{resultsData.winners[selectedPosition].partyList}</span>
                        <span className="text-lg font-bold text-red-600">{resultsData.winners[selectedPosition].votes || 0} votes</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Results */}
            <div className="space-y-6">
              {filteredPositions.map((position) => {
                const positionCandidates = resultsData.positionGroups[position];
                const totalPositionVotes = positionCandidates.reduce((sum, c) => sum + (c.votes || 0), 0);
                
                return (
                  <div key={position} className="print-position-section bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{position}</h3>
                    <p className="text-sm text-gray-600 mb-4">{totalPositionVotes} votes cast</p>
                    
                    <div className="space-y-3">
                      {positionCandidates.map((candidate, index) => {
                        const voteCount = candidate.votes || 0;
                        const percentage = totalPositionVotes > 0 ? 
                          Math.round((voteCount / totalPositionVotes) * 100) : 0;
                        
                        return (
                          <div key={candidate.id} className={`
                            border-l-4 rounded-lg p-4 transition-colors
                            ${index === 0 ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-50 border-gray-300'}
                          `}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'}
                                  `}>
                                    {index + 1}
                                  </span>
                                  <span className="font-bold text-gray-900">{candidate.name}</span>
                                </div>
                                <div className="text-sm text-gray-600 ml-8">
                                  {candidate.schoolId} • <span className="text-red-600 font-medium">{candidate.partyList}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{voteCount}</div>
                                <div className="text-sm text-gray-600">{percentage}%</div>
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  index === 0 ? 'bg-yellow-500' : 
                                  index === 1 ? 'bg-gray-400' :
                                  index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}