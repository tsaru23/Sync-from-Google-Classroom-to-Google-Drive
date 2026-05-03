# 🔄 Sync From Google Classroom to Google Drive

A Google Apps Script (GAS) tool that automatically detects lecture materials (PDFs, slides, documents, etc.) posted on Google Classroom and organizes them into specified folders in Google Drive by course.

[日本語のREADMEはこちら (Japanese README)](./README_ja.md)

## ✨ Features

- **Fully Automated**: Runs automatically every day on Google's servers without needing your PC to be on.
- **Auto-Sorting by Course**: Automatically creates folders and organizes files in Drive based on Classroom course names.
- **New Material Notifications**: Sends an email notification to a specified address when new materials are added.
- **Great with NotebookLM**: Perfect for creating AI notebooks per course by specifying the destination folders as sources in NotebookLM.

## 🚀 Getting Started

Installation is very simple. Even if you have no experience with GAS, setup takes only about 10 minutes.
Please refer to the setup guide for detailed installation instructions:

👉 **[Read the Setup Guide (SETUP_GUIDE.md)](./SETUP_GUIDE.md)**

## 📁 Generated Folder Structure

When executed, the following folder structure is automatically generated in your Google Drive:

```text
Google Drive
└── 📚 Classroom Materials/
    ├── Linear Algebra/
    │   ├── Lecture_Slides_1.pdf
    │   └── Exercise_1.pdf
    ├── Basic Programming/
    │   └── Material_1.pdf
    └── English Communication/
        └── ...
```

## 🛠️ Tech Stack

- **Language**: JavaScript
- **Platform**: Google Apps Script (GAS)
- **API**: Google Classroom API, Google Drive API

## 📝 Customization

You can customize the following by editing `Config.js`:
- Exclude specific courses
- Specify file formats (MIME types) to save
- Map course names to custom folder names

## 🤝 Contributing

Bug reports and pull requests for new features are welcome!
