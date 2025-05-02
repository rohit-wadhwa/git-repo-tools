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
  container.style.cssText = 'width: 95px; height: 27.9972px; position: relative;';

  // Create button
  const button = document.createElement('a');
  button.href = url;
  button.rel = 'nofollow';
  button.setAttribute('data-view-component', 'true');
  button.setAttribute('data-quickwiki-button', type);
  button.setAttribute('aria-label', text);
  button.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(246, 248, 250);
    color: rgb(37, 41, 46);
    border: 0.909091px solid rgb(209, 217, 224);
    padding: 0px 8px;
    margin: 0px;
    width: 100%;
    height: 100%;
    text-decoration: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
    position: relative;
  `;
  
  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'Button-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.style.cssText = `
    position: absolute;
    display: none;
    opacity: 0;
    padding: 0.4em 0.8em;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    background-color: rgb(36, 41, 47);
    color: rgb(255, 255, 255);
    border-radius: 6px;
    box-shadow: 0 1px 0 rgba(27,31,36,0.04);
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 6px;
    pointer-events: none;
    z-index: 1000;
    transition: opacity 0.1s ease-in-out;
  `;
  tooltip.textContent = text;

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
          : '<path fill="currentColor" d="M1.5 1.75v11.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Zm.5 11.25v-11h11.5v11Zm8-3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm-4 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75-2.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm4 0a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z"></path>'}
      </svg>
      ${type === 'deepwiki' ? 'DeepWiki' : 'Diagram'}
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
  button.className = 'btn btn-sm ide-button';

  const overlay = document.createElement('div');
  overlay.className = 'dropdown-menu ide-overlay';
  overlay.style.cssText = `
    position: absolute;
    display: none;
    z-index: 1000;
    top: 100%;
    right: 0;
    width: 240px;
    background-color: var(--color-canvas-overlay);
    border: 1px solid var(--color-border-default);
    border-radius: 6px;
    box-shadow: var(--color-shadow-large);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  `;

  const menuList = document.createElement('ul');
  menuList.className = 'ide-menu-list';
  menuList.style.cssText = `
    list-style: none;
    padding: 8px 0;
    margin: 0;
    width: 100%;
  `;

  // Add header
  const headerItem = document.createElement('li');
  headerItem.className = 'ide-menu-header';
  headerItem.textContent = 'Open in Web IDE';
  menuList.appendChild(headerItem);

  const webIDEOptions = [
    { name: 'VS Code', url: (repo) => `https://vscode.dev/github/${repo}` },
    { name: 'github.dev', url: (repo) => `https://github.dev/${repo}` },
    { name: 'CodeSandbox', url: (repo) => `https://codesandbox.io/s/github/${repo}` },
    { name: 'StackBlitz', url: (repo) => `https://stackblitz.com/github/${repo}` },
    { name: 'Gitpod', url: (repo) => `https://gitpod.io/#https://github.com/${repo}` }
  ];

  webIDEOptions.forEach(option => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = option.url(getUrl());
    link.className = 'ide-menu-item';
    link.style.cssText = `
      display: flex;
      align-items: center;
      padding: 6px 16px;
      color: var(--color-fg-default);
      text-decoration: none;
      font-size: 14px;
      width: 100%;
      cursor: pointer;
    `;
    link.textContent = option.name;
    item.appendChild(link);
    menuList.appendChild(item);
  });

  overlay.appendChild(menuList);

  // Add click handler with view transitions
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isHidden = overlay.style.display === 'none';
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        overlay.style.display = isHidden ? 'block' : 'none';
      });
    } else {
      overlay.style.display = isHidden ? 'block' : 'none';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          overlay.style.display = 'none';
        });
      } else {
        overlay.style.display = 'none';
      }
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
    } else {
      // For multiple options, create a button
      element = document.createElement('button');
      element.type = 'button';
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
        z-index: 1000;
        min-width: 160px;
        padding: 4px 0;
        margin: 2px 0 0;
        background-color: #fff;
        border: 1px solid rgba(27,31,36,0.15);
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(27,31,36,0.12);
      `;

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

      // Toggle dropdown on click
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isHidden = dropdown.style.display === 'none';
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            dropdown.style.display = isHidden ? 'block' : 'none';
          });
        } else {
          dropdown.style.display = isHidden ? 'block' : 'none';
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!buttonContainer.contains(e.target)) {
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              dropdown.style.display = 'none';
            });
          } else {
            dropdown.style.display = 'none';
          }
        }
      });

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