import { useState, useEffect, useMemo } from "react";
import {
  FiArrowLeft,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiPercent,
  FiAlertCircle,
  FiAward,
  FiSearch,
} from "react-icons/fi";
import { BsTrophy } from "react-icons/bs";
import { User } from "lucide-react";

const AsyncStorage = {
  getItem: async (key) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      }, 100);
    }),
};

const STORAGE_KEYS = {
  candidates: "registered_candidates",
  students: "registered_students",
  votes: "all_votes",
};

const POSITION_KEYS = {
  President: "president",
  "Vice President": "vicePresident",
  Secretary: "secretary",
  Treasurer: "treasurer",
  Auditor: "auditor",
  "Public Information Officer": "pio",
  Representative: "representative",
};

export default function Tally({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ candidates: [], students: [], votes: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedParty, setSelectedParty] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadData = async () => {
    try {
      setError("");
      const [candidates, students, votes] = await Promise.all(
        Object.values(STORAGE_KEYS).map((key) => AsyncStorage.getItem(key))
      );
      setData({
        candidates: candidates || [],
        students: students || [],
        votes: votes || [],
      });
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError("Failed to load election data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get student photo by school ID
  const getStudentPhoto = (schoolId) => {
    if (!schoolId || !data.students.length) return null;
    const student = data.students.find(
      (s) => s.schoolId.toLowerCase() === schoolId.toLowerCase()
    );
    return student?.photo || null;
  };

  const votingStats = useMemo(() => {
    const totalRegistered = data.students.length;
    const totalVoted = data.votes.length;
    const turnoutPercentage =
      totalRegistered > 0
        ? ((totalVoted / totalRegistered) * 100).toFixed(1)
        : 0;
    return {
      totalRegistered,
      totalVoted,
      totalNotVoted: totalRegistered - totalVoted,
      turnoutPercentage,
    };
  }, [data.students, data.votes]);

  const tallyResults = useMemo(() => {
    const voteCounts = {};
    data.candidates.forEach(
      (c) => (voteCounts[`${c.name}_${c.position}`] = { ...c, votes: 0 })
    );

    data.votes.forEach((voteRecord) => {
      if (voteRecord.votes) {
        Object.entries(voteRecord.votes).forEach(
          ([position, candidateName]) => {
            if (candidateName) {
              const candidate = data.candidates.find(
                (c) =>
                  c.name === candidateName &&
                  POSITION_KEYS[c.position] === position
              );
              if (candidate) {
                const key = `${candidate.name}_${candidate.position}`;
                if (voteCounts[key]) voteCounts[key].votes += 1;
              }
            }
          }
        );
      }
    });
    return Object.values(voteCounts);
  }, [data.candidates, data.votes]);

  const filteredCandidates = useMemo(() => {
    return tallyResults
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.schoolId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition =
          selectedPosition === "all" || c.position === selectedPosition;
        const matchesParty =
          selectedParty === "all" || c.partyList === selectedParty;
        return matchesSearch && matchesPosition && matchesParty;
      })
      .sort((a, b) => b.votes - a.votes);
  }, [tallyResults, searchTerm, selectedPosition, selectedParty]);

  const uniquePositions = useMemo(
    () => [...new Set(data.candidates.map((c) => c.position))],
    [data.candidates]
  );
  const uniqueParties = useMemo(
    () => [...new Set(data.candidates.map((c) => c.partyList))],
    [data.candidates]
  );

  const calculateStats = (groupBy) => {
    const stats = {};
    tallyResults.forEach((c) => {
      const key = c[groupBy];
      if (!stats[key]) stats[key] = { totalVotes: 0, candidates: 0 };
      stats[key].totalVotes += c.votes;
      stats[key].candidates += 1;
    });
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalVotes - a.totalVotes);
  };

  const partyStats = useMemo(() => calculateStats("partyList"), [tallyResults]);
  const positionStats = useMemo(
    () => calculateStats("position"),
    [tallyResults]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading election data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <FiAlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={loadData}
              className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-900"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, gradient, progress }) => (
    <div className={`${gradient} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/80 mb-1">{title}</div>
          <div className="text-3xl font-bold">{value}</div>
          {progress !== undefined && (
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <div
                className="bg-white h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const StatsChart = ({ title, icon: Icon, data, color }) => {
    const totalVotes = data.reduce((sum, s) => sum + s.totalVotes, 0);
    const gradients = [
      "from-red-600 to-red-700",
      "from-blue-600 to-blue-700",
      "from-green-600 to-green-700",
      "from-purple-600 to-purple-700",
      "from-orange-600 to-orange-700",
      "from-pink-600 to-pink-700",
      "from-gray-500 to-gray-600",
    ];

    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
        </h3>
        <div className="space-y-3 flex-1 overflow-y-auto">
          {data.map((stat, i) => {
            const percentage =
              totalVotes > 0
                ? ((stat.totalVotes / totalVotes) * 100).toFixed(1)
                : 0;
            return (
              <div
                key={stat.name}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {title === "Party Performance" && (
                      <span className="text-lg font-bold text-slate-900">
                        #{i + 1}
                      </span>
                    )}
                    <span className="font-semibold text-slate-800 truncate">
                      {stat.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-lg font-bold text-slate-900">
                      {stat.totalVotes}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stat.candidates} candidates
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 relative bg-gradient-to-r ${
                        gradients[i] || gradients[6]
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-12 text-right flex-shrink-0">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const totalVotes = filteredCandidates.reduce((sum, c) => sum + c.votes, 0);
  const rankIcons = [
    <BsTrophy className="w-5 h-5 text-yellow-500" />,
    <FiAward className="w-5 h-5 text-gray-400" />,
    <FiAward className="w-5 h-5 text-orange-400" />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="px-6 pt-6 pb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">
                Live Election Results
              </h1>
              <p className="text-slate-500 text-sm">
                Auto-refreshing • Last updated:{" "}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors border"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Registered Voters"
            value={votingStats.totalRegistered}
            icon={FiUsers}
            gradient="bg-gradient-to-br from-red-800 to-red-900"
          />
          <StatCard
            title="Votes Cast"
            value={votingStats.totalVoted}
            icon={FiCheckCircle}
            gradient="bg-gradient-to-br from-green-600 to-green-700"
            progress={votingStats.turnoutPercentage}
          />
          <StatCard
            title="Pending"
            value={votingStats.totalNotVoted}
            icon={FiClock}
            gradient="bg-gradient-to-br from-orange-600 to-orange-700"
            progress={100 - parseFloat(votingStats.turnoutPercentage)}
          />
          <StatCard
            title="Turnout Rate"
            value={`${votingStats.turnoutPercentage}%`}
            icon={FiPercent}
            gradient="bg-gradient-to-br from-blue-600 to-blue-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-[800px]">
            <StatsChart
              title="Party Performance"
              icon={FiUsers}
              data={partyStats}
              color="text-red-600"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-[800px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              All Candidates
            </h3>

            <div className="flex flex-col gap-3 mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="all">All Positions</option>
                  {uniquePositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="all">All Parties</option>
                  {uniqueParties.map((party) => (
                    <option key={party} value={party}>
                      {party}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-3">
              Showing {filteredCandidates.length} of {data.candidates.length}{" "}
              candidates
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 flex-1 flex items-center justify-center">
                <div>
                  <FiAlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No candidates match your filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                {filteredCandidates.map((c, i) => {
                  const percentage =
                    totalVotes > 0
                      ? ((c.votes / totalVotes) * 100).toFixed(1)
                      : 0;
                  const barColors = [
                    "from-green-500 to-green-600",
                    "from-blue-500 to-blue-600",
                    "from-orange-500 to-orange-600",
                    "from-gray-400 to-gray-500",
                  ];
                  const studentPhoto = getStudentPhoto(c.schoolId);

                  return (
                    <div
                      key={c.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 w-6 flex items-center justify-center pt-1">
                            {i < 3 && c.votes > 0 ? (
                              rankIcons[i]
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>

                          {/* Photo */}
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                            {studentPhoto ? (
                              <img
                                src={studentPhoto}
                                alt={c.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-base mb-1">
                              {c.name}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              ID: {c.schoolId}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                {c.position}
                              </span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                                {c.partyList}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-2xl font-bold text-slate-900">
                            {c.votes}
                          </div>
                          <div className="text-sm text-gray-600">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${
                              barColors[i] || barColors[3]
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-[800px]">
            <StatsChart
              title="Votes by Position"
              icon={FiAward}
              data={positionStats}
              color="text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
