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

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
  // Show loading state
  showLoading(true);
  
  // First ensure default settings exist
  chrome.storage.sync.get(defaultSettings, (settings) => {
    if (chrome.runtime.lastError) {
      console.error('Failed to load settings:', chrome.runtime.lastError);
      showError('Failed to load settings. Please try again.');
      showLoading(false);
      return;
    }
    
    // Merge with defaults to ensure all properties exist
    const mergedSettings = {
      categories: { ...defaultSettings.categories, ...settings.categories },
      ideOptions: { ...defaultSettings.ideOptions, ...settings.ideOptions }
    };

    // Save merged settings back if they were incomplete
    if (JSON.stringify(settings) !== JSON.stringify(mergedSettings)) {
      chrome.storage.sync.set(mergedSettings, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save merged settings:', chrome.runtime.lastError);
          showError('Failed to save settings. Please try again.');
          showLoading(false);
          return;
        }
      });
    }

    // Set category toggles
    Object.keys(mergedSettings.categories).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = mergedSettings.categories[id];
        checkbox.addEventListener('change', () => updateSettings());
      } else {
        console.warn(`Checkbox with id ${id} not found in popup.html`);
      }
    });

    // Set IDE option toggles
    Object.keys(mergedSettings.ideOptions).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = mergedSettings.ideOptions[id];
        checkbox.addEventListener('change', () => updateSettings());
      } else {
        console.warn(`Checkbox with id ${id} not found in popup.html`);
      }
    });

    // Add reset button listener
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.addEventListener('click', resetToDefaults);
    }

    // Notify content script to update buttons immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url?.includes('github.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'SETTINGS_UPDATED',
          settings: mergedSettings
        }, () => {
          // Ignore errors if content script isn't ready
          if (chrome.runtime.lastError) {
            console.log('Content script not ready yet, settings will be applied on next page load');
          }
        });
      }
    });
    
    // Hide loading state
    showLoading(false);
  });
});

// Show/hide loading state
function showLoading(show) {
  const spinner = document.getElementById('loadingSpinner');
  const body = document.body;
  
  if (show) {
    spinner.style.display = 'block';
    body.style.opacity = '0.5';
  } else {
    spinner.style.display = 'none';
    body.style.opacity = '1';
  }
}

// Reset settings to defaults
function resetToDefaults() {
  if (!confirm('Reset all settings to defaults? This cannot be undone.')) {
    return;
  }
  
  showLoading(true);
  
  chrome.storage.sync.set(defaultSettings, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to reset settings:', chrome.runtime.lastError);
      showError('Failed to reset settings. Please try again.');
      showLoading(false);
      return;
    }
    
    // Update checkboxes to reflect defaults
    Object.keys(defaultSettings.categories).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = defaultSettings.categories[id];
      }
    });
    
    Object.keys(defaultSettings.ideOptions).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = defaultSettings.ideOptions[id];
      }
    });
    
    showSuccess('Settings reset to defaults!');
    
    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url?.includes('github.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'SETTINGS_UPDATED',
          settings: defaultSettings
        }, () => {
          if (chrome.runtime.lastError) {
            console.log('Content script not ready yet, settings will be applied on next page load');
          }
        });
      }
    });
    
    showLoading(false);
  });
}

// Show error message to user
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    color: #d73a49;
    background: #ffeef0;
    border: 1px solid #fdb8c0;
    border-radius: 4px;
    padding: 8px;
    margin: 8px 0;
    font-size: 12px;
  `;
  errorDiv.textContent = message;
  document.body.insertBefore(errorDiv, document.body.firstChild);
  
  // Remove after 5 seconds
  setTimeout(() => errorDiv.remove(), 5000);
}

// Update settings when checkboxes change
function updateSettings() {
  const settings = {
    categories: {
      showIDE: document.getElementById('showIDE')?.checked ?? false,
      showDeepWiki: document.getElementById('showDeepWiki')?.checked ?? false,
      showDiagram: document.getElementById('showDiagram')?.checked ?? false,
      showGitingest: document.getElementById('showGitingest')?.checked ?? false
    },
    ideOptions: {
      showVSCode: document.getElementById('showVSCode')?.checked ?? false,
      showGithubDev: document.getElementById('showGithubDev')?.checked ?? false,
      showCodeSandbox: document.getElementById('showCodeSandbox')?.checked ?? false,
      showStackBlitz: document.getElementById('showStackBlitz')?.checked ?? false,
      showGitpod: document.getElementById('showGitpod')?.checked ?? false
    }
  };

  // Save settings with error handling
  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to save settings:', chrome.runtime.lastError);
      showError('Failed to save settings. Please try again.');
      return;
    }
    
    // Show success feedback
    showSuccess('Settings saved!');
    
    // Notify content script to update buttons
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url?.includes('github.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'SETTINGS_UPDATED',
          settings: settings
        }, () => {
          // Ignore errors if content script isn't ready
          if (chrome.runtime.lastError) {
            console.log('Content script not ready yet, settings will be applied on next page load');
          }
        });
      }
    });
  });
}

// Show success message to user
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    color: #28a745;
    background: #f0fff4;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    padding: 8px;
    margin: 8px 0;
    font-size: 12px;
  `;
  successDiv.textContent = message;
  document.body.insertBefore(successDiv, document.body.firstChild);
  
  // Remove after 2 seconds
  setTimeout(() => successDiv.remove(), 2000);
} 