import { useState } from "react";
import {
  studentsDB,
  candidatesDB,
  partyListsDB,
  votesDB,
} from "../lib/supabaseHelpers";
import { supabase } from "../lib/supabaseClient";
function CustomAlert({ message, type = "success", onClose }) {
  const styles = {
    success: { bg: "bg-green-500", icon: "M5 13l4 4L19 7" },
    error: { bg: "bg-red-500", icon: "M6 18L18 6M6 6l12 12" },
    warning: {
      bg: "bg-yellow-500",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    info: {
      bg: "bg-blue-500",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };
  const style = styles[type];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
      <div
        className={`${style.bg} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center min-w-[400px]`}
      >
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={style.icon}
          />
        </svg>
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 hover:text-gray-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CustomConfirm({
  message,
  onConfirm,
  onMerge,
  onCancel,
  type = "warning",
  showMerge = false,
}) {
  const styles = {
    warning: {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    danger: {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700",
    },
    info: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };
  const style = styles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
        <div
          className={`${style.bg} ${style.border} border-l-4 p-6 rounded-t-xl relative`}
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex items-start pr-8">
            <div className={`${style.color} mr-3 flex-shrink-0`}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Action
              </h3>
              <p className="text-gray-700">{message}</p>
            </div>
          </div>
        </div>
        <div className="p-6 flex justify-end gap-3">
          {showMerge && (
            <button
              onClick={onMerge}
              className="px-6 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              Merge
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 text-sm font-medium text-white ${style.button} rounded-lg transition-colors`}
          >
            {showMerge ? "Replace" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings({
  candidates,
  registeredStudents,
  electionEnded,
  onElectionEnd,
  onBack,
}) {
  const [alert, setAlert] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const showConfirm = (
    message,
    onConfirm,
    type = "warning",
    showMerge = false,
    onMerge = null
  ) => {
    setConfirm({ message, onConfirm, type, showMerge, onMerge });
  };

  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  const storageSize = Math.round(
    JSON.stringify({ candidates, registeredStudents }).length / 1024
  );

  // Utility function to download JSON
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export handlers
  const handleExport = (type) => {
    const date = new Date().toISOString().split("T")[0];
    const exports = {
      all: {
        data: {
          candidates,
          registeredStudents,
          electionEnded,
          exportDate: new Date().toISOString(),
          version: "1.0",
        },
        file: `scivote-backup-${date}.json`,
      },
      students: {
        data: {
          registeredStudents,
          exportDate: new Date().toISOString(),
          version: "1.0",
          type: "students",
        },
        file: `scivote-students-${date}.json`,
      },
      candidates: {
        data: {
          candidates,
          exportDate: new Date().toISOString(),
          version: "1.0",
          type: "candidates",
        },
        file: `scivote-candidates-${date}.json`,
      },
    };
    downloadJSON(exports[type].data, exports[type].file);
    showAlert(
      `${
        type === "all" ? "Data" : type.charAt(0).toUpperCase() + type.slice(1)
      } exported successfully!`,
      "success"
    );
  };

  // Import handler
  const handleImport = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (type === "all" && (!data.candidates || !data.registeredStudents)) {
          showAlert("Invalid backup file format.", "error");
          return;
        }
        if (type === "students" && !Array.isArray(data.registeredStudents)) {
          showAlert("Invalid student data format.", "error");
          return;
        }
        if (type === "candidates" && !Array.isArray(data.candidates)) {
          showAlert("Invalid candidate data format.", "error");
          return;
        }

        const handleReplace = () => {
          if (type === "all") {
            localStorage.setItem(
              "registered_candidates",
              JSON.stringify(data.candidates)
            );
            localStorage.setItem(
              "registered_students",
              JSON.stringify(data.registeredStudents)
            );
            localStorage.setItem(
              "electionEnded",
              JSON.stringify(data.electionEnded || false)
            );
          } else if (type === "students") {
            localStorage.setItem(
              "registered_students",
              JSON.stringify(data.registeredStudents)
            );
          } else {
            localStorage.setItem(
              "registered_candidates",
              JSON.stringify(data.candidates)
            );
          }
          showAlert(
            `${
              type === "all"
                ? "Data"
                : type.charAt(0).toUpperCase() + type.slice(1)
            } imported successfully!`,
            "success"
          );
          setTimeout(() => window.location.reload(), 2000);
          setConfirm(null);
        };

        const handleMerge = () => {
          if (type === "students") {
            const existingIds = new Set(
              registeredStudents.map((s) => s.schoolId)
            );
            const newStudents = data.registeredStudents.filter(
              (s) => !existingIds.has(s.schoolId)
            );
            localStorage.setItem(
              "registered_students",
              JSON.stringify([...registeredStudents, ...newStudents])
            );
          } else if (type === "candidates") {
            const existingIds = new Set(candidates.map((c) => c.id));
            const newCandidates = data.candidates.filter(
              (c) => !existingIds.has(c.id)
            );
            localStorage.setItem(
              "registered_candidates",
              JSON.stringify([...candidates, ...newCandidates])
            );
          }
          showAlert(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } merged successfully!`,
            "success"
          );
          setTimeout(() => window.location.reload(), 2000);
          setConfirm(null);
        };

        showConfirm(
          type === "all"
            ? "Import this data? Current data will be replaced."
            : `Import ${type}? Choose Replace or Merge.`,
          handleReplace,
          "warning",
          type !== "all",
          type !== "all" ? handleMerge : null
        );
      } catch (error) {
        showAlert("Error reading file. Ensure it is valid JSON.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleEndElection = () => {
    showConfirm(
      "End the election? This action cannot be undone.",
      () => {
        onElectionEnd();
        showAlert("Election ended successfully!", "success");
        setConfirm(null);
      },
      "danger"
    );
  };

  const handleResetElection = () => {
    showConfirm(
      "Reset election? All votes will be cleared but candidates and voters remain.",
      async () => {
        try {
          // Delete all votes
          const { error: votesError } = await supabase
            .from("votes")
            .delete()
            .gte("id", "00000000-0000-0000-0000-000000000000");
          if (votesError) throw votesError;

          // Reset all students' voting status
          const { error: studentsError } = await supabase
            .from("students")
            .update({
              has_voted: false,
              voting_status: "pending",
              voted_at: null,
            })
            .gte("id", "00000000-0000-0000-0000-000000000000");
          if (studentsError) throw studentsError;

          showAlert("Election reset successfully!", "success");
          setTimeout(() => window.location.reload(), 2000);
          setConfirm(null);
        } catch (error) {
          console.error("Reset election error:", error);
          showAlert("Failed to reset election. Please try again.", "error");
          setConfirm(null);
        }
      },
      "warning"
    );
  };

  const handleResetSystem = () => {
    showConfirm(
      "Reset all data? This cannot be undone.",
      () => {
        showConfirm(
          "Final warning: All data will be deleted. Continue?",
          async () => {
            try {
              // Delete all data from all tables in correct order (due to foreign keys)
              const { error: votesError } = await supabase
                .from("votes")
                .delete()
                .gte("id", "00000000-0000-0000-0000-000000000000");
              if (votesError) throw votesError;

              const { error: candidatesError } = await supabase
                .from("candidates")
                .delete()
                .gte("id", "00000000-0000-0000-0000-000000000000");
              if (candidatesError) throw candidatesError;

              const { error: studentsError } = await supabase
                .from("students")
                .delete()
                .gte("id", "00000000-0000-0000-0000-000000000000");
              if (studentsError) throw studentsError;

              const { error: partyListsError } = await supabase
                .from("party_lists")
                .delete()
                .gte("id", "00000000-0000-0000-0000-000000000000");
              if (partyListsError) throw partyListsError;

              showAlert("System reset complete!", "success");
              setTimeout(() => window.location.reload(), 2000);
              setConfirm(null);
            } catch (error) {
              console.error("System reset error:", error);
              showAlert("Failed to reset system. Please try again.", "error");
              setConfirm(null);
            }
          },
          "danger"
        );
      },
      "danger"
    );
  };

  const StatCard = ({ value, label, highlight }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className={`text-2xl font-semibold ${highlight || "text-gray-900"}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );

  const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center px-6 py-5 border-b border-gray-200">
      <svg
        className="w-5 h-5 text-gray-400 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={icon}
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
  );

  const ActionButton = ({ onClick, children, color = "gray", icon }) => {
    const colors = {
      gray: "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
      blue: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 focus:ring-blue-500",
      green:
        "text-green-700 bg-green-50 border-green-200 hover:bg-green-100 focus:ring-green-500",
      red: "text-white bg-red-600 border-red-600 hover:bg-red-700 focus:ring-red-500",
      orange:
        "text-white bg-orange-600 border-orange-600 hover:bg-orange-700 focus:ring-orange-500",
    };
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium border ${colors[color]} focus:ring-2 focus:ring-offset-2 rounded-lg transition-colors`}
      >
        {icon && (
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d={icon}
            />
          </svg>
        )}
        {children}
      </button>
    );
  };

  const FileInput = ({ onChange, children, color = "gray", icon }) => (
    <label
      className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors cursor-pointer"
      style={{
        color:
          color === "gray"
            ? "#374151"
            : color === "blue"
            ? "#1d4ed8"
            : "#15803d",
        backgroundColor:
          color === "gray" ? "white" : color === "blue" ? "#eff6ff" : "#f0fdf4",
        borderColor:
          color === "gray"
            ? "#d1d5db"
            : color === "blue"
            ? "#bfdbfe"
            : "#bbf7d0",
      }}
    >
      {icon && (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={icon}
          />
        </svg>
      )}
      {children}
      <input
        type="file"
        accept=".json"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {alert && <CustomAlert {...alert} onClose={() => setAlert(null)} />}
      {confirm && (
        <CustomConfirm {...confirm} onCancel={() => setConfirm(null)} />
      )}

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -100%); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-lg text-gray-600">
              System configuration and management
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors border"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>{" "}
            Back
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard value={candidates.length} label="Total Candidates" />
          <StatCard
            value={registeredStudents.length}
            label="Registered Voters"
          />
          <StatCard value={totalVotes} label="Total Votes" />
          <StatCard
            value={electionEnded ? "Ended" : "Active"}
            label="Election Status"
            highlight={electionEnded ? "text-red-600" : "text-green-600"}
          />
        </div>

        <div className="space-y-8">
          {/* Election Control */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <SectionHeader
              icon="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9V6a2 2 0 00-2-2H5a2 2 0 00-2 2v1m16 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7m16 0H5"
              title="Election Control"
            />
            <div className="px-6 py-5">
              {electionEnded ? (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">
                      Election Completed
                    </h4>
                    <p className="text-sm text-green-600 mt-1">
                      The election has been finalized and results are official.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">
                    End the election to finalize results and prevent further
                    voting.
                  </p>
                  <ActionButton onClick={handleEndElection} color="red">
                    End Election
                  </ActionButton>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Reset the election while keeping all candidates and voters
                  registered. All votes will be cleared.
                </p>
                <ActionButton
                  onClick={handleResetElection}
                  color="orange"
                  icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                >
                  Reset Election
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <SectionHeader
              icon="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              title="Data Management"
            />
            <div className="px-6 py-5 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Complete System Backup
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Export or import all election data
                </p>
                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    onClick={() => handleExport("all")}
                    icon="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  >
                    Export All Data
                  </ActionButton>
                  <FileInput
                    onChange={(e) => handleImport(e, "all")}
                    icon="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  >
                    Import All Data
                  </FileInput>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Student Data
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Export or import registered students only
                </p>
                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    onClick={() => handleExport("students")}
                    color="blue"
                    icon="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  >
                    Export Students
                  </ActionButton>
                  <FileInput
                    onChange={(e) => handleImport(e, "students")}
                    color="blue"
                    icon="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  >
                    Import Students
                  </FileInput>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Candidate Data
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Export or import registered candidates only
                </p>
                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    onClick={() => handleExport("candidates")}
                    color="green"
                    icon="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  >
                    Export Candidates
                  </ActionButton>
                  <FileInput
                    onChange={(e) => handleImport(e, "candidates")}
                    color="green"
                    icon="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  >
                    Import Candidates
                  </FileInput>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Danger Zone
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete all system data
                </p>
                <ActionButton
                  onClick={handleResetSystem}
                  color="red"
                  icon="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                >
                  Reset System
                </ActionButton>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <SectionHeader
              icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              title="System Information"
            />
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900">SciVote v1.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Storage Usage
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {storageSize}KB
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Backup
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">Never</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                  <dd className="mt-1 text-sm text-gray-900">Session-based</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
