import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, X } from "lucide-react";
import VoteSubmitted from "../components/VoteSubmitted";
import VoteSummary from "../components/VoteSummary";
import Header from "../components/MainHeader";
import { studentsDB, candidatesDB, votesDB } from "../lib/supabaseHelpers";

export default function Vote({ studentData = null, onLogout = () => {} }) {
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validatedStudent, setValidatedStudent] = useState(null);
  const [students, setStudents] = useState([]); // Added to store all students with photos

  // Validate student on component mount
  useEffect(() => {
    validateStudent();
  }, []);

  // Load candidates after student validation
  useEffect(() => {
    if (validatedStudent) {
      loadCandidates();
      loadStudents(); // Load all students for photo access
    }
  }, [validatedStudent]);

  const validateStudent = async () => {
    try {
      if (!studentData || !studentData.schoolId) {
        setError("No student information provided. Please log in again.");
        return;
      }

      const registeredStudent = await studentsDB.getBySchoolId(
        studentData.schoolId
      );

      if (!registeredStudent) {
        setError(
          "Student ID not found in registration database. Please contact administrator."
        );
        return;
      }

      if (
        registeredStudent.has_voted ||
        registeredStudent.voting_status === "completed"
      ) {
        setError(
          "You have already submitted your vote. Each student can only vote once."
        );
        return;
      }

      // Transform to match expected format
      const transformedStudent = {
        schoolId: registeredStudent.school_id,
        firstName: registeredStudent.first_name,
        lastName: registeredStudent.last_name,
        middleInitial: registeredStudent.middle_initial,
        fullName: registeredStudent.full_name,
        photo: registeredStudent.photo,
        fingerprint: registeredStudent.fingerprint,
      };
      setValidatedStudent(transformedStudent);
    } catch (error) {
      console.error("Student validation error:", error);
      setError("Failed to validate student information. Please try again.");
    }
  };

  const loadStudents = async () => {
    try {
      const data = await studentsDB.getAll();
      const transformedStudents = data.map((s) => ({
        schoolId: s.school_id,
        firstName: s.first_name,
        lastName: s.last_name,
        middleInitial: s.middle_initial,
        fullName: s.full_name,
        photo: s.photo,
        fingerprint: s.fingerprint,
      }));
      setStudents(transformedStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const storedCandidates = await candidatesDB.getAll();

      if (!storedCandidates || storedCandidates.length === 0) {
        setError("No candidates found. Please contact the administrator.");
        setLoading(false);
        return;
      }

      // Group candidates by position
      const positionGroups = {};

      storedCandidates.forEach((candidate) => {
        const positionKey = getPositionKey(candidate.position);
        if (!positionGroups[positionKey]) {
          positionGroups[positionKey] = {
            id: positionKey,
            title: candidate.position,
            candidates: [],
          };
        }
        positionGroups[positionKey].candidates.push({
          name: candidate.name,
          schoolId: candidate.schoolId,
          partyList: candidate.partyList,
        });
      });

      // Convert to array and sort by predefined order
      const positionOrder = [
        "president",
        "vicePresident",
        "secretary",
        "treasurer",
        "auditor",
        "pio",
      ];
      const positionsArray = positionOrder
        .map((key) => positionGroups[key])
        .filter(Boolean)
        .concat(
          Object.values(positionGroups).filter(
            (pos) => !positionOrder.includes(pos.id)
          )
        );

      if (positionsArray.length === 0) {
        setError("No valid positions found. Please contact the administrator.");
        setLoading(false);
        return;
      }

      setPositions(positionsArray);

      // Initialize votes object with all positions
      const initialVotes = {};
      positionsArray.forEach((position) => {
        initialVotes[position.id] = "";
      });
      setVotes(initialVotes);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert position names to keys
  const getPositionKey = (positionName) => {
    const keyMapping = {
      President: "president",
      "Vice President": "vicePresident",
      Secretary: "secretary",
      Treasurer: "treasurer",
      Auditor: "auditor",
      "Public Information Officer": "pio",
      Representative: "representative",
    };

    return (
      keyMapping[positionName] || positionName.toLowerCase().replace(/\s+/g, "")
    );
  };

  // Helper function to get student photo by school ID
  const getStudentPhoto = (schoolId) => {
    if (!schoolId || !students.length) return null;
    const student = students.find(
      (s) => s.schoolId.toLowerCase() === schoolId.toLowerCase()
    );
    return student?.photo || null;
  };

  const currentPosition = positions[currentPositionIndex];

  const handleVoteChange = (position, candidateName) => {
    setVotes((prev) => ({ ...prev, [position]: candidateName }));
  };

  const handleSubmitClick = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      console.log("Votes submitted:", votes);
      await saveVotes(votes);
      setShowConfirmationModal(false);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit votes:", error);
      setError("Failed to submit votes. Please try again.");
    }
  };

  const saveVotes = async (votesData) => {
    try {
      const voteData = {
        studentId: validatedStudent.schoolId,
        studentName: validatedStudent.fullName,
        votes: votesData,
      };

      await votesDB.submit(voteData);
      console.log("Vote submitted successfully");
    } catch (error) {
      console.error("Error saving votes:", error);
      throw new Error("Failed to save vote. Please try again.");
    }
  };

  // No longer needed - voting status update happens in votesDB.submit
  const updateStudentVotingStatus = async (studentId) => {
    // This is now handled by votesDB.submit
    return Promise.resolve();
  };

  const handleCancelSubmit = () => {
    setShowConfirmationModal(false);
  };

  const nextPosition = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex(currentPositionIndex + 1);
    }
  };

  const prevPosition = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex(currentPositionIndex - 1);
    }
  };

  const totalPositions = positions.length;
  const votedCount = Object.values(votes).filter(Boolean).length;

  // Get the candidate object for a given vote
  const getCandidateInfo = (positionId, candidateName) => {
    const position = positions.find((p) => p.id === positionId);
    if (!position) return null;
    return position.candidates.find((c) => c.name === candidateName);
  };

  // Loading state
  if (loading || !validatedStudent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {!validatedStudent
              ? "Validating student..."
              : "Loading candidates..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header studentData={validatedStudent} />
        <main className="max-w-4xl mx-auto p-6 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Unable to Load Election
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={loadCandidates}
                className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onLogout}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No positions available
  if (positions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header studentData={validatedStudent} />
        <main className="max-w-4xl mx-auto p-6 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Candidates Available
            </h2>
            <p className="text-gray-600 mb-6">
              There are currently no candidates registered for this election.
            </p>
            <button
              onClick={onLogout}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (submitted && !showSummary) {
    return (
      <VoteSubmitted
        onViewSummary={() => setShowSummary(true)}
        onExit={onLogout}
        studentData={validatedStudent}
      />
    );
  }

  if (showSummary) {
    return (
      <VoteSummary
        votes={votes}
        positions={positions}
        studentData={validatedStudent}
        onExit={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header studentData={validatedStudent} />

      <main className="max-w-6xl mx-auto p-6 mt-20">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Student Government Election
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Choose one candidate per position.
          </p>

          {/* Position Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {currentPositionIndex + 1} of {totalPositions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-800 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentPositionIndex + 1) / totalPositions) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Current Position */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {currentPosition.title}
            </h3>
            <p className="text-gray-600">
              Select one candidate from {currentPosition.candidates.length}{" "}
              options
            </p>
          </div>

          {/* All Candidates Display */}
          <div className="flex justify-center gap-8 mb-8 max-w-6xl mx-auto flex-wrap">
            {currentPosition.candidates.map((candidate) => {
              const studentPhoto = getStudentPhoto(candidate.schoolId);

              return (
                <div
                  key={candidate.name}
                  className={`bg-white border-2 rounded-lg p-6 text-center shadow-md transition-all cursor-pointer w-72 h-[32rem] flex flex-col ${
                    votes[currentPosition.id] === candidate.name
                      ? "border-red-800 bg-red-50 transform scale-105"
                      : "border-gray-200 hover:border-red-300 hover:shadow-lg"
                  }`}
                  onClick={() =>
                    handleVoteChange(currentPosition.id, candidate.name)
                  }
                >
                  {/* Candidate Photo */}
                  <div className="w-full h-64 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {studentPhoto ? (
                      <img
                        src={studentPhoto}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-gray-400" />
                    )}
                  </div>

                  {/* Candidate Name */}
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {candidate.name}
                  </h4>

                  {/* Party List Badge */}
                  <div className="mb-4 flex-grow flex items-start justify-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
                      {candidate.partyList}
                    </span>
                  </div>

                  {/* Vote Status */}
                  <div className="mb-4">
                    {votes[currentPosition.id] === candidate.name ? (
                      <div className="bg-green-100 border border-green-300 rounded-lg p-2">
                        <p className="text-green-700 font-semibold text-sm">
                          ✓ Selected
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-2">
                        <p className="text-gray-600 text-sm">Click to vote</p>
                      </div>
                    )}
                  </div>

                  {/* Radio Button */}
                  <input
                    type="radio"
                    name={currentPosition.id}
                    value={candidate.name}
                    checked={votes[currentPosition.id] === candidate.name}
                    onChange={() =>
                      handleVoteChange(currentPosition.id, candidate.name)
                    }
                    className="w-5 h-5 accent-red-800"
                  />
                </div>
              );
            })}
          </div>

          {/* Position Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={prevPosition}
              disabled={currentPositionIndex === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentPositionIndex === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous Position
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Voting Progress</p>
              <p className="font-semibold text-gray-800">
                {votedCount}/{totalPositions} positions completed
              </p>
            </div>

            <button
              onClick={nextPosition}
              disabled={currentPositionIndex === positions.length - 1}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentPositionIndex === positions.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              Next Position
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Submit Vote */}
          <div className="text-center">
            <button
              onClick={handleSubmitClick}
              disabled={votedCount < totalPositions}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                votedCount < totalPositions
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-red-800 text-white hover:bg-red-900"
              }`}
            >
              Submit Vote
            </button>

            {votedCount < totalPositions && (
              <p className="text-sm text-gray-500 mt-2">
                Vote for all positions before submitting.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Your Vote
              </h3>
              <button
                onClick={handleCancelSubmit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Student Info in Modal */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Submitting vote for:</p>
                <p className="font-semibold text-gray-800">
                  {validatedStudent.fullName} ({validatedStudent.schoolId})
                </p>
              </div>

              <p className="text-gray-600 mb-6 text-center">
                Please review your selections below. Once submitted, you cannot
                change your vote.
              </p>

              {/* Vote Summary */}
              <div className="space-y-4">
                {positions.map((position) => {
                  const candidateInfo = getCandidateInfo(
                    position.id,
                    votes[position.id]
                  );
                  return (
                    <div
                      key={position.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {position.title}
                          </h4>
                          <p className="text-lg text-red-800 font-medium mb-1">
                            {votes[position.id] || "No selection"}
                          </p>
                          {candidateInfo && (
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {candidateInfo.partyList}
                              </span>
                            </div>
                          )}
                        </div>
                        {votes[position.id] && (
                          <div className="text-green-600 ml-4">
                            <span className="text-sm font-semibold">
                              ✓ Selected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-yellow-800 text-sm font-medium text-center">
                  Note: Your vote is final and cannot be changed after
                  submission.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-center gap-4 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelSubmit}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                No, I'll Change My Vote
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-6 py-3 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-900 transition-colors"
              >
                Yes, I Want to Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
