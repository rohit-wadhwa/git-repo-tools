// Default settings
const defaultSettings = {
  categories: {
    showIDE: true,
    showDeepWiki: true,
    showDiagram: true
  },
  ideOptions: {
    showVSCode: true,
    showGithubDev: true,
    showCodeSandbox: true,
    showStackBlitz: true,
    showGitpod: true
  }
};

// Initialize settings when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(defaultSettings, (settings) => {
    // If settings don't exist, set them to defaults
    if (!settings.categories || !settings.ideOptions) {
      chrome.storage.sync.set(defaultSettings, () => {
        console.log('Default settings initialized');
      });
    }
  });
});

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
  // First ensure default settings exist
  chrome.storage.sync.get(defaultSettings, (settings) => {
    // Merge with defaults to ensure all properties exist
    const mergedSettings = {
      categories: { ...defaultSettings.categories, ...settings.categories },
      ideOptions: { ...defaultSettings.ideOptions, ...settings.ideOptions }
    };

    // Save merged settings back if they were incomplete
    if (JSON.stringify(settings) !== JSON.stringify(mergedSettings)) {
      chrome.storage.sync.set(mergedSettings);
    }

    // Set category toggles
    Object.keys(mergedSettings.categories).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = mergedSettings.categories[id];
        checkbox.addEventListener('change', () => updateSettings());
      }
    });

    // Set IDE option toggles
    Object.keys(mergedSettings.ideOptions).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = mergedSettings.ideOptions[id];
        checkbox.addEventListener('change', () => updateSettings());
      }
    });

    // Notify content script to update buttons immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'SETTINGS_UPDATED',
          settings: mergedSettings
        });
      }
    });
  });
});

// Update settings when checkboxes change
function updateSettings() {
  const settings = {
    categories: {
      showIDE: document.getElementById('showIDE').checked,
      showDeepWiki: document.getElementById('showDeepWiki').checked,
      showDiagram: document.getElementById('showDiagram').checked
    },
    ideOptions: {
      showVSCode: document.getElementById('showVSCode').checked,
      showGithubDev: document.getElementById('showGithubDev').checked,
      showCodeSandbox: document.getElementById('showCodeSandbox').checked,
      showStackBlitz: document.getElementById('showStackBlitz').checked,
      showGitpod: document.getElementById('showGitpod').checked
    }
  };

  // Save settings
  chrome.storage.sync.set(settings, () => {
    // Notify content script to update buttons
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'SETTINGS_UPDATED',
          settings: settings
        });
      }
    });
  });
} 