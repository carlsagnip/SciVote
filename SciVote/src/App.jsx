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
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="text-center mb-10">
        <div className="bg-[url('hxz.jpg')] bg-cover bg-center w-full aspect-[5/2]"></div>
        </div>

        {/* Login Section */}
        <div>
          <div className="mb-5 mr-10 ml-10">
            <input
              placeholder="Enter your student ID"
              className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
          
          <div className='mb-5 mr-10 ml-10'>
          <button
            onClick={handleLogin}
            className="w-full bg-red-800 text-white p-3 border-none rounded-md text-base font-medium cursor-pointer hover:bg-red-900 transition-colors duration-200">
            Login
          </button>
          </div>
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