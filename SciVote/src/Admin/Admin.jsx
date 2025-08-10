import { useState } from 'react';
import AdminLogin from './AdminLogin';
import MenuButton from './MenuButton';
import Candidates from './Candidates';
import Tally from './Tally';
import RegisterStudents from './RegisterStudents';
import Header from '../components/Header';

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
      setErrorMessage(''); // clear error
    } else {
      setErrorMessage('Invalid admin credentials!');
    }
  };

  // Show login page
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

  // Show admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={() => setAdminLoggedIn(false)} />

      <main className="max-w-6xl mx-auto p-6 mt-12">
        {currentView === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MenuButton
              icon="👥"
              title="Manage Candidates"
              desc="View and manage all registered candidates"
              onClick={() => setCurrentView('candidates')}
            />
            <MenuButton
              icon="📊"
              title="View Tally Summary"
              desc="Check current voting results"
              onClick={() => setCurrentView('tally')}
            />
            <MenuButton
              icon="🎓"
              title="Register Students"
              desc="Add new students"
              onClick={() => setCurrentView('register')}
            />
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
