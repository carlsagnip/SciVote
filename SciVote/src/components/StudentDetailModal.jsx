import { useState } from "react";
import { X, Edit2, Trash2, Save, XCircle, User } from "lucide-react";

export default function StudentDetailModal({
  student,
  onClose,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    middleInitial: student.middleInitial,
    photo: student.photo || "",
  });
  const [photoPreview, setPhotoPreview] = useState(student.photo || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setEditedData({ ...editedData, photo: base64String });
      setPhotoPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setEditedData({ ...editedData, photo: "" });
    setPhotoPreview("");
  };

  const handleSave = () => {
    // Validate
    if (!editedData.firstName.trim() || !editedData.lastName.trim()) {
      alert("First name and last name are required.");
      return;
    }

    // Build full name
    const fullName = `${editedData.firstName.trim()} ${
      editedData.middleInitial.trim()
        ? editedData.middleInitial.trim() + ". "
        : ""
    }${editedData.lastName.trim()}`;

    const updatedStudent = {
      ...student,
      firstName: editedData.firstName.trim(),
      lastName: editedData.lastName.trim(),
      middleInitial: editedData.middleInitial.trim(),
      fullName,
      photo: editedData.photo,
    };

    onUpdate(updatedStudent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      firstName: student.firstName,
      lastName: student.lastName,
      middleInitial: student.middleInitial,
      photo: student.photo || "",
    });
    setPhotoPreview(student.photo || "");
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(student.schoolId);
    onClose();
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? "Edit Student" : "Student Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Photo Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={student.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    Change Photo
                  </label>
                  {photoPreview && (
                    <button
                      onClick={clearPhoto}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Student Information */}
            <div className="space-y-4">
              {/* School ID (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School ID
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600">
                  {student.schoolId}
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.firstName}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {student.firstName}
                  </div>
                )}
              </div>

              {/* Middle Initial */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Middle Initial
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.middleInitial}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        middleInitial: e.target.value.toUpperCase(),
                      })
                    }
                    maxLength="1"
                    className="w-20 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center"
                  />
                ) : (
                  <div className="w-20 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    {student.middleInitial || "-"}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.lastName}
                    onChange={(e) =>
                      setEditedData({ ...editedData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {student.lastName}
                  </div>
                )}
              </div>

              {/* Full Name Display */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-800">
                  {isEditing
                    ? `${editedData.firstName} ${
                        editedData.middleInitial
                          ? editedData.middleInitial + ". "
                          : ""
                      }${editedData.lastName}`
                    : student.fullName}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Delete
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{student.fullName}</span> (ID:{" "}
              {student.schoolId})? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
