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

// Simulated async storage functions
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
  },
};

const STUDENTS_STORAGE_KEY = "registered_students";
const CANDIDATES_STORAGE_KEY = "registered_candidates";
const ELECTION_STATUS_KEY = "election_status";

export default function Admin({ onBack }) { // Accept onBack prop from App component
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("login");
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  // Data states - initialized as empty arrays
  const [candidates, setCandidates] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);

  // Load data from AsyncStorage when admin logs in
  useEffect(() => {
    if (adminLoggedIn) {
      loadData();
    }
  }, [adminLoggedIn]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load registered students
      const storedStudents = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
      if (storedStudents && Array.isArray(storedStudents)) {
        setRegisteredStudents(storedStudents);
      } else {
        setRegisteredStudents([]);
      }

      // Load candidates
      const storedCandidates = await AsyncStorage.getItem(
        CANDIDATES_STORAGE_KEY
      );
      if (storedCandidates && Array.isArray(storedCandidates)) {
        setCandidates(storedCandidates);
      } else {
        setCandidates([]);
      }

      // Load election status
      const electionStatus = await AsyncStorage.getItem(ELECTION_STATUS_KEY);
      setElectionEnded(electionStatus?.ended || false);
    } catch (error) {
      console.error("Failed to load data:", error);
      setErrorMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (
      adminCredentials.username === "admin" &&
      adminCredentials.password === "admin123"
    ) {
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
    // Clear data when logging out for security
    setCandidates([]);
    setRegisteredStudents([]);
  };

  const handleElectionEnd = async () => {
    try {
      const electionStatus = { ended: true, endDate: new Date().toISOString() };
      await AsyncStorage.setItem(ELECTION_STATUS_KEY, electionStatus);
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
        onBackToLogin={onBack} // Use the onBack prop from App component
      />
    );
  }

  // Loading screen while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
        <Header onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen pt-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-maroon-200 border-t-maroon-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <Header onLogout={handleLogout} />

      <main className="max-w-8xl mx-auto px-48 py-12 pt-40">
        {currentView === "menu" && (
          <div className="space-y-12">
            {/* Election Status Banner */}
            {electionEnded && (
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-xl font-bold">Election Completed</h3>
                      <p className="text-red-100">
                        The election has been finalized. View the official
                        results below.
                      </p>
                    </div>
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

            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Manage your voting system with powerful tools and real-time
                insights
              </p>
            </div>

            {/* Menu Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <button
                onClick={() => setCurrentView("candidates")}
                className="group relative overflow-hidden bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-red-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white text-4xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      <FaUserTie />
                    </div>
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-red-900/20 to-red-800/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-red-800 transition-colors duration-300">
                      Manage Candidates
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Add, edit, and organize candidate information for the
                      election
                    </p>
                  </div>

                  <div className="flex items-center text-red-800 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span>Get Started</span>
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCurrentView("tally")}
                className="group relative overflow-hidden bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center text-white text-4xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      <MdHowToVote />
                    </div>
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-red-900/20 to-red-700/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-red-700 transition-colors duration-300">
                      View Tally Summary
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Monitor real-time voting results and comprehensive
                      analytics
                    </p>
                  </div>

                  <div className="flex items-center text-red-700 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span>View Results</span>
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCurrentView("register")}
                className="group relative overflow-hidden bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-800/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20  rounded-2xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center text-white text-4xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      <HiUserAdd />
                    </div>
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-red-800/20 to-red-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                      Register Students
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Add new students to the voting system database
                    </p>
                  </div>

                  <div className="flex items-center text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span>Add Students</span>
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCurrentView("settings")}
                className="group relative overflow-hidden bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-700/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center text-white text-4xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      <FaCog />
                    </div>
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-red-700/20 to-red-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-red-500 transition-colors duration-300">
                      System Settings
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Configure technical settings and system preferences
                    </p>
                  </div>

                  <div className="flex items-center text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span>Configure</span>
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-900">
                    {candidates.length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    Total Candidates
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-900">
                    {registeredStudents.length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    Registered Students
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-900">
                    {candidates.reduce(
                      (total, candidate) => total + (candidate.votes || 0),
                      0
                    )}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    Total Votes Cast
                  </div>
                </div>
              </div>
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