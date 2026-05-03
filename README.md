# 🔄 Sync From Google Classroom to Google Drive

Google Classroom 上に投稿される講義資料（PDF、スライド、ドキュメント等）を自動で検知し、指定した Google Drive のフォルダへ科目ごとに自動で整理・保存する Google Apps Script (GAS) ツールです。

## ✨ 特徴 (Features)

- **完全自動化**: PCを立ち上げていなくても、Googleのサーバー上で毎日自動で実行されます。
- **科目ごとの自動振り分け**: クラスルームのコース名に基づいて、Drive内に自動でフォルダを作成し整理します。
- **新着資料の通知**: 新しい講義資料が追加された際に、指定のメールアドレスへ通知を送ることができます。
- **NotebookLMとの相性抜群**: 保存先のフォルダを NotebookLM のソースとして指定することで、簡単に講義ごとのAIノートブックを作成できます。

## 🚀 使い方・セットアップ (Getting Started)

導入は非常に簡単です。GASの知識がなくても、10分程度でセットアップが完了します。
詳しい導入手順については、以下のセットアップガイドをご参照ください。

👉 **[セットアップガイド (SETUP_GUIDE.md) を読む](./SETUP_GUIDE.md)**

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
