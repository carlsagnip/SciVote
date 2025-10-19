import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import Candidates from "./Candidates";
import Tally from "./Tally";
import RegisterStudents from "./RegisterStudents";
import Settings from "./Settings";
import ElectionResults from "./ElectionResults";
import Header from "../components/Header";
import { FaUserTie, FaCog } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdHowToVote } from "react-icons/md";

// Storage keys
const STORAGE_KEYS = {
  STUDENTS: "registered_students",
  CANDIDATES: "registered_candidates",
  ELECTION_STATUS: "election_status"
};

// Simulated async storage
const AsyncStorage = {
  getItem: async (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      }, 100);
    });
  },
  setItem: async (key, value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }, 100);
    });
  }
};

// Stats Card Component
const StatsCard = ({ value, label }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
    <div className="text-center">
      <div className="text-3xl font-bold text-red-900">{value}</div>
      <div className="text-slate-600 text-sm font-medium">{label}</div>
    </div>
  </div>
);

export default function Admin({ onBack }) {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("login");
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);

  const MENU_CARDS = [
    { id: "register", title: "Register Students", description: "Add new students to the voting system database", icon: HiUserAdd, gradient: "from-red-800 to-red-600", gradientOpacity: "from-red-800/3 to-red-600/5", hoverColor: "text-red-600", buttonText: "Add Students" },
    { id: "candidates", title: "Manage Candidates", description: "Add, edit, and organize candidate information for the election", icon: FaUserTie, gradient: "from-red-900 to-red-800", gradientOpacity: "from-red-900/3 to-red-800/5", hoverColor: "text-red-800", buttonText: "Get Started" },
    { id: "tally", title: "View Tally Summary", description: "Monitor real-time voting results and comprehensive analytics", icon: MdHowToVote, gradient: "from-red-900 to-red-700", gradientOpacity: "from-red-900/3 to-red-700/5", hoverColor: "text-red-700", buttonText: "View Results" },
    { id: "settings", title: "System Settings", description: "Configure technical settings and system preferences", icon: FaCog, gradient: "from-red-700 to-red-500", gradientOpacity: "from-red-700/3 to-red-500/5", hoverColor: "text-red-500", buttonText: "Configure" }
  ];

  useEffect(() => {
    if (adminLoggedIn) loadData();
  }, [adminLoggedIn]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [students, candidatesList, status] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STUDENTS),
        AsyncStorage.getItem(STORAGE_KEYS.CANDIDATES),
        AsyncStorage.getItem(STORAGE_KEYS.ELECTION_STATUS)
      ]);

      setRegisteredStudents(Array.isArray(students) ? students : []);
      setCandidates(Array.isArray(candidatesList) ? candidatesList : []);
      setElectionEnded(status?.ended || false);
    } catch (error) {
      console.error("Failed to load data:", error);
      setErrorMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      setAdminLoggedIn(true);
      setCurrentView("menu");
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid admin credentials!");
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setCurrentView("login");
    setCandidates([]);
    setRegisteredStudents([]);
  };

  const handleElectionEnd = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ELECTION_STATUS, { 
        ended: true, 
        endDate: new Date().toISOString() 
      });
      setElectionEnded(true);
    } catch (error) {
      console.error("Failed to end election:", error);
    }
  };

  if (!adminLoggedIn) {
    return (
      <AdminLogin
        adminCredentials={adminCredentials}
        setAdminCredentials={setAdminCredentials}
        handleAdminLogin={handleAdminLogin}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        onBackToLogin={onBack}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
        <Header onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen pt-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-maroon-200 border-t-maroon-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = candidates.reduce((total, candidate) => total + (candidate.votes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <Header onLogout={handleLogout} />

      <main className="max-w-8xl mx-auto px-48 py-12 pt-40">
        {currentView === "menu" && (
          <div className="space-y-12">
            {electionEnded && (
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Election Completed</h3>
                    <p className="text-red-100">The election has been finalized. View the official results below.</p>
                  </div>
                  <button
                    onClick={() => setCurrentView("results")}
                    className="bg-white text-red-800 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
                  >
                    View Official Results
                  </button>
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Administrator Tools
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {MENU_CARDS.map(card => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => setCurrentView(card.id)}
                    className="group relative overflow-hidden bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientOpacity} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-4xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                          <Icon />
                        </div>
                        <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${card.gradient}/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      </div>

                      <div className="space-y-3">
                        <h3 className={`text-2xl font-bold text-slate-800 group-hover:${card.hoverColor} transition-colors duration-300`}>
                          {card.title}
                        </h3>
                        <p className="text-slate-600 text-base leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className={`flex items-center ${card.hoverColor} font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
                        <span>{card.buttonText}</span>
                        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <StatsCard value={registeredStudents.length} label="Registered Students" />
              <StatsCard value={candidates.length} label="Total Candidates" />
              <StatsCard value={totalVotes} label="Total Votes Cast" />
            </div>
          </div>
        )}

        {currentView === "candidates" && (
          <Candidates
            candidates={candidates}
            setCandidates={setCandidates}
            registeredStudents={registeredStudents}
            setRegisteredStudents={setRegisteredStudents}
            onBack={() => setCurrentView("menu")}
          />
        )}

        {currentView === "tally" && (
          <Tally
            candidates={candidates}
            registeredStudents={registeredStudents}
            onBack={() => setCurrentView("menu")}
          />
        )}

        {currentView === "register" && (
          <RegisterStudents
            registeredStudents={registeredStudents}
            setRegisteredStudents={setRegisteredStudents}
            onBack={() => setCurrentView("menu")}
          />
        )}

        {currentView === "settings" && (
          <Settings
            candidates={candidates}
            registeredStudents={registeredStudents}
            electionEnded={electionEnded}
            onElectionEnd={handleElectionEnd}
            onBack={() => setCurrentView("menu")}
          />
        )}

        {currentView === "results" && (
          <ElectionResults
            candidates={candidates}
            registeredStudents={registeredStudents}
            onBack={() => setCurrentView("menu")}
          />
        )}
      </main>
    </div>
  );
}