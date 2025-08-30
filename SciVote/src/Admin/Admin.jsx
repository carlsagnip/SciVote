import { useState } from 'react';
import AdminLogin from './AdminLogin';
import Candidates from './Candidates';
import Tally from './Tally';
import RegisterStudents from './RegisterStudents';
import Header from '../components/Header';
import { PiStudentBold } from "react-icons/pi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { ImStatsBars } from "react-icons/im";

export default function Admin() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Doe', position: 'President', votes: 15 },
    { id: 2, name: 'Jane Smith', position: 'President', votes: 12 },
  ]);

  const [registeredStudents, setRegisteredStudents] = useState([
    '2021001', '2021002'
  ]);

  const handleAdminLogin = () => {
    if (
      adminCredentials.username === 'admin' &&
      adminCredentials.password === 'admin123'
    ) {
      setAdminLoggedIn(true);
      setCurrentView('menu');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid admin credentials!');
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={() => setAdminLoggedIn(false)} />

      <main className="max-w-6xl mx-auto p-6 mt-12">
        {currentView === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setCurrentView('candidates')}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center items-center text-5xl text-red-800 mb-3">
                <PiStudentBold />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Manage Candidates</h3>
              <p className="text-sm text-gray-500">View and manage all registered candidates</p>
            </button>

            <button
              onClick={() => setCurrentView('tally')}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center items-center text-5xl text-red-800 mb-3">
                <ImStatsBars />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">View Tally Summary</h3>
              <p className="text-sm text-gray-500">Check current voting results</p>
            </button>

            <button
              onClick={() => setCurrentView('register')}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center items-center text-5xl text-red-800 mb-3">
                <HiOutlineAcademicCap />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Register Students</h3>
              <p className="text-sm text-gray-500">Add new students</p>
            </button>
          </div>
        )}

        {currentView === 'candidates' && (
          <Candidates
            candidates={candidates}
            setCandidates={setCandidates}
            onBack={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'tally' && (
          <Tally
            candidates={candidates}
            registeredStudents={registeredStudents}
            onBack={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'register' && (
          <RegisterStudents
            registeredStudents={registeredStudents}
            setRegisteredStudents={setRegisteredStudents}
            onBack={() => setCurrentView('menu')}
          />
        )}
      </main>
    </div>
  );
}
