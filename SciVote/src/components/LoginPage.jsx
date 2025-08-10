import { FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import ErrorBanner from '../components/ErrorBanner';
import GuidelinesPopup from './GuidelinesPopup'; // Adjust path if needed

export default function LoginPage({ onLogin, onAdmin }) {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!studentId.trim()) {
      setErrorMessage('Please enter your student ID');
      return;
    }
    setErrorMessage('');
    setShowGuidelines(true);
  };

  const handleAcceptAndLogin = () => {
    setShowGuidelines(false);
    onLogin(studentId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans relative">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden relative">
        {errorMessage && (
          <ErrorBanner message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        {/* Header */}
        <div className="text-center mb-5">
          <div className="bg-[url('hxz.jpg')] bg-cover bg-center w-full aspect-[5/2]"></div>
        </div>

        {/* Login Section */}
        <div>
          <p className="text-center pt-5 font-bold text-lg text-gray-900">Welcome to SciVote</p>
          <p className="text-center text-sm font-medium italic text-gray-900 pb-5">
            A Student Voting System
          </p>

          <div className="mb-5 mr-10 ml-10">
            <input
              placeholder="Enter your student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>

          <div className="mb-5 mr-10 ml-10">
            <button
              onClick={handleLogin}
              className="w-full bg-red-800 text-white p-3 border-none rounded-md text-base font-medium cursor-pointer hover:bg-red-900 transition-colors duration-200"
            >
              Login
            </button>
            <p className="text-center text-sm font-medium text-gray-900 pt-2">
              Enter your student ID to access the voting system
            </p>
          </div>
        </div>
      </div>

      {/* Floating Settings Button */}
      <button
        onClick={onAdmin}
        className="fixed bottom-5 left-5 bg-red-800 p-4 rounded-full text-white shadow-lg hover:bg-red-900 transition-colors duration-200"
      >
        <FiSettings size={24} />
      </button>

      {/* Guidelines Popup */}
      {showGuidelines && (
        <GuidelinesPopup
          onClose={() => setShowGuidelines(false)}
          onAccept={handleAcceptAndLogin}
        />
      )}
    </div>
  );
}