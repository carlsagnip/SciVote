const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  isElectron: true
});

console.log('SciVote preload script loaded successfully');