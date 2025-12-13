import { useState, useEffect } from "react";
import { Fingerprint } from "lucide-react";
import ErrorBanner from "../components/ErrorBanner";
import StudentDetailModal from "../components/StudentDetailModal";

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
  },
};

const STORAGE_KEY = "registered_students";

const Banner = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50`}
  >
    <div
      className={`${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between`}
    >
      <div className="flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={type === "error" ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"}
          />
        </svg>
        {message}
      </div>
      <button
        onClick={onClose}
        className="text-white hover:opacity-80 transition-colors"
      >
        <svg
          className="w-4 h-4"
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

const InputField = ({ label, required, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          {icon}
        </div>
      )}
    </div>
  </div>
);

const StudentCard = ({ student, onRemove, saving, onClick }) => {
  const originalIndex = student.originalIndex;
  return (
    <div
      className="group bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-red-200 hover:bg-red-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center overflow-hidden">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {student.firstName.charAt(0)}
                  {student.lastName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                {student.fullName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  ID: {student.schoolId}
                </span>
                {student.fingerprint && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" />
                    Fingerprint
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking delete
            onRemove(originalIndex);
          }}
          disabled={saving}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function RegisterStudents({ onBack = () => {} }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    schoolId: "",
    firstName: "",
    lastName: "",
    middleInitial: "",
    photo: "",
    fingerprint: "", // Dummy fingerprint ID
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [scanningFingerprint, setScanningFingerprint] = useState(false);

  // Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setStudents(stored && Array.isArray(stored) ? stored : []);
    } catch (err) {
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveStudents = async (newStudents) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem(STORAGE_KEY, newStudents);
      setSuccess("Student data saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save student data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB.");
      return;
    }

    try {
      // Convert to base64 for AsyncStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setForm({ ...form, photo: base64String });
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload photo. Please try again.");
    }
  };

  const clearPhoto = () => {
    setForm({ ...form, photo: "" });
    setPhotoPreview("");
  };

  const handleFingerprintCapture = () => {
    setScanningFingerprint(true);

    // Simulate fingerprint scanning (1.5 seconds)
    setTimeout(() => {
      // Generate a dummy fingerprint ID (hash-like string)
      const fingerprintId = `FP-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase()}`;
      setForm({ ...form, fingerprint: fingerprintId });
      setScanningFingerprint(false);
      setSuccess("Fingerprint captured successfully!");
      setTimeout(() => setSuccess(""), 2000);
    }, 1500);
  };

  const handleAdd = async () => {
    const trimmed = {
      schoolId: form.schoolId.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      middleInitial: form.middleInitial.trim(),
    };

    if (!trimmed.schoolId) return setError("School ID cannot be empty.");
    if (!trimmed.firstName) return setError("First name cannot be empty.");
    if (!trimmed.lastName) return setError("Last name cannot be empty.");
    if (!form.fingerprint)
      return setError("Fingerprint is required. Please capture a fingerprint.");
    if (students.find((s) => s.schoolId === trimmed.schoolId))
      return setError("This school ID is already registered.");

    const newStudent = {
      ...trimmed,
      fullName: `${trimmed.firstName} ${
        trimmed.middleInitial ? trimmed.middleInitial + ". " : ""
      }${trimmed.lastName}`,
      photo: form.photo || "", // Store the base64 photo string
      fingerprint: form.fingerprint || "", // Store the fingerprint ID
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    await saveStudents(updated);
    setForm({
      schoolId: "",
      firstName: "",
      lastName: "",
      middleInitial: "",
      photo: "",
      fingerprint: "",
    });
    setPhotoPreview("");
    setError("");
  };

  const handleRemove = async (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
    await saveStudents(updated);
  };

  // Modal handlers
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleUpdateStudent = async (updatedStudent) => {
    const updated = students.map((s) =>
      s.schoolId === updatedStudent.schoolId ? updatedStudent : s
    );
    setStudents(updated);
    await saveStudents(updated);
    setShowModal(false);
    setSuccess("Student updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteStudent = async (schoolId) => {
    const updated = students.filter((s) => s.schoolId !== schoolId);
    setStudents(updated);
    await saveStudents(updated);
    setShowModal(false);
    setSuccess("Student deleted successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const filtered = students
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      if (filter === "all")
        return (
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.schoolId.toLowerCase().includes(q) ||
          s.middleInitial.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q)
        );
      return s[filter].toLowerCase().includes(q);
    })
    .map((s, i) => ({
      ...s,
      originalIndex: students.findIndex((st) => st.schoolId === s.schoolId),
    }));

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
        {error && (
          <Banner message={error} type="error" onClose={() => setError("")} />
        )}
        {success && (
          <Banner
            message={success}
            type="success"
            onClose={() => setSuccess("")}
          />
        )}

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
              </svg>
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border p-6 h-[800px]">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Add New Student
              </h2>
              <div className="w-12 h-1 bg-red-800 rounded-full"></div>
            </div>

            <div className="space-y-4">
              <InputField
                label="School ID"
                required
                placeholder="Enter student ID"
                value={form.schoolId}
                onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                disabled={saving}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                  disabled={saving}
                />

                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="M.I."
                    placeholder="M"
                    value={form.middleInitial}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        middleInitial: e.target.value.toUpperCase(),
                      })
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                    maxLength="1"
                    disabled={saving}
                    style={{ textAlign: "center" }}
                  />
                  <div className="col-span-2">
                    <InputField
                      label="Last Name"
                      required
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Photo (Optional)
                </label>
                <div className="flex flex-col gap-3">
                  {photoPreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={photoPreview}
                        alt="Student preview"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={clearPhoto}
                        disabled={saving}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
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
                  ) : (
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={saving}
                      className="hidden"
                    />
                    <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-center font-medium transition-colors border">
                      {photoPreview ? "Change Photo" : "Upload Photo"}
                    </div>
                  </label>
                </div>
              </div>

              {/* Fingerprint Registration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fingerprint <span className="text-red-500">*</span>
                </label>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                  {form.fingerprint ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-700">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium text-sm">
                          Fingerprint Registered
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border">
                        {form.fingerprint}
                      </p>
                      <button
                        onClick={() => setForm({ ...form, fingerprint: "" })}
                        disabled={saving || scanningFingerprint}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove Fingerprint
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <Fingerprint
                          className={`w-16 h-16 ${
                            scanningFingerprint
                              ? "text-red-600 animate-pulse"
                              : "text-gray-400"
                          } transition-colors duration-300`}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {scanningFingerprint
                          ? "Scanning fingerprint..."
                          : "No fingerprint registered"}
                      </p>
                      <button
                        onClick={handleFingerprintCapture}
                        disabled={saving || scanningFingerprint}
                        className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                      >
                        {scanningFingerprint ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-4 h-4" />
                            <span>Capture Fingerprint</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full bg-red-800 hover:bg-red-900 disabled:bg-red-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors hover:shadow-lg"
              >
                <span className="flex items-center justify-center">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Register Student
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-6 h-[800px]">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Registered Students
                </h2>
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {filtered.length} of {students.length} Students
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      <option value="all">All Fields</option>
                      <option value="firstName">First Name</option>
                      <option value="lastName">Last Name</option>
                      <option value="middleInitial">Middle Initial</option>
                      <option value="schoolId">School ID</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {(search || filter !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Clear Search
                  </button>
                )}
              </div>

              <div className="w-12 h-1 bg-red-800 rounded-full"></div>
            </div>

            <div className="space-y-3 overflow-y-auto h-[600px]">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          search
                            ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            : "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        }
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    {search
                      ? "No students found"
                      : "No students registered yet"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {search
                      ? "Try adjusting your search criteria"
                      : "Start by adding your first student"}
                  </p>
                </div>
              ) : (
                filtered.map((s) => (
                  <StudentCard
                    key={s.schoolId}
                    student={s}
                    onRemove={handleRemove}
                    saving={saving}
                    onClick={() => handleStudentClick(s)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdateStudent}
          onDelete={handleDeleteStudent}
        />
      )}
    </div>
  );
}
