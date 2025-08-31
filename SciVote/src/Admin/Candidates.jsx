import { useState, useEffect } from "react";
import ErrorBanner from "../components/ErrorBanner";

// Simulated async storage functions
const AsyncStorage = {
  getItem: async (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      }, 100);
    });
  },
  
  setItem: async (key, value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }, 100);
    });
  }
};

const STUDENTS_STORAGE_KEY = 'registered_students';
const CANDIDATES_STORAGE_KEY = 'registered_candidates';
const PARTYLISTS_STORAGE_KEY = 'party_lists'; // New storage key for party lists

export default function Candidates({ onBack }) {
  const [candidates, setCandidates] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [partyLists, setPartyLists] = useState([]); // Changed to state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [position, setPosition] = useState("");
  const [partyList, setPartyList] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // New states for adding party lists
  const [newPartyName, setNewPartyName] = useState("");
  const [showAddPartyForm, setShowAddPartyForm] = useState(false);
  const [addingParty, setAddingParty] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterParty, setFilterParty] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Load data from async storage on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load registered students
      const storedStudents = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
      if (storedStudents && Array.isArray(storedStudents)) {
        setRegisteredStudents(storedStudents);
      } else {
        setRegisteredStudents([]);
      }

      // Load party lists
      const storedPartyLists = await AsyncStorage.getItem(PARTYLISTS_STORAGE_KEY);
      if (storedPartyLists && Array.isArray(storedPartyLists)) {
        setPartyLists(storedPartyLists);
      } else {
      }

      // Load candidates
      const storedCandidates = await AsyncStorage.getItem(CANDIDATES_STORAGE_KEY);
      if (storedCandidates && Array.isArray(storedCandidates)) {
        setCandidates(storedCandidates);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setErrorMessage('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveCandidates = async (candidatesData) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem(CANDIDATES_STORAGE_KEY, candidatesData);
      setSuccessMessage('Candidate data saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save candidates:', error);
      setErrorMessage('Failed to save candidate data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const savePartyLists = async (partyListsData) => {
    try {
      await AsyncStorage.setItem(PARTYLISTS_STORAGE_KEY, partyListsData);
    } catch (error) {
      console.error('Failed to save party lists:', error);
      setErrorMessage('Failed to save party lists. Please try again.');
    }
  };

  // Function to add new party list
  const addPartyList = async () => {
    if (!newPartyName.trim()) {
      setErrorMessage("Please enter a party name.");
      return;
    }

    // Check if party already exists (case-insensitive)
    if (partyLists.some(party => party.toLowerCase() === newPartyName.trim().toLowerCase())) {
      setErrorMessage("This party list already exists.");
      return;
    }

    try {
      setAddingParty(true);
      const updatedPartyLists = [...partyLists, newPartyName.trim()];
      setPartyLists(updatedPartyLists);
      await savePartyLists(updatedPartyLists);
      
      setNewPartyName("");
      setShowAddPartyForm(false);
      setSuccessMessage(`"${newPartyName.trim()}" party list added successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setErrorMessage("");
    } catch (error) {
      console.error('Failed to add party list:', error);
      setErrorMessage('Failed to add party list. Please try again.');
    } finally {
      setAddingParty(false);
    }
  };

  // Function to remove party list
  const removePartyList = async (partyToRemove) => {
    // Check if any candidates are using this party
    const candidatesUsingParty = candidates.filter(c => c.partyList === partyToRemove);
    if (candidatesUsingParty.length > 0) {
      setErrorMessage(`Cannot remove "${partyToRemove}" because ${candidatesUsingParty.length} candidate(s) are assigned to this party.`);
      return;
    }

    try {
      const updatedPartyLists = partyLists.filter(party => party !== partyToRemove);
      setPartyLists(updatedPartyLists);
      await savePartyLists(updatedPartyLists);
      
      setSuccessMessage(`"${partyToRemove}" party list removed successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to remove party list:', error);
      setErrorMessage('Failed to remove party list. Please try again.');
    }
  };

  // Predefined positions
  const positions = [
    "President",
    "Vice President", 
    "Secretary",
    "Treasurer",
    "Auditor",
    "Public Information Officer",
    "Representative",
  ];

  // Get students who are not already candidates
  const availableStudents = registeredStudents.filter(student => 
    !candidates.some(candidate => candidate.schoolId === student.schoolId)
  );

  // Filter available students based on search term
  const filteredAvailableStudents = availableStudents.filter(student =>
    student.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.schoolId.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Filter candidates based on search and filter criteria
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.schoolId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = !filterPosition || candidate.position === filterPosition;
    const matchesParty = !filterParty || candidate.partyList === filterParty;
    
    return matchesSearch && matchesPosition && matchesParty;
  });

  const selectStudent = (student) => {
    setSelectedStudent(student.schoolId);
    setStudentSearchTerm(student.fullName);
    setShowStudentDropdown(false);
  };

  const addCandidate = async () => {
    if (!selectedStudent || !position.trim() || !partyList.trim()) {
      setErrorMessage("Please fill in all fields before adding a candidate.");
      return;
    }

    // Find the selected student details
    const student = registeredStudents.find(s => s.schoolId === selectedStudent);
    if (!student) {
      setErrorMessage("Selected student not found.");
      return;
    }

    // Check if position is already taken by someone from the same party
    const existingCandidate = candidates.find(c => 
      c.position === position && c.partyList === partyList
    );
    if (existingCandidate) {
      setErrorMessage(`${partyList} already has a candidate for ${position}.`);
      return;
    }

    const newCandidate = {
      id: Date.now(),
      name: student.fullName,
      schoolId: student.schoolId,
      position,
      partyList
    };

    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    await saveCandidates(updatedCandidates);

    setSelectedStudent("");
    setStudentSearchTerm("");
    setPosition("");
    setPartyList("");
    setErrorMessage("");
  };

  const removeCandidate = async (id) => {
    const updatedCandidates = candidates.filter((c) => c.id !== id);
    setCandidates(updatedCandidates);
    await saveCandidates(updatedCandidates);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPosition("");
    setFilterParty("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 relative">
      {errorMessage && (
        <div className="absolute -top-12 left-0 w-full z-10">
          <ErrorBanner
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </div>
      )}

      {successMessage && (
        <div className="absolute -top-12 left-0 w-full z-10">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
            <button 
              onClick={() => setSuccessMessage("")}
              className="text-white hover:text-green-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Candidate Management</h2>
          <p className="text-slate-600">Add and manage candidates for the election</p>
        </div>
        <button
          onClick={onBack}
          className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Party List Management Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-800">Party List Management</h3>
          <button
            onClick={() => setShowAddPartyForm(!showAddPartyForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showAddPartyForm ? 'Cancel' : 'Add New Party'}
          </button>
        </div>

        {/* Add Party Form */}
        {showAddPartyForm && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder="Enter party list name..."
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addPartyList()}
              />
              <button
                onClick={addPartyList}
                disabled={addingParty || !newPartyName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {addingParty ? 'Adding...' : 'Add Party'}
              </button>
            </div>
          </div>
        )}

        {/* Current Party Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partyLists.map((party) => {
            const candidateCount = candidates.filter(c => c.partyList === party).length;
            return (
              <div key={party} className="bg-white rounded-lg p-3 flex justify-between items-center shadow-sm">
                <div>
                  <span className="font-medium text-slate-800">{party}</span>
                  <div className="text-sm text-slate-500">{candidateCount} candidate{candidateCount !== 1 ? 's' : ''}</div>
                </div>
                <button
                  onClick={() => removePartyList(party)}
                  disabled={candidateCount > 0}
                  className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-1"
                  title={candidateCount > 0 ? 'Cannot delete - has candidates' : 'Delete party list'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice if no students registered */}
      {registeredStudents.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No students registered
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You need to register students first before you can add candidates. Please go to the Student Registration section to add students.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Form */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Add New Candidate</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Student Selection with Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search & Select Student
            </label>
            <div className="relative">
              <input
                type="text"
                value={studentSearchTerm}
                onChange={(e) => {
                  setStudentSearchTerm(e.target.value);
                  setShowStudentDropdown(true);
                  if (!e.target.value) {
                    setSelectedStudent("");
                  }
                }}
                onFocus={() => setShowStudentDropdown(true)}
                placeholder={availableStudents.length === 0 ? "No available students" : "Search students..."}
                disabled={availableStudents.length === 0}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <div className="absolute right-3 top-3 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Dropdown */}
              {showStudentDropdown && filteredAvailableStudents.length > 0 && studentSearchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredAvailableStudents.map((student) => (
                    <button
                      key={student.schoolId}
                      type="button"
                      onClick={() => selectStudent(student)}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium text-slate-900">{student.fullName}</div>
                      <div className="text-sm text-slate-500">{student.schoolId}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Position Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="">Select position...</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Party List Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Party List
            </label>
            <select
              value={partyList}
              onChange={(e) => setPartyList(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="">Select party...</option>
              {partyLists.map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={addCandidate}
          disabled={availableStudents.length === 0 || saving}
          className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? (
            <span className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </span>
          ) : (
            "Add Candidate"
          )}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{candidates.length}</div>
          <div className="text-red-100">Total Candidates</div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{partyLists.length}</div>
          <div className="text-blue-100">Active Party Lists</div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{positions.length}</div>
          <div className="text-green-100">Available Positions</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-slate-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Search & Filter Candidates</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Candidates</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
              <div className="absolute right-3 top-2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Position</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="">All positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Party</label>
            <select
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="">All parties</option>
              {partyLists.map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {candidates.length > 0 && (
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredCandidates.length} of {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Candidates Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
              <th className="text-left p-4 font-semibold text-slate-700 rounded-tl-xl">Student ID</th>
              <th className="text-left p-4 font-semibold text-slate-700">Name</th>
              <th className="text-left p-4 font-semibold text-slate-700">Position</th>
              <th className="text-left p-4 font-semibold text-slate-700">Party List</th>
              <th className="text-center p-4 font-semibold text-slate-700 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">
                      {candidates.length === 0 ? "No candidates registered yet" : "No candidates match your search criteria"}
                    </p>
                    <p className="text-sm">
                      {candidates.length === 0 
                        ? registeredStudents.length === 0 
                          ? "Register students first, then add candidates from registered students"
                          : "Start by adding candidates from registered students"
                        : "Try adjusting your search or filter criteria"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                  <td className="p-4 font-medium text-slate-900">{candidate.schoolId}</td>
                  <td className="p-4 font-medium text-slate-900">{candidate.name}</td>
                  <td className="p-4">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {candidate.position}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium">
                      {candidate.partyList}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeCandidate(candidate.id)}
                      disabled={saving}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Click outside handler for dropdown */}
      {showStudentDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowStudentDropdown(false)}
        />
      )}
    </div>
  );
}