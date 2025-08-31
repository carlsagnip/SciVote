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

const STORAGE_KEY = 'registered_students';

export default function RegisterStudents({
  onBack = () => {}
}) {
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentData, setStudentData] = useState({
    schoolId: "",
    firstName: "",
    lastName: "",
    middleInitial: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  // Load students from async storage on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const storedStudents = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedStudents && Array.isArray(storedStudents)) {
        setRegisteredStudents(storedStudents);
      } else {
        // Start with empty array - no default students
        setRegisteredStudents([]);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      setErrorMessage('Failed to load student data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveStudents = async (students) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem(STORAGE_KEY, students);
      setSuccessMessage('Student data saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save students:', error);
      setErrorMessage('Failed to save student data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddStudent = async () => {
    const { schoolId, firstName, lastName, middleInitial } = studentData;
    
    const trimmedData = {
      schoolId: schoolId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleInitial: middleInitial.trim()
    };

    if (!trimmedData.schoolId) {
      setErrorMessage("School ID cannot be empty.");
      return;
    }
    if (!trimmedData.firstName) {
      setErrorMessage("First name cannot be empty.");
      return;
    }
    if (!trimmedData.lastName) {
      setErrorMessage("Last name cannot be empty.");
      return;
    }

    const existingStudent = registeredStudents.find(
      student => student.schoolId === trimmedData.schoolId
    );
    if (existingStudent) {
      setErrorMessage("This school ID is already registered.");
      return;
    }

    const newStudent = {
      schoolId: trimmedData.schoolId,
      firstName: trimmedData.firstName,
      lastName: trimmedData.lastName,
      middleInitial: trimmedData.middleInitial,
      fullName: `${trimmedData.firstName} ${trimmedData.middleInitial ? trimmedData.middleInitial + '. ' : ''}${trimmedData.lastName}`
    };

    const updatedStudents = [...registeredStudents, newStudent];
    setRegisteredStudents(updatedStudents);
    await saveStudents(updatedStudents);
    
    setStudentData({
      schoolId: "",
      firstName: "",
      lastName: "",
      middleInitial: ""
    });
    setErrorMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddStudent();
    }
  };

  const removeStudent = async (indexToRemove) => {
    const updatedStudents = registeredStudents.filter((_, index) => index !== indexToRemove);
    setRegisteredStudents(updatedStudents);
    await saveStudents(updatedStudents);
  };

  // Filter students based on search query and filter type
  const filteredStudents = registeredStudents.filter(student => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    
    switch (searchFilter) {
      case "firstName":
        return student.firstName.toLowerCase().includes(query);
      case "lastName":
        return student.lastName.toLowerCase().includes(query);
      case "schoolId":
        return student.schoolId.toLowerCase().includes(query);
      case "middleInitial":
        return student.middleInitial.toLowerCase().includes(query);
      case "all":
      default:
        return (
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.schoolId.toLowerCase().includes(query) ||
          student.middleInitial.toLowerCase().includes(query) ||
          student.fullName.toLowerCase().includes(query)
        );
    }
  });

  const clearSearch = () => {
    setSearchQuery("");
    setSearchFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Error banner */}
        {errorMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
            <ErrorBanner
              message={errorMessage}
              onClose={() => setErrorMessage("")}
            />
          </div>
        )}

        {/* Success banner */}
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between">
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
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Student Registration
              </h1>
              <p className="text-gray-600">Add new students to the system</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 border"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-lg border p-6 h-[600px]">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Add New Student</h2>
              <div className="w-12 h-1 bg-red-800 rounded-full"></div>
            </div>

            <div className="space-y-4">
              {/* School ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter student ID"
                    value={studentData.schoolId}
                    onChange={(e) => handleInputChange('schoolId', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={saving}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={studentData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={saving}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      M.I.
                    </label>
                    <input
                      type="text"
                      placeholder="M"
                      value={studentData.middleInitial}
                      onChange={(e) => handleInputChange('middleInitial', e.target.value.toUpperCase())}
                      onKeyPress={handleKeyPress}
                      maxLength="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-center"
                      disabled={saving}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={studentData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddStudent}
                disabled={saving}
                className="w-full bg-red-800 hover:bg-red-900 disabled:bg-red-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 hover:shadow-lg disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Register Student
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-xl shadow-lg border p-6 h-[600px]">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Registered Students</h2>
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {filteredStudents.length} of {registeredStudents.length} Students
                </div>
              </div>

              {/* Search and Filter Section */}
              <div className="space-y-3 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors cursor-pointer"
                    >
                      <option value="all">All Fields</option>
                      <option value="firstName">First Name</option>
                      <option value="lastName">Last Name</option>
                      <option value="middleInitial">Middle Initial</option>
                      <option value="schoolId">School ID</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Clear Search Button */}
                {(searchQuery || searchFilter !== "all") && (
                  <button
                    onClick={clearSearch}
                    className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Search
                  </button>
                )}
              </div>

              <div className="w-12 h-1 bg-red-800 rounded-full"></div>
            </div>

            <div className="space-y-3 overflow-y-auto h-80">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {searchQuery ? (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-500 font-medium">
                    {searchQuery ? "No students found" : "No students registered yet"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchQuery ? "Try adjusting your search criteria" : "Start by adding your first student"}
                  </p>
                </div>
              ) : (
                filteredStudents.map((student, i) => {
                  const originalIndex = registeredStudents.findIndex(s => s.schoolId === student.schoolId);
                  return (
                    <div key={student.schoolId} className="group bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-red-200 hover:bg-red-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {student.fullName}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                  ID: {student.schoolId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeStudent(originalIndex)}
                          disabled={saving}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove student"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}