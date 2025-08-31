import { FiSettings, FiUser, FiShield } from "react-icons/fi";
import { useState, useEffect } from "react";
import ErrorBanner from "../components/ErrorBanner";
import GuidelinesPopup from "./GuidelinesPopup";

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
};

const STUDENTS_STORAGE_KEY = "registered_students";

export default function LoginPage({ onLogin, onAdmin }) {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validatingLogin, setValidatingLogin] = useState(false);
  const [validatedStudent, setValidatedStudent] = useState(null);

  // Load registered students on component mount
  useEffect(() => {
    loadRegisteredStudents();
  }, []);

  const loadRegisteredStudents = async () => {
    try {
      setLoading(true);
      const storedStudents = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);

      if (storedStudents && Array.isArray(storedStudents)) {
        setRegisteredStudents(storedStudents);
      } else {
        setRegisteredStudents([]);
      }
    } catch (error) {
      console.error("Failed to load registered students:", error);
      setErrorMessage("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!studentId.trim()) {
      setErrorMessage("Please enter your student ID");
      return;
    }

    setValidatingLogin(true);
    setErrorMessage("");

    try {
      // Check if student ID exists in registered students
      const student = registeredStudents.find(
        (s) => s.schoolId.toLowerCase() === studentId.trim().toLowerCase()
      );

      if (!student) {
        setErrorMessage(
          "Student ID not found. Please check your ID or contact an administrator."
        );
        setValidatingLogin(false);
        return;
      }

      // Check if student has already voted
      const existingVote = await AsyncStorage.getItem(
        `vote_${student.schoolId}`
      );
      if (existingVote) {
        setErrorMessage(
          "This student ID has already been used to vote. Each student can only vote once."
        );
        setValidatingLogin(false);
        return;
      }

      // Student ID is valid and hasn't voted yet, store the student and show guidelines
      setValidatedStudent(student);
      setValidatingLogin(false);
      setShowGuidelines(true);
    } catch (error) {
      console.error("Login validation error:", error);
      setErrorMessage("An error occurred during login. Please try again.");
      setValidatingLogin(false);
    }
  };

  const handleAcceptAndLogin = () => {
    setShowGuidelines(false);
    // Pass the full student object to the parent component
    onLogin(validatedStudent);
  };

  const handleGuidelinesClose = () => {
    setShowGuidelines(false);
    setValidatedStudent(null);
    // Clear the student ID input when guidelines are closed without accepting
    setStudentId("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-200 border-t-red-800 rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-red-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <p className="text-slate-700 font-medium text-lg">
            Loading SciVote System...
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Preparing your voting experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Error Banner */}
        {errorMessage && (
          <div className="absolute -top-4 left-0 right-0 z-20">
            <ErrorBanner
              message={errorMessage}
              onClose={() => setErrorMessage("")}
            />
          </div>
        )}

        {/* Main Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            {/* Header Image */}
            <div className="relative overflow-hidden">
              <img
                src="bgbgbg.jpg"
                alt="SciVote Header"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Logo/Badge */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-10 pt-14 pb-10">
            {/* Welcome Text */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome to SciVote
              </h1>
            </div>

            {/* Login Form */}
            <div className="space-y-8">
              {/* Student ID Input */}
              <div className="space-y-3">
                <label
                  htmlFor="studentId"
                  className="block text-base font-medium text-slate-700"
                >
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="h-6 w-6 text-slate-400" />
                  </div>
                  <input
                    id="studentId"
                    type="text"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={validatingLogin}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed focus:bg-white text-lg"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={validatingLogin || registeredStudents.length === 0}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg"
              >
                {validatingLogin ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg">Validating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">Login</span>
                    <svg
                      className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1"
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
                )}
              </button>

              {/* Status Text */}
              <div className="text-center">
                <p className="text-base text-slate-600">
                  {registeredStudents.length === 0
                    ? "⚠️ No students registered yet. Contact administrator."
                    : ``}
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  Need assistance?
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
                  <span>• Contact your election administrator</span>
                </div>
                {registeredStudents.length > 0 && (
                  <p className="text-xs text-slate-400">
                    Use your exact registered Student ID
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Admin Button */}
      <button
        onClick={onAdmin}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-red-800 to-red-900 p-4 rounded-2xl text-white shadow-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-110 group border border-white/10"
        title="Administrator Access"
      >
        <FiSettings className="text-xl group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute -inset-1 bg-gradient-to-r from-red-800 to-red-900 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
      </button>

      {/* Guidelines Popup */}
      {showGuidelines && validatedStudent && (
        <GuidelinesPopup
          onClose={handleGuidelinesClose}
          onAccept={handleAcceptAndLogin}
          studentData={validatedStudent}
        />
      )}
    </div>
  );
}
