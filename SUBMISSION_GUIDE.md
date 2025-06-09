# Chrome Web Store Submission Guide

## Pre-Submission Checklist

### ✅ Required Files
- [x] `manifest.json` (Manifest V3 compliant)
- [x] Extension icons (16x16, 32x32, 48x48, 128x128)
- [x] `PRIVACY_POLICY.md` 
- [x] `STORE_LISTING.md` (copy content for store description)
- [x] All source files (content.js, popup.html, etc.)

### ✅ Required Images for Store
You need to create these images before submission:

1. **Icon** (128x128px, PNG)
   - Use your `icons/icon128.png`
   - Should be clean, professional, and recognizable

2. **Screenshots** (1280x800px recommended, PNG/JPEG)
   - Screenshot 1: GitHub repository page with GitRepoTools buttons visible
   - Screenshot 2: Extension popup showing settings
   - Screenshot 3: IDE dropdown menu in action
   - Screenshot 4: Dark mode example (optional)
   - Screenshot 5: Mobile responsive view (optional)

3. **Promotional Images** (optional but recommended)
   - Small promotional tile: 440x280px
   - Large promotional tile: 920x680px
   - Marquee promotional tile: 1400x560px

## Step-by-Step Submission Process

### Step 1: Prepare Your Package
```bash
# Create a ZIP file with your extension
zip -r GitRepoTools-v1.0.zip . -x "*.git*" "*.DS_Store*" "test.html" "node_modules/*" "SUBMISSION_GUIDE.md"
```

### Step 2: Chrome Web Store Developer Console
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay the one-time $5 developer registration fee (if not done already)
3. Click "Add new item"

### Step 3: Upload Extension
1. Upload your ZIP file
2. Wait for automatic analysis
3. Fix any errors reported

### Step 4: Store Listing Information

#### Basic Information
- **Name**: GitRepoTools - Essential GitHub Repository Tools
- **Summary**: Copy from `STORE_LISTING.md` (132 chars max)
- **Description**: Copy detailed description from `STORE_LISTING.md`
- **Category**: Developer Tools
- **Language**: English

#### Privacy
- **Privacy Policy**: `https://github.com/rohit-wadhwa/git-repo-tools/blob/main/PRIVACY_POLICY.md`
- **Permissions**: Copy justification from `STORE_LISTING.md`

#### Additional Fields
- **Support URL**: `https://github.com/rohit-wadhwa/git-repo-tools`
- **Homepage URL**: `https://github.com/rohit-wadhwa/git-repo-tools`

### Step 5: Upload Images
1. Upload icon (128x128px)
2. Upload screenshots (at least 1, maximum 5)
3. Add promotional images if created

### Step 6: Distribution Settings
- **Visibility**: Public
- **Regions**: All regions (or select specific ones)
- **Pricing**: Free

### Step 7: Review and Submit
1. Review all information
2. Click "Submit for review"
3. Extension will be reviewed by Google (usually 1-3 business days)

## Post-Submission

### During Review
- Monitor your developer dashboard for updates
- Respond promptly to any review feedback
- Be prepared to make changes if requested

### After Approval
- Extension will be live on Chrome Web Store
- Monitor user reviews and feedback
- Update regularly based on user needs

### Maintenance
- Keep extension updated with GitHub changes
- Respond to user reviews professionally  
- Release updates through the same dashboard

## Common Rejection Reasons to Avoid

### Content Policy Violations
- ✅ Our extension doesn't violate any policies
- ✅ No spam or unwanted software
- ✅ Clear privacy policy provided

### Technical Issues
- ✅ Manifest V3 compliant
- ✅ No security vulnerabilities
- ✅ Proper permissions requested

### Misleading Information
- ✅ Accurate description
- ✅ Clear about what extension does
- ✅ No false claims

## Marketing Tips

### Keywords for Discovery
Include these in your description:
- GitHub tools
- Developer productivity  
- Web IDE
- VS Code
- Code editor
- Repository tools

### User Reviews Strategy
- Encourage satisfied users to leave reviews
- Respond to all reviews professionally
- Address issues quickly with updates

### Social Media Promotion
- Share on developer communities
- Post on LinkedIn, Twitter with relevant hashtags
- Share in GitHub-related forums

## Version Updates

### Updating Your Extension
1. Update version number in `manifest.json`
2. Update `CHANGELOG.md` 
3. Create new ZIP package
4. Upload through developer dashboard
5. Updates usually review faster than initial submissions

### Versioning Strategy
- Use semantic versioning (1.0.0, 1.0.1, 1.1.0, etc.)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

## Support and Resources

### Official Google Resources
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Web Store Review Process](https://developer.chrome.com/docs/webstore/review-process/)

### Community Resources
- Stack Overflow (chrome-extension tag)
- Reddit r/chrome_extensions
- Chrome Extensions Google Group

## Estimated Timeline

- **Preparation**: 2-3 hours (if images ready)
- **Initial Submission**: 30 minutes
- **Review Time**: 1-3 business days
- **Total Time to Live**: 2-4 days

Good luck with your submission! 🚀 