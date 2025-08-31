import { useState } from "react";
import LoginPage from "./components/LoginPage";
import Vote from "./User/Vote";
import Admin from "./Admin/Admin";

function App() {
  const [currentView, setCurrentView] = useState("login"); // 'login', 'vote', 'admin'
  const [loggedInStudent, setLoggedInStudent] = useState(null);

  const handleStudentLogin = (studentData) => {
    setLoggedInStudent(studentData);
    setCurrentView("vote");
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    setCurrentView("login");
  };

  const handleAdminAccess = () => {
    setCurrentView("admin");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  if (currentView === "login") {
    return (
      <LoginPage onLogin={handleStudentLogin} onAdmin={handleAdminAccess} />
    );
  }

  if (currentView === "vote" && loggedInStudent) {
    return <Vote studentData={loggedInStudent} onLogout={handleLogout} />;
  }

  if (currentView === "admin") {
    return (
      <Admin
        onBack={handleBackToLogin} // Add this line
      />
    );
  }

  // Fallback to login if something goes wrong
  return <LoginPage onLogin={handleStudentLogin} onAdmin={handleAdminAccess} />;
}

export default App;
