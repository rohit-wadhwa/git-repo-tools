# Privacy Policy for GitRepoTools

**Last updated: December 2024**

## Overview

GitRepoTools ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome extension handles your information.

## Information We Do NOT Collect

GitRepoTools is designed with privacy as a core principle. We want to be absolutely clear about what we do NOT do:

- ❌ **No Personal Data Collection**: We do not collect, store, or transmit any personal information
- ❌ **No Browsing History**: We do not track or record your browsing activity
- ❌ **No Analytics**: We do not use any analytics services or tracking tools
- ❌ **No Third-Party Data Sharing**: We do not share any data with third parties
- ❌ **No User Accounts**: We do not require registration or create user profiles
- ❌ **No Cookies**: We do not set or use cookies for tracking
- ❌ **No Network Requests**: The extension does not make API calls or send data anywhere

## Information We Do Store Locally

The only data GitRepoTools handles is your extension settings, which are:

### Settings Storage
- **What**: Your preferences for which tools to display (e.g., show/hide DeepWiki, IDE options)
- **Where**: Stored locally in your browser using Chrome's sync storage
- **Access**: Only accessible by the extension itself
- **Sync**: Settings may sync across your Chrome browsers if you're signed into Chrome
- **Control**: You can reset settings anytime using the "Reset to Defaults" button

### Example Settings Data:
```json
{
  "categories": {
    "showIDE": true,
    "showDeepWiki": true,
    "showDiagram": true,
    "showGitingest": true
  },
  "ideOptions": {
    "showVSCode": true,
    "showGithubDev": true,
    "showCodeSandbox": true,
    "showStackBlitz": true,
    "showGitpod": true
  }
}
```

## How the Extension Works

GitRepoTools operates entirely client-side:

1. **Detection**: Detects when you visit a GitHub repository page
2. **Injection**: Adds tool buttons to the GitHub interface
3. **Functionality**: When you click a button, it opens the corresponding service in a new tab
4. **Settings**: Saves your preferences locally for future visits

## Permissions Explained

Our extension requests minimal permissions:

### Required Permissions:
- **`activeTab`**: Allows the extension to inject buttons into the current GitHub page
- **`storage`**: Enables saving your settings preferences locally
- **`host_permissions` for github.com**: Restricts extension to work only on GitHub pages

### Why These Permissions:
- We only access the current tab when you're on GitHub
- We only store your settings preferences
- We never access other websites or tabs

## Third-Party Services

When you click our tool buttons, you'll be redirected to external services:

### Services We Integrate With:
- **DeepWiki** (deepwiki.com)
- **GitDiagram** (gitdiagram.com)  
- **Gitingest** (gitingest.com)
- **VS Code Web** (vscode.dev)
- **GitHub.dev** (github.dev)
- **CodeSandbox** (codesandbox.io)
- **StackBlitz** (stackblitz.com)
- **Gitpod** (gitpod.io)

### Important Notes:
- Each service has its own privacy policy
- We do not control these external services
- No data is shared between our extension and these services
- Your interaction with these services is direct

## Data Security

Since we don't collect data, there's no data to secure! However:

- Settings are encrypted in Chrome's storage system
- All code is open source and auditable
- No sensitive information is ever processed
- Extension works offline (except for external service access)

## Children's Privacy

GitRepoTools does not knowingly collect any information from children under 13. Since we don't collect any personal information from anyone, this policy applies to all users regardless of age.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify users of any changes by:

- Updating the "Last updated" date
- Publishing changes in our GitHub repository
- Including update notes in extension updates if significant changes occur

## Open Source Transparency

GitRepoTools is completely open source:

- **Source Code**: Available at https://github.com/rohit-wadhwa/git-repo-tools
- **Audit**: Anyone can review our code to verify privacy claims
- **Contributions**: Community contributions are welcome
- **Issues**: Report privacy concerns via GitHub issues

## Contact Us

If you have any questions about this Privacy Policy or our practices:

- **GitHub Issues**: https://github.com/rohit-wadhwa/git-repo-tools/issues
- **Email**: rohit.wadhwa52@gmail.com
- **Repository**: https://github.com/rohit-wadhwa/git-repo-tools

## Legal Basis (GDPR Compliance)

For users in the European Union:

- **No Personal Data**: Since we don't collect personal data, GDPR data processing requirements don't apply
- **Settings Storage**: Based on legitimate interest for extension functionality
- **Consent**: By using the extension, you consent to storing your settings locally
- **Rights**: You can delete all data by uninstalling the extension or resetting settings

## Summary

**GitRepoTools is privacy-first by design:**
- ✅ No data collection
- ✅ No tracking  
- ✅ No analytics
- ✅ Open source
- ✅ Local-only settings storage
- ✅ Minimal permissions

We believe great tools shouldn't compromise your privacy. GitRepoTools enhances your GitHub experience while keeping your data completely private.

---

*This privacy policy is designed to be transparent and comprehensive. If you have any questions or concerns, please don't hesitate to contact us.* 