// Store tab states
const tabStates = new Map();

// Default settings
const defaultSettings = {
  categories: {
    showIDE: true,
    showDeepWiki: true,
    showDiagram: true,
    showGitingest: true
  },
  ideOptions: {
    showVSCode: true,
    showGithubDev: true,
    showCodeSandbox: true,
    showStackBlitz: true,
    showGitpod: true
  }
};

// Initialize settings when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  chrome.storage.sync.get(defaultSettings, (settings) => {
    // If settings don't exist or are incomplete, set them to defaults
    if (!settings.categories || !settings.ideOptions) {
      chrome.storage.sync.set(defaultSettings, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to initialize default settings:', chrome.runtime.lastError);
        } else {
          console.log('Default settings initialized');
        }
      });
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {
    // Reset state for this tab
    tabStates.set(tabId, {
      buttonsAdded: false,
      lastPath: new URL(tab.url).pathname
    });
    
    // Notify content script to update buttons
    chrome.tabs.sendMessage(tabId, { 
      type: 'URL_CHANGED',
      url: tab.url
    }).catch(() => {
      // Ignore errors when content script isn't ready yet
    });
  }
});

// Clean up when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;

  switch (message.type) {
    case 'GET_STATE':
      sendResponse(tabStates.get(tabId) || { buttonsAdded: false });
      break;
      
    case 'UPDATE_STATE':
      tabStates.set(tabId, {
        ...tabStates.get(tabId),
        ...message.state
      });
      break;
      
    case 'BUTTONS_ADDED':
      if (tabStates.has(tabId)) {
        tabStates.get(tabId).buttonsAdded = true;
      }
      break;
  }
}); 