// Keep track of button state
let buttonsAdded = false;
let observer = null;

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

// Current settings
let currentSettings = { ...defaultSettings };

// Initialize settings
function initializeSettings(callback) {
  chrome.storage.sync.get(defaultSettings, (settings) => {
    currentSettings = {
      categories: { ...defaultSettings.categories, ...settings.categories },
      ideOptions: { ...defaultSettings.ideOptions, ...settings.ideOptions }
    };
    if (callback) callback();
  });
}

function createButtonDOM(type, text, url) {
  // Create container div
  const container = document.createElement('div');
  container.className = 'd-none d-md-block';

  // Create button - remove inline styles to let CSS handle it
  const button = document.createElement('a');
  button.href = url;
  button.rel = 'nofollow';
  button.setAttribute('data-view-component', 'true');
  button.setAttribute('data-quickwiki-button', type);
  button.setAttribute('aria-label', text);
  button.setAttribute('tabindex', '0');
  
  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'gitrepotools-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.textContent = `Open in ${text}`;

  // Add hover effects
  button.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
    setTimeout(() => tooltip.style.opacity = '1', 0);
  });
  
  button.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    setTimeout(() => tooltip.style.display = 'none', 100);
  });

  // Add icon and shortened text
  button.innerHTML = `
    <span style="display: flex; align-items: center; gap: 4px;">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon">
        ${type === 'deepwiki' 
          ? '<path fill="currentColor" d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"></path>'
          : type === 'diagram'
          ? '<path fill="currentColor" d="M1.5 1.75v11.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Zm.5 11.25v-11h11.5v11Zm8-3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm-4 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75-2.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm4 0a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z"></path>'
          : '<path fill="currentColor" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>'}
      </svg>
      ${type === 'deepwiki' ? 'DeepWiki' : type === 'diagram' ? 'Diagram' : 'Gitingest'}
    </span>
  `;

  container.appendChild(button);
  container.appendChild(tooltip);
  return container;
}

function createWebIDEButton(type, text, getUrl) {
  const container = document.createElement('div');
  container.className = 'ide-button-container';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ide-button';
  button.setAttribute('aria-label', 'Open in Web IDE');
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');

  const overlay = document.createElement('div');
  overlay.className = 'dropdown-menu ide-overlay';

  const menuList = document.createElement('ul');
  menuList.className = 'ide-menu-list';

  // Add header
  const headerItem = document.createElement('li');
  headerItem.className = 'ide-menu-header';
  headerItem.textContent = 'Open in Web IDE';
  menuList.appendChild(headerItem);

  const webIDEOptions = [
    { name: 'VS Code', url: (repo) => `https://vscode.dev/github/${repo}`, id: 'showVSCode' },
    { name: 'github.dev', url: (repo) => `https://github.dev/${repo}`, id: 'showGithubDev' },
    { name: 'CodeSandbox', url: (repo) => `https://codesandbox.io/s/github/${repo}`, id: 'showCodeSandbox' },
    { name: 'StackBlitz', url: (repo) => `https://stackblitz.com/github/${repo}`, id: 'showStackBlitz' },
    { name: 'Gitpod', url: (repo) => `https://gitpod.io/#https://github.com/${repo}`, id: 'showGitpod' }
  ];

  webIDEOptions.forEach(option => {
    // Check if this IDE option is enabled in settings
    if (currentSettings.ideOptions[option.id]) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = option.url(getUrl());
      link.className = 'ide-menu-item';
      link.textContent = option.name;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      item.appendChild(link);
      menuList.appendChild(item);
    }
  });

  overlay.appendChild(menuList);

  // Add click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isHidden = overlay.style.display === 'none' || !overlay.style.display;
    const newDisplay = isHidden ? 'block' : 'none';
    
    // Close other dropdowns first
    document.querySelectorAll('.ide-overlay').forEach(menu => {
      if (menu !== overlay) {
        menu.style.display = 'none';
      }
    });
    
    overlay.style.display = newDisplay;
    button.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      overlay.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Add icon and text to button
  button.innerHTML = `
    <span style="display: flex; align-items: center; gap: 4px;">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon">
        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      IDE
      <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
        <path fill="currentColor" d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path>
      </svg>
    </span>
  `;

  container.appendChild(button);
  container.appendChild(overlay);
  return container;
}

// --- Dropdown management helpers ---
let openDropdown = null;

function closeAllDropdowns() {
  document.querySelectorAll('.gitrepotools-dropdown-menu').forEach(menu => {
    menu.style.display = 'none';
    if (menu.parentElement) menu.parentElement.classList.remove('gitrepotools-dropdown-open');
  });
  openDropdown = null;
}

// Attach a single document click handler (only once)
if (!window._gitrepotoolsDropdownHandler) {
  document.addEventListener('click', (e) => {
    // If the click is inside an open dropdown or its button, do nothing
    if (openDropdown && openDropdown.parentElement && openDropdown.parentElement.contains(e.target)) {
      return;
    }
    closeAllDropdowns();
  });
  window._gitrepotoolsDropdownHandler = true;
}

