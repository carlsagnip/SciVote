import { useState } from 'react';
import Vote from './User/Vote';
import Admin from './Admin/Admin';
import LoginPage from './components/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [studentId, setStudentId] = useState('');

  const handleLogin = () => {
    setCurrentPage('vote');
  };

  const handleAdmin = () => {
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setCurrentPage('main');
    setStudentId('');
  };

  if (currentPage === 'main') {
    return <LoginPage onLogin={handleLogin} onAdmin={handleAdmin} />;
  } else if (currentPage === 'vote') {
    return <Vote studentId={studentId} onLogout={handleLogout} />;
  } else if (currentPage === 'admin') {
    return <Admin />;
  }
}

export default App;
