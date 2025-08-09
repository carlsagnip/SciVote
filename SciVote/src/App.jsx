import { useState } from 'react';
import Vote from './Vote';

function App() {
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'vote'
  const [studentId, setStudentId] = useState('');

  const handleLogin = () => {
    setCurrentPage('vote');
  };

  const handleLogout = () => {
    setCurrentPage('main');
    setStudentId('');
  };

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-red-800 text-3xl font-bold mb-2">
            SciVote
          </h1>
          <p className="text-gray-500 text-base leading-6">
            Honorato C. Perez, Sr. Memorial Science High School<br />
            Voting System
          </p>
        </div>

        {/* Login Section */}
        <div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              placeholder="Enter your student ID"
              className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-red-800 text-white p-3 border-none rounded-md text-base font-medium cursor-pointer hover:bg-red-900 transition-colors duration-200"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-5 border-t border-gray-200">
          <p className="text-gray-400 text-sm m-0">
            Enter your student ID to access the voting system
          </p>
        </div>
      </div>
    </div>
  );

  if (currentPage === 'main') {
    return <LoginPage />;
  } else if (currentPage === 'vote') {
    return <Vote studentId={studentId} onLogout={handleLogout} />;
  }
}

export default App;