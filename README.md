# QuickWiki for GitHub

A Chrome extension that adds quick access buttons to view GitHub repositories in DeepWiki and GitDiagram, with additional WebIDE integration.

**⚠️ DISCLAIMER: This is an unofficial extension and is not affiliated with DeepWiki, GitDiagram, or their respective companies in any way.**

## Screenshots

### Main Interface
![Buttons View](images/buttons-view.png)
*Quick access buttons integrated into GitHub's interface*

### IDE Options
![IDE Dropdown](images/ide-dropdown.png)
*Multiple WebIDE options available in the dropdown*

### GitDiagram Integration
![GitDiagram View](images/gitdiagram-view.png)
*Visualize repository architecture with GitDiagram*

### Settings
![Settings Popup](images/settings-popup.png)
*Customize which tools and options are displayed*

## Features

- Adds quick access buttons to GitHub repository pages:
  - "DeepWiki" button for AI-powered documentation (online service)
  - "View in GitDiagram" button for code visualization (online service)
  - "IDE" button with multiple WebIDE options:
    - VS Code Web
    - github.dev
    - CodeSandbox
    - StackBlitz
    - Gitpod
- Customizable settings:
  - Toggle buttons individually
  - Toggle specific WebIDE options
  - Settings auto-save
- Clean, native GitHub-style integration
- Works with public GitHub repositories
- WebIDE options work with both public and private repositories

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension will be installed and ready to use

## Usage

1. Visit any GitHub repository page (e.g., `https://github.com/username/repository`)
2. Look for the "DeepWiki", "View in GitDiagram", and "IDE" buttons in the repository's action buttons section
3. Click any button to access the respective service
   - For IDE options, click the dropdown arrow to select your preferred WebIDE
4. Access settings by clicking the extension icon in your browser toolbar

## Settings

- **Show IDE Options**: Toggle the WebIDE integration button
- **Show DeepWiki Button**: Toggle the DeepWiki quick access button
- **Show GitDiagram Button**: Toggle the GitDiagram quick access button
- **WebIDE Options**: Customize which WebIDE options are available:
  - VS Code Web
  - github.dev
  - CodeSandbox
  - StackBlitz
  - Gitpod

Settings are automatically saved and applied immediately.

## Development

The extension consists of the following main files:
- `manifest.json`: Extension configuration
- `content.js`: Content script that adds the buttons to GitHub pages
- `popup.html` & `popup.js`: Settings interface and logic

## Support

If you find this extension useful, consider supporting its development:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg)](https://buymeacoffee.com/rohit.wadhwa)

## Contact

For any questions or concerns, please:
- Open an issue on the [GitHub repository](https://github.com/rohit-wadhwa/git-repo-tools)
- Email: [rohit.wadhwa52@gmail.com](mailto:rohit.wadhwa52@gmail.com)

## Legal

This extension is not affiliated with, endorsed by, or connected to DeepWiki, GitDiagram, or their respective companies in any way. All trademarks belong to their respective owners. This is an independent, unofficial tool created to enhance the GitHub browsing experience.

## License

MIT 