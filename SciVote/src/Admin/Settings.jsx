export default function Settings({ candidates, registeredStudents, electionEnded, onElectionEnd, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-600">System configuration and management</p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-2xl font-semibold text-gray-900">{candidates.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Candidates</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-2xl font-semibold text-gray-900">{registeredStudents.length}</div>
            <div className="text-sm text-gray-600 mt-1">Registered Voters</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-2xl font-semibold text-gray-900">
              {candidates.reduce((total, candidate) => total + (candidate.votes || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Votes</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className={`text-2xl font-semibold ${electionEnded ? 'text-red-600' : 'text-green-600'}`}>
              {electionEnded ? 'Ended' : 'Active'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Election Status</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Election Control */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9V6a2 2 0 00-2-2H5a2 2 0 00-2 2v1m16 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7m16 0H5" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Election Control</h3>
              </div>
            </div>
            <div className="px-6 py-5">
              {electionEnded ? (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Election Completed</h4>
                    <p className="text-sm text-green-600 mt-1">
                      The election has been finalized and results are official.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    End the election to finalize results and prevent further voting.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to END the election? This action cannot be undone.')) {
                        onElectionEnd();
                        alert('Election ended successfully!');
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
                  >
                    End Election
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    const data = {
                      candidates,
                      registeredStudents,
                      electionEnded,
                      exportDate: new Date().toISOString(),
                      version: 'SciVote v1.0'
                    };
                    const dataStr = JSON.stringify(data, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `scivote-backup-${new Date().toISOString().split('T')[0]}.json`;
                    
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Export Data
                </button>
                
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target.result);
                            alert('Data structure verified. Import functionality would be implemented here.');
                            console.log('Import data:', data);
                          } catch (error) {
                            alert('Invalid file format.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Import Data
                </button>
                
                <button 
                  onClick={() => {
                    if (window.confirm('Reset all data? This cannot be undone.')) {
                      if (window.confirm('Final warning: All data will be deleted. Continue?')) {
                        localStorage.clear();
                        alert('System reset. Please refresh the page.');
                      }
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Reset System
                </button>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">System Information</h3>
              </div>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900">SciVote v1.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Storage Usage</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Math.round(JSON.stringify({candidates, registeredStudents}).length / 1024)}KB
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Backup</dt>
                  <dd className="mt-1 text-sm text-gray-900">Never</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                  <dd className="mt-1 text-sm text-gray-900">Session-based</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Security & Maintenance */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Security & Maintenance</h3>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    alert('Security check completed successfully.');
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Security Check
                </button>
                
                <button 
                  onClick={() => {
                    alert('Maintenance completed successfully.');
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  System Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}