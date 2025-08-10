import { useState } from "react";
import ErrorBanner from "../components/ErrorBanner";

export default function RegisterStudents({
  registeredStudents,
  setRegisteredStudents,
  onBack
}) {
  const [newStudentId, setNewStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddStudent = () => {
    const trimmedId = newStudentId.trim();
    if (!trimmedId) {
      setErrorMessage("Student ID cannot be empty.");
      return;
    }
    if (registeredStudents.includes(trimmedId)) {
      setErrorMessage("This student ID is already registered.");
      return;
    }
    setRegisteredStudents([...registeredStudents, trimmedId]);
    setNewStudentId("");
    setErrorMessage("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {/* Error banner overlay */}
      {errorMessage && (
        <div className="absolute -top-12 left-0 w-full">
          <ErrorBanner
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Register Students</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={newStudentId}
          onChange={(e) => setNewStudentId(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAddStudent}
          className="bg-red-800 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">
          Registered Students ({registeredStudents.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {registeredStudents.map((id, i) => (
            <div key={i} className="bg-gray-50 p-2 border rounded">
              {id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
