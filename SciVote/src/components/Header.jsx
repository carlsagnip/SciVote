export default function Header({ onLogout }) {
  return (
    <header className="bg-red-800 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="logo2.png" alt="Logo" className="w-24 h-24 object-contain"/>
          <div>
            <h1 className="text-2xl font-bold">SciVote Admin</h1>
            <p className="text-sm opacity-90">
              Honorato C. Perez, Sr. Memorial Science High School
            </p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="bg-white text-red-800 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
