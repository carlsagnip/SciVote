import { useState } from "react";
import ErrorBanner from "../components/ErrorBanner";

export default function Candidates({ candidates, setCandidates, onBack }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addCandidate = () => {
    if (!name.trim() || !position.trim()) {
      setErrorMessage("Please fill in all fields before adding a candidate.");
      return;
    }
    setCandidates([
      ...candidates,
      { id: Date.now(), name, position, votes: 0 },
    ]);
    setName("");
    setPosition("");
    setErrorMessage("");
  };

  const removeCandidate = (id) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {errorMessage && (
        <div className="absolute -top-12 left-0 w-full">
          <ErrorBanner
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Candidate List</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Back
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addCandidate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Position</th>
            <th className="p-2">Votes</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.position}</td>
              <td className="p-2">{c.votes}</td>
              <td className="p-2">
                <button
                  onClick={() => removeCandidate(c.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
