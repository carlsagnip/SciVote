import { useState, useEffect } from "react";
import { 
  FiRefreshCw, 
  FiArrowLeft, 
  FiUsers, 
  FiCheckCircle, 
  FiClock, 
  FiPercent,
  FiAlertCircle,
  FiBarChart,
  FiTrendingUp,
  FiAward,
  FiUser
} from "react-icons/fi";
import { 
  BsTrophy, 
  BsPersonCheckFill, 
  BsPersonX,
  BsGraphUp
} from "react-icons/bs";
import { HiOutlineChartBar } from "react-icons/hi";

// Simulated async storage functions
const AsyncStorage = {
  getItem: async (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      }, 100);
    });
  }
};

const CANDIDATES_STORAGE_KEY = 'registered_candidates';
const STUDENTS_STORAGE_KEY = 'registered_students';
const ALL_VOTES_KEY = 'all_votes';

export default function Tally({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [allVotes, setAllVotes] = useState([]);
  const [votingStats, setVotingStats] = useState({
    totalRegistered: 0,
    totalVoted: 0,
    totalNotVoted: 0,
    turnoutPercentage: 0
  });

  useEffect(() => {
    loadElectionData();
  }, []);

  const loadElectionData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load all data concurrently
      const [candidatesData, studentsData, votesData] = await Promise.all([
        AsyncStorage.getItem(CANDIDATES_STORAGE_KEY),
        AsyncStorage.getItem(STUDENTS_STORAGE_KEY),
        AsyncStorage.getItem(ALL_VOTES_KEY)
      ]);

      // Validate and set candidates data
      const validCandidates = candidatesData && Array.isArray(candidatesData) ? candidatesData : [];
      setCandidates(validCandidates);

      // Validate and set students data
      const validStudents = studentsData && Array.isArray(studentsData) ? studentsData : [];
      setRegisteredStudents(validStudents);

      // Validate and set votes data
      const validVotes = votesData && Array.isArray(votesData) ? votesData : [];
      setAllVotes(validVotes);

      // Calculate voting statistics
      calculateVotingStats(validStudents, validVotes);

    } catch (error) {
      console.error('Failed to load election data:', error);
      setError('Failed to load election data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateVotingStats = (students, votes) => {
    const totalRegistered = students.length;
    const totalVoted = votes.length;
    const totalNotVoted = totalRegistered - totalVoted;
    const turnoutPercentage = totalRegistered > 0 ? 
      ((totalVoted / totalRegistered) * 100).toFixed(1) : 0;

    setVotingStats({
      totalRegistered,
      totalVoted,
      totalNotVoted,
      turnoutPercentage
    });
  };

  const getTallyResults = () => {
    // Initialize vote counts for all candidates
    const candidateVotes = {};
    candidates.forEach(candidate => {
      const key = `${candidate.name}_${candidate.position}`;
      candidateVotes[key] = {
        ...candidate,
        votes: 0
      };
    });

    // Count votes from actual voting data
    allVotes.forEach(voteRecord => {
      if (voteRecord.votes) {
        Object.entries(voteRecord.votes).forEach(([position, candidateName]) => {
          if (candidateName) {
            // Find matching candidate by name and position
            const matchingCandidate = candidates.find(c => 
              c.name === candidateName && getPositionKey(c.position) === position
            );
            
            if (matchingCandidate) {
              const key = `${matchingCandidate.name}_${matchingCandidate.position}`;
              if (candidateVotes[key]) {
                candidateVotes[key].votes += 1;
              }
            }
          }
        });
      }
    });

    return Object.values(candidateVotes);
  };

  // Helper function to convert position names to keys (same as in Vote component)
  const getPositionKey = (positionName) => {
    const keyMapping = {
      'President': 'president',
      'Vice President': 'vicePresident', 
      'Secretary': 'secretary',
      'Treasurer': 'treasurer',
      'Auditor': 'auditor',
      'Public Information Officer': 'pio',
      'Representative': 'representative'
    };
    
    return keyMapping[positionName] || positionName.toLowerCase().replace(/\s+/g, '');
  };

  const getPositionTally = () => {
    const tallyResults = getTallyResults();
    const positions = {};
    
    tallyResults.forEach(candidate => {
      if (!positions[candidate.position]) {
        positions[candidate.position] = [];
      }
      positions[candidate.position].push(candidate);
    });
    
    // Sort candidates by votes (highest first)
    Object.keys(positions).forEach(pos => {
      positions[pos].sort((a, b) => b.votes - a.votes);
    });
    
    return positions;
  };

  const getPartyStatistics = () => {
    const tallyResults = getTallyResults();
    const parties = {};
    
    tallyResults.forEach(candidate => {
      if (!parties[candidate.partyList]) {
        parties[candidate.partyList] = { votes: 0, candidates: 0 };
      }
      parties[candidate.partyList].votes += candidate.votes;
      parties[candidate.partyList].candidates += 1;
    });
    
    return parties;
  };

  const getStudentsWhoVoted = () => {
    return registeredStudents.filter(student => 
      student.hasVoted || student.votingStatus === 'completed'
    );
  };

  const getStudentsWhoNotVoted = () => {
    return registeredStudents.filter(student => 
      !student.hasVoted && student.votingStatus !== 'completed'
    );
  };

  const partyStats = getPartyStatistics();
  const tallyResults = getTallyResults();
  const totalVotesCast = tallyResults.reduce((total, candidate) => total + candidate.votes, 0);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading election data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={loadElectionData}
              className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Live Election Results & Tally</h2>
          <p className="text-slate-600">Real-time voting statistics and current standings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadElectionData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" /> Refresh Data
          </button>
          <button 
            onClick={onBack} 
            className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{votingStats.totalRegistered}</div>
              <div className="text-blue-100">Registered Voters</div>
            </div>
            <FiUsers className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{votingStats.totalVoted}</div>
              <div className="text-green-100">Votes Cast</div>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{votingStats.totalNotVoted}</div>
              <div className="text-orange-100">Not Yet Voted</div>
            </div>
            <FiClock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{votingStats.turnoutPercentage}%</div>
              <div className="text-purple-100">Voter Turnout</div>
            </div>
            <FiPercent className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Live Voter Participation */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <BsGraphUp className="w-5 h-5 text-green-600" />
          Live Voter Participation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Participation Rate</span>
              <span className="text-sm font-medium text-slate-700">{votingStats.turnoutPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${votingStats.turnoutPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span className="flex items-center gap-1">
                <BsPersonCheckFill className="w-4 h-4 text-green-600" />
                {votingStats.totalVoted} voted
              </span>
              <span className="flex items-center gap-1">
                <BsPersonX className="w-4 h-4 text-orange-600" />
                {votingStats.totalNotVoted} pending
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Registered:</span>
              <span className="font-semibold text-slate-800">{votingStats.totalRegistered}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Completed Voting:</span>
              <span className="font-semibold text-green-700">{votingStats.totalVoted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-orange-600">Still Pending:</span>
              <span className="font-semibold text-orange-700">{votingStats.totalNotVoted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Election Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <HiOutlineChartBar className="w-5 h-5" />
          Current Election Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiUser className="w-6 h-6 text-slate-600" />
              <div className="text-2xl font-bold text-slate-800">{candidates.length}</div>
            </div>
            <div className="text-sm text-slate-600">Total Candidates</div>
          </div>
        </div>
      </div>

      {/* Party Performance */}
      {Object.keys(partyStats).length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FiBarChart className="w-5 h-5 text-red-600" />
            Partylist Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(partyStats).map(([party, stats]) => {
              const partyPercentage = totalVotesCast > 0 ? 
                ((stats.votes / totalVotesCast) * 100).toFixed(1) : 0;
              return (
                <div key={party} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">{party}</h4>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {stats.candidates} candidate{stats.candidates !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Total Votes: {stats.votes}</span>
                    <span className="text-sm font-medium text-slate-700">{partyPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                      style={{ width: `${partyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Standings by Position */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 flex items-center gap-2">
          Current Standings by Position
        </h3>
        
        {Object.keys(getPositionTally()).length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">No votes have been cast yet. Results will appear here once voting begins.</p>
          </div>
        ) : (
          Object.entries(getPositionTally()).map(([position, candidateList]) => {
            const positionTotalVotes = candidateList.reduce((sum, c) => sum + c.votes, 0);
            
            return (
              <div key={position} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-slate-800">{position}</h4>
                  <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {positionTotalVotes} votes cast
                  </div>
                </div>
                
                <div className="space-y-4">
                  {candidateList.map((candidate, index) => {
                    const candidatePercentage = positionTotalVotes > 0 ? 
                      ((candidate.votes / positionTotalVotes) * 100).toFixed(1) : 0;
                    const overallPercentage = totalVotesCast > 0 ?
                      ((candidate.votes / totalVotesCast) * 100).toFixed(1) : 0;
                    
                    return (
                      <div 
                        key={candidate.id} 
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          index === 0 && candidate.votes > 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200' :
                          index === 1 && candidate.votes > 0 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200' :
                          index === 2 && candidate.votes > 0 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200' :
                          'bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">
                              {candidate.votes === 0 ? (
                                <FiAward className="w-6 h-6 text-gray-400" />
                              ) : index === 0 ? (
                                <BsTrophy className="w-6 h-6 text-yellow-500" />
                              ) : index === 1 ? (
                                <FiAward className="w-6 h-6 text-gray-500" />
                              ) : index === 2 ? (
                                <FiAward className="w-6 h-6 text-orange-500" />
                              ) : (
                                <FiAward className="w-6 h-6 text-gray-400" />
                              )}
                            </span>
                            <div>
                              <h5 className="font-bold text-slate-900">{candidate.name}</h5>
                              <p className="text-sm text-slate-600">ID: {candidate.schoolId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">{candidate.votes}</div>
                            <div className="text-sm text-slate-600">votes</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            Party: <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              {candidate.partyList}
                            </span>
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-700">
                              {candidatePercentage}% (position) • {overallPercentage}% (overall)
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bars */}
                        {positionTotalVotes > 0 && (
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>vs Position Candidates</span>
                                <span>{candidatePercentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                    index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                    'bg-gradient-to-r from-gray-500 to-gray-600'
                                  }`}
                                  style={{ width: `${candidatePercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Live Summary Footer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5 text-green-600" />
          Live Election Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <strong>Current Turnout:</strong> {votingStats.turnoutPercentage}% ({votingStats.totalVoted}/{votingStats.totalRegistered})
          </div>
          <div>
            <strong>Total Candidates:</strong> {candidates.length} running for election
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 text-center">
          Last updated: {new Date().toLocaleString()} • Data refreshes when you click "Refresh Data"
        </div>
      </div>
    </div>
  );
}