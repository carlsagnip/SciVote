export default function MainHeader({ studentId }) {
  return (
    <header className="bg-red-800 text-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Logo + Text */}
        <div className="flex items-center gap-4">
          <img
            src="logo2.png"
            alt="Logo"
            className="w-24 h-24 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold">SciVote</h1>
            <p className="text-sm opacity-90">
              Honorato C. Perez, Sr. Memorial Science High School
            </p>
            <p className="text-sm opacity-90">Student ID: {studentId}</p>
          </div>
        </div>
      </div>
    </header>
  );
}