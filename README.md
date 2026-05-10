# 🔄 Sync From Google Classroom to Google Drive

A Google Apps Script (GAS) tool that automatically detects lecture materials (PDFs, slides, documents, etc.) posted on Google Classroom and organizes them into specified folders in Google Drive by course.

👉 [日本語のREADMEはこちら (Japanese README)](#japanese-readme)

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

---

<a id="japanese-readme"></a>
# 🔄 Sync From Google Classroom to Google Drive (日本語)

Google Classroom 上に投稿される講義資料（PDF、スライド、ドキュメント等）を自動で検知し、指定した Google Drive のフォルダへ科目ごとに自動で整理・保存する Google Apps Script (GAS) ツールです。

👉 [English Version](#sync-from-google-classroom-to-google-drive)

## ✨ 特徴 (Features)

- **完全自動化**: PCを立ち上げていなくても、Googleのサーバー（GAS）上で毎日自動で実行されます。
- **科目ごとの自動振り分け**: クラスルームのコース名に基づいて、Drive内に自動でフォルダを作成し整理します。
- **新着資料の通知**: 新しい講義資料が追加された際に、指定のメールアドレスへ通知を送ることができます。
- **NotebookLMとの相性抜群**: 保存先のフォルダを NotebookLM のソースとして指定することで、簡単に講義ごとのAIノートブックを作成できます。

## 🚀 使い方・セットアップ (Getting Started)

導入は非常に簡単です。GASの知識がなくても、10分程度でセットアップが完了します。
詳しい導入手順については、以下のセットアップガイドをご参照ください。

👉 **[セットアップガイド (SETUP_GUIDE.md) を読む](./SETUP_GUIDE.md#japanese-setup-guide)**

## 📁 作成されるフォルダ構成イメージ

実行すると、Google Drive上に以下のようなフォルダが自動生成されます。

```text
Google Drive
└── 📚 Classroom講義資料/
    ├── 線形代数学/
    │   ├── 第1回_講義スライド.pdf
    │   └── 演習問題1.pdf
    ├── プログラミング基礎/
    │   └── 第1回_資料.pdf
    └── 英語コミュニケーション/
        └── ...
```

## 🛠️ 技術スタック (Tech Stack)

- **言語**: JavaScript
- **プラットフォーム**: Google Apps Script (GAS)
- **API**: Google Classroom API, Google Drive API

## 📝 カスタマイズ (Customization)

`Config.js` を編集することで、以下のカスタマイズが可能です。
- 特定のコースの除外
- 保存するファイル形式（MIMEタイプ）の指定
- コース名からフォルダ名への自由なマッピング

## 🤝 貢献 (Contributing)

バグ報告や機能追加のPull Requestは大歓迎です！