function createToolsGroup(repName) {
  const container = document.createElement('div');
  container.className = 'BtnGroup d-flex flex-wrap align-items-center gitrepotools-btn-group';
  container.style.cssText = 'gap: 8px; margin-left: 4px; padding-top: 0; width: auto;';

  // Define tool categories based on current settings
  const toolCategories = [];

  // 1) DeepWiki
  if (currentSettings.categories.showDeepWiki) {
    toolCategories.push({
      id: 'docs',
      label: 'DeepWiki',
      icon: '<path fill="currentColor" d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"/>',
      options: [
        { name: 'DeepWiki', url: (repo) => `https://deepwiki.com/${repo}` }
      ]
    });
  }

  // 2) Diagram
  if (currentSettings.categories.showDiagram) {
    toolCategories.push({
      id: 'diagram',
      label: 'Diagram',
      icon: '<path fill="currentColor" d="M1.5 1.75v11.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Zm.5 11.25v-11h11.5v11Zm8-3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm-4 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75-2.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm4 0a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z"/>',
      options: [
        { name: 'GitDiagram', url: (repo) => `https://gitdiagram.com/${repo}` }
      ]
    });
  }

  // 2.5) Gitingest
  // Add after Diagram and before IDE
  if (currentSettings.categories.showGitingest) {
    toolCategories.push({
      id: 'gitingest',
      label: 'Gitingest',
      icon: '<rect x="2" y="1.5" width="9" height="12" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="9.5" cy="11.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.2"/><line x1="11" y1="13" x2="13" y2="15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' ,
      options: [
        { name: 'Gitingest', url: (repo) => `https://gitingest.com/${repo}` }
      ]
    });
  }

  // 3) IDE
  if (currentSettings.categories.showIDE) {
    const ideOptions = [];
    if (currentSettings.ideOptions.showVSCode) {
      ideOptions.push({ name: 'VS Code', url: (repo) => `https://vscode.dev/github/${repo}` });
    }
    if (currentSettings.ideOptions.showGithubDev) {
      ideOptions.push({ name: 'github.dev', url: (repo) => `https://github.dev/${repo}` });
    }
    if (currentSettings.ideOptions.showCodeSandbox) {
      ideOptions.push({ name: 'CodeSandbox', url: (repo) => `https://codesandbox.io/s/github/${repo}` });
    }
    if (currentSettings.ideOptions.showStackBlitz) {
      ideOptions.push({ name: 'StackBlitz', url: (repo) => `https://stackblitz.com/github/${repo}` });
    }
    if (currentSettings.ideOptions.showGitpod) {
      ideOptions.push({ name: 'Gitpod', url: (repo) => `https://gitpod.io/#https://github.com/${repo}` });
    }

    if (ideOptions.length > 0) {
      toolCategories.push({
        id: 'ide',
        label: 'IDE',
        icon: '<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>',
        options: ideOptions
      });
    }
  }

  toolCategories.forEach((category, index) => {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      margin: 0 !important;
      width: auto !important;
    `;

    let element;
    if (category.options.length === 1) {
      // For single option categories, create a link
      element = document.createElement('a');
      element.href = category.options[0].url(repName);
      // Add tooltip for single-option buttons
      const tooltip = document.createElement('div');
      tooltip.className = 'gitrepotools-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.textContent = `Open in ${category.label}`;
      // Show/hide tooltip using opacity and pointer-events only
      element.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';
      });
      element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
      });
      // Append tooltip as sibling to button inside container
      buttonContainer.appendChild(element);
      buttonContainer.appendChild(tooltip);
      // Set container positioning for tooltip
      buttonContainer.style.position = 'relative';
      buttonContainer.style.overflow = 'visible';
    } else {
      // For multiple options, create a button
      element = document.createElement('button');
      element.type = 'button';
      buttonContainer.appendChild(element);
    }

    element.className = 'btn btn-sm';
    element.style.cssText = `
      display: inline-flex;
      align-items: center;
      padding: 3px 12px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      min-width: 80px;
      max-width: 140px;
      flex: 1 1 auto;
      box-sizing: border-box;
    `;

    element.innerHTML = `
      <span style="display: flex; align-items: center; gap: 4px;">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon">
          ${category.icon}
        </svg>
        ${category.label}
        ${category.options.length > 1 ? `
          <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
            <path fill="currentColor" d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path>
          </svg>
        ` : ''}
      </span>
    `;

    // Create dropdown menu for multiple options
    if (category.options.length > 1) {
      const dropdown = document.createElement('div');
      dropdown.className = 'dropdown-menu gitrepotools-dropdown-menu';
      dropdown.style.cssText = `
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 9999;
        min-width: 160px;
        padding: 4px 0;
        margin: 2px 0 0;
        background-color: #fff;
        border: 1px solid rgba(27,31,36,0.15);
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(27,31,36,0.12);
        pointer-events: auto;
      `;

      // Ensure the button container is positioned relative for absolute dropdown
      buttonContainer.style.position = 'relative';
      buttonContainer.style.height = 'auto';
      buttonContainer.style.overflow = 'visible';

      category.options.forEach(option => {
        const item = document.createElement('a');
        item.href = option.url(repName);
        item.className = 'dropdown-item gitrepotools-dropdown-item';
        item.style.cssText = `
          display: block;
          padding: 4px 8px;
          color: rgb(36, 41, 47);
          text-decoration: none;
          font-size: 12px;
          white-space: nowrap;
          &:hover {
            background-color: rgb(246, 248, 250);
          }
        `;
        item.textContent = option.name;
        dropdown.appendChild(item);
      });

      // Toggle dropdown on click (single handler)
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = dropdown.style.display === 'none';
        closeAllDropdowns();
        if (isHidden) {
          dropdown.style.display = 'block';
          buttonContainer.classList.add('gitrepotools-dropdown-open');
          openDropdown = dropdown;
        } else {
          dropdown.style.display = 'none';
          buttonContainer.classList.remove('gitrepotools-dropdown-open');
          openDropdown = null;
        }
      });

      // Always append dropdown as last child
      buttonContainer.appendChild(dropdown);
    }

    buttonContainer.appendChild(element);
    container.appendChild(buttonContainer);
  });

  return container;
}

function getButtonContainer() {
  const headerActions = document.querySelector('.pagehead-actions');
  if (!headerActions) {
    console.debug('[GitRepoTools] Could not find repository header actions');
    return null;
  }

  let container = document.querySelector('[data-gitrepotools-container]');
  if (container) {
    console.debug('[GitRepoTools] Container already exists');
    return null;
  }

  container = document.createElement('li');
  container.setAttribute('data-gitrepotools-container', 'true');
  
  return { container, parent: headerActions };
}

function updateButtons() {
  const pathParts = location.pathname.split('/').filter(Boolean);
  if (pathParts.length < 2) return;

  const elements = getButtonContainer();
  if (!elements) return;

  const { container, parent } = elements;
  const repName = `${pathParts[0]}/${pathParts[1]}`;

  // Create tools group
  const toolsGroup = createToolsGroup(repName);
  container.appendChild(toolsGroup);

  if (container.children.length > 0) {
    parent.appendChild(container);
    buttonsAdded = true;
    chrome.runtime.sendMessage({ type: 'BUTTONS_ADDED' });
  }
}

function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  const container = document.querySelector('[data-gitrepotools-container]');
  if (container) {
    container.remove();
  }
  buttonsAdded = false;
}

function init() {
  // Clean up existing elements
  cleanup();

  // Initialize settings and then update buttons
  initializeSettings(() => {
    // Check if buttons are already added
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
      if (state?.buttonsAdded) {
        console.debug('[GitRepoTools] Buttons already added according to state');
        return;
      }

      // Set up the observer for the header area
      const header = document.querySelector('#repository-details-container');
      if (header) {
        observer = new MutationObserver((mutations) => {
          if (!buttonsAdded) {
            console.debug('[GitRepoTools] DOM changed, updating buttons');
            updateButtons();
          }
        });
        
        observer.observe(header, {
          childList: true,
          subtree: true
        });
      } else {
        console.debug('[GitRepoTools] Could not find repository header for observer');
      }
      
      // Initial update
      updateButtons();
    });
  });
}

// Initialize when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Update the message handling to be more robust
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'URL_CHANGED':
        cleanup();
        init();
        break;
      case 'SETTINGS_UPDATED':
        if (message.settings) {
          currentSettings = message.settings;
        }
        cleanup();
        updateButtons();
        break;
    }
  } catch (error) {
    console.error('[GitRepoTools] Error handling message:', error);
  }
});

// Update the injected CSS to add responsive styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .gitrepotools-tooltip {
    position: absolute;
    top: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    background: rgb(37, 41, 46);
    color: rgb(255, 255, 255);
    padding: 4px 8px;
    border: 0px none rgb(255, 255, 255);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    white-space: normal;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1000;
    margin-top: 0;
    display: block;
  }
  .gitrepotools-dropdown-menu {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .gitrepotools-dropdown-menu:before {
    border: inherit !important;
    border-bottom: none !important;
  }
  .gitrepotools-dropdown-menu[style*="display: block"] {
    opacity: 1;
    transform: translateY(0);
  }
  .gitrepotools-dropdown-item:hover {
    background-color: var(--color-neutral-subtle, #f6f8fa) !important;
  }
  .ide-menu-item:hover {
    background-color: var(--color-neutral-subtle, #f6f8fa);
  }
  .gitrepotools-btn-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-left: 4px;
    padding-top: 0;
    width: auto;
  }
  .gitrepotools-btn-group > div {
    margin: 0 !important;
    width: auto !important;
  }

  @media (max-width: 800px) {
    .gitrepotools-btn-group {
      flex-direction: column !important;
      align-items: stretch !important;
      width: 100% !important;
      gap: 0 !important;
      padding-top: 16px !important;
      margin-left: 0 !important;
    }
    .gitrepotools-btn-group > div {
      width: 100% !important;
      margin: 0 0 12px 0 !important;
    }
    .gitrepotools-btn-group > div:last-child {
      margin-bottom: 0 !important;
    }
  }
`;
document.head.appendChild(styleSheet); 