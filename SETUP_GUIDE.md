# 🚀 Google Classroom Material Auto-Sync System — Setup Guide

This script runs entirely on **Google Apps Script (GAS)** and does not depend on your PC being turned on or connected to the internet.
It executes fully automatically on Google's servers.

[日本語のセットアップガイドはこちら (Japanese Setup Guide)](./SETUP_GUIDE_ja.md)

---

## 📋 Requirements

- A browser logged into Google with an organizational Workspace account (e.g., `student@university.edu`)
- About 10 minutes of setup time (initial setup only)

---

## Step 1: Create a Google Apps Script Project

1. Log into Google with your **organization account** (e.g., `student@university.edu`).
2. Go to [script.google.com](https://script.google.com) in your browser.
3. Click **"New Project"** in the top left.
4. Rename the project (top left "Untitled project") to **"Classroom Material Sync"**.

---

## Step 2: Enable Google Classroom API

1. Click the **"+"** next to **"Services"** on the left sidebar.
2. Find and select **"Google Classroom API"** from the list.
3. Click **"Add"**.

> ⚠️ If you cannot find the "Google Classroom API", your organization's Google Workspace admin might have restricted API usage. Please contact your IT department in this case.

---

## Step 3: Create and Paste Script Files

By default, there is a file named `Code.gs` in the GAS editor.
Follow these steps to create the necessary 5 files.

### 3-1. `Code.gs` (Main Script)
1. Rename the default `Code.gs` to **`Code`** (Click "⋮" next to the filename → "Rename").
2. Delete all default contents and paste the contents of `Code.js` from this repository.

### 3-2. Add Remaining Files
Click **"+" → "Script"** next to "Files" on the left sidebar to create the following:

| Filename | Description |
|-----------|------|
| `Config` | Configuration (Paste contents of `Config.js`) |
| `ClassroomFetcher` | Classroom API Operations |
| `DriveManager` | Google Drive Operations |
| `Logger` | Logging |
| `Notifier` | Email Notifications |

> 💡 In GAS, the `.gs` extension is added automatically, so just type the filename.

---

## Step 4: Customize Settings (Optional)

Open `Config.gs` and edit the following as needed:

```javascript
// Personal email address to share with
PERSONAL_EMAIL: 'YOUR_EMAIL@example.com',

// Whether to receive email notifications
NOTIFY_ON_NEW: true,
```

### Course Name Mapping (Optional)
If you want to convert Classroom course names to cleaner folder names:

```javascript
const COURSE_NAME_MAP = {
  'Linear Algebra 101': 'Math/Linear Algebra',
  'English 101': 'Languages/English',
};
```

---

## Step 5: Initial Execution & Authentication

1. Select **`listAllCourses`** from the dropdown menu at the top of the editor.
2. Click the **"Run"** button ▶.
3. An **Authorization dialog** will appear:
   - Click "Review Permissions"
   - Select your organization account
   - Click "Advanced" → "Go to Classroom Material Sync (unsafe)"
   - Click "Allow"
4. Check the **Execution Log** at the bottom to see your list of courses.

> 💡 The "unsafe" warning appears because this is a custom script not verified by Google. Since it's your own script, it's completely safe.

---

## Step 6: Test Run

1. Select **`testSyncFirstCourse`** from the dropdown and click Run.
2. Verify that the materials for the first course are listed in the log.
3. If everything looks good, select **`syncClassroomMaterials`** and run it to sync all courses.

---

## Step 7: Set Up Automated Triggers

### Method A: Setup via Script (Recommended)
1. Select **`setupTriggers`** from the dropdown and run it.
2. This will create triggers that automatically run the sync daily at 8:00 AM and 8:00 PM.

### Method B: Manual Trigger Setup
1. Click **"Triggers"** (⏰ icon) on the left sidebar.
2. Click **"+ Add Trigger"** in the bottom right.
3. Set the following:
   - Choose which function to run: `syncClassroomMaterials`
   - Select event source: **Time-driven**
   - Select type of time based trigger: **Day timer**
   - Select time of day: Choose your preferred times
4. Click **"Save"**.

---

## Step 8: Integration with NotebookLM

Since NotebookLM doesn't have an official API, you can use this semi-automated workflow:

1. Access [NotebookLM](https://notebooklm.google.com) with your personal account (`YOUR_EMAIL@example.com`).
2. Create a notebook for each subject.
3. Select **"Add source" → "Google Drive"**.
4. Select files from the subject folders inside your shared "📚 Classroom Materials" folder.
5. You will receive an email notification when new materials are added, so you can update sources similarly.

---

## 📁 Generated Folder Structure

```
Google Drive (Organization Account)
└── 📚 Classroom Materials/
    ├── Linear Algebra/
    │   ├── Lecture_Slides_1.pdf
    │   ├── Exercise_1.pdf
    │   └── ...
    ├── Basic Programming/
    │   ├── Material_1.pdf
    │   └── ...
    └── English Communication/
        └── ...
```

---

## ❓ Troubleshooting

| Issue | Solution |
|------|--------|
| Cannot find "Google Classroom API" | Ask your university IT admin for API permission. |
| Authorization error | Log into script.google.com again with your organization account. |
| Courses are not displayed | Ensure you have active courses in Classroom. |
| Files are not copied | Check `TARGET_MIME_TYPES` in `Config.gs`. |
| Execution time exceeded limit | Reduce the value of `MAX_COURSES_PER_RUN`. |

---

## 🔧 Maintenance

- **Log Check**: Open the "📋 Classroom Sync Log" spreadsheet in Google Drive.
- **Execution History**: Check the "Execution History" tab in the spreadsheet.
- **Trigger Management**: Check/edit via "Triggers" on script.google.com.
