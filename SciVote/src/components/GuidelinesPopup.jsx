import { FiX } from 'react-icons/fi';

export default function GuidelinesPopup({ onClose, onAccept }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Popup Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Voting Guidelines & Terms</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Popup Content */}
        <div className="p-6 space-y-6">
          {/* How to Use */}
          <section>
            <h3 className="text-lg font-semibold text-red-800 mb-3">How to Use SciVote</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Step 1:</strong> Review all available candidates and positions carefully</p>
              <p><strong>Step 2:</strong> Select your preferred candidate for each position</p>
              <p><strong>Step 3:</strong> Review your selections before submitting</p>
              <p><strong>Step 4:</strong> Click "Submit Vote" to cast your ballot</p>
            </div>
          </section>

          {/* Voting Guidelines */}
          <section>
            <h3 className="text-lg font-semibold text-red-800 mb-3">Voting Guidelines</h3>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li>Each student is allowed to vote only once per election</li>
              <li>You must use your official student ID to participate</li>
              <li>Votes are anonymous and confidential</li>
              <li>You may abstain from voting on any position if desired</li>
              <li>Once submitted, votes cannot be changed or withdrawn</li>
              <li>Voting is available during the designated election period only</li>
              <li>Do not share your student ID with others</li>
              <li>Report any technical issues immediately to election officials</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h3 className="text-lg font-semibold text-red-800 mb-3">Eligibility Requirements</h3>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li>Must be a currently enrolled student</li>
              <li>Student ID must be active and in good standing</li>
            </ul>
          </section>

          {/* Terms and Agreement */}
          <section>
            <h3 className="text-lg font-semibold text-red-800 mb-3">Terms and Agreement</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-3">
              <p><strong>By using SciVote, you agree to the following terms:</strong></p>
              <p><strong>Privacy:</strong> Your voting choices are confidential. Only aggregated, anonymous results will be shared publicly. Your student ID is used solely for verification and will not be linked to your voting choices.</p>
              <p><strong>Integrity:</strong> You commit to vote honestly and not attempt to manipulate the voting process. Any fraudulent activity will result in disqualification and may lead to disciplinary action.</p>
              <p><strong>Technical Issues:</strong> While we strive for system reliability, you acknowledge that technical issues may occur. Report any problems immediately to election officials.</p>
              <p><strong>Data Security:</strong> We implement appropriate security measures to protect your data. However, no system is 100% secure, and you acknowledge this inherent risk.</p>
              <p><strong>Election Validity:</strong> The institution reserves the right to void elections in case of significant technical failures, security breaches, or other extraordinary circumstances.</p>
              <p><strong>Compliance:</strong> You agree to comply with all institutional policies and local laws regarding student elections.</p>
              <p className="font-medium">By proceeding to login and vote, you acknowledge that you have read, understood, and agree to these terms and guidelines.</p>
            </div>
          </section>

          {/* Support */}
          <section>
            <h3 className="text-lg font-semibold text-red-800 mb-3">Need Help?</h3>
            <p className="text-gray-700">
              If you encounter any issues or have questions about the voting process, please contact the Election Committee or IT Support immediately.
            </p>
          </section>
        </div>

        {/* Popup Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="flex-1 bg-red-800 text-white py-2 px-4 rounded-md font-medium hover:bg-red-900 transition-colors duration-200"
          >
            I Agree - Proceed to Vote
          </button>
        </div>
      </div>
    </div>
  );
}
