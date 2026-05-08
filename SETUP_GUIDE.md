# 🚀 Google Classroom Material Auto-Sync System — Setup Guide

This script runs entirely on **Google Apps Script (GAS)** and does not depend on your PC being turned on or connected to the internet.
It executes fully automatically on Google's servers.

👉 [日本語のセットアップガイドはこちら (Japanese Setup Guide)](#japanese-setup-guide)

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

## Step 4: Configure Personal Email Address (Security Best Practice)

To protect your personal email address from being exposed in public code, this system retrieves it from the Google Apps Script **Script Properties (PropertiesService)**. 

### ⚙️ How to safely set your email address:
1. In the GAS editor, open `Code.gs` and temporarily paste the following helper function at the bottom:
   ```javascript
   function runOnceToSetEmail() {
     setPersonalEmail("your_personal_email@gmail.com"); // ← Enter your real email address here
   }
   ```
2. Select **`runOnceToSetEmail`** from the dropdown menu at the top of the editor and click the **"Run"** button ▶.
3. Once the execution completes and you see the log `Personal email address updated: ...`, **delete** the temporary `runOnceToSetEmail` function from your code.

### ⚙️ Other Settings (Optional)
Open `Config.gs` and edit the following as needed:

```javascript
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

```text
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

---

<a id="japanese-setup-guide"></a>
# 🚀 Google Classroom 講義資料 自動仕分けシステム — セットアップガイド (日本語)

このスクリプトは **Google Apps Script** 上で動作し、PCの電源やネット環境に一切依存しません。  
Googleのサーバー上で完全自動実行されます。

👉 [English Version](#google-classroom-material-auto-sync-system-setup-guide)

---

## 📋 必要なもの

- 大学アカウント（`your_university_email@example.com`）でGoogleにログイン済みのブラウザ
- 初回セットアップ時のみ、約10分の作業時間

---

## Step 1: Google Apps Script プロジェクトを作成

1. **大学アカウント**（`your_university_email@example.com`）でGoogleにログイン
2. ブラウザで [script.google.com](https://script.google.com) にアクセス
3. 左上の **「新しいプロジェクト」** をクリック
4. プロジェクト名（左上の「無題のプロジェクト」）を **「Classroom資料自動整理」** に変更

---

## Step 2: Google Classroom API を有効化

1. 左サイドバーの **「サービス」** の横にある **「+」** をクリック
2. リストから **「Google Classroom API」** を探して選択
3. **「追加」** をクリック

> ⚠️ もし「Google Classroom API」が表示されない場合、大学のGoogle Workspace管理者がAPIの利用を制限している可能性があります。その場合はIT部門に問い合わせてください。

---

## Step 3: スクリプトファイルを作成・貼り付け

GASエディタにはデフォルトで `コード.gs` というファイルがあります。  
以下の手順で5つのファイルを作成してください。

### 3-1. `Code.gs`（メインスクリプト）
1. デフォルトの `コード.gs` のファイル名を **`Code`** に変更（ファイル名の右の「⋮」→「名前を変更」）
2. 中身を全て削除して、`Code.gs` ファイルの内容を貼り付け

### 3-2. 残りのファイルを追加
左サイドバーの「ファイル」横の **「+」→「スクリプト」** で以下を作成：

| ファイル名 | 説明 |
|-----------|------|
| `Config` | 設定管理（`Config.gs` の内容を貼り付け） |
| `ClassroomFetcher` | Classroom API操作 |
| `DriveManager` | Google Drive操作 |
| `Logger` | ログ管理 |
| `Notifier` | メール通知 |

> 💡 GASでは `.gs` 拡張子は自動で付与されるため、ファイル名だけ入力してください。

---

## Step 4: 設定をカスタマイズ

`Config.gs` を開いて、必要に応じて編集、および個人アカウントの設定を行います。

### 📧 個人メールアドレスの設定（必須）
本システムでは大学アカウントから個人アカウントへ資料フォルダを自動共有します。
セキュリティ上、公開リポジトリのソースコード内に直接実アドレスを記述するのを避け、**PropertiesService**（GASの内蔵キーバリューストア）を利用して安全に保存します。

1. `Config.gs` 内の `PERSONAL_EMAIL_DEFAULT` は `'YOUR_EMAIL@example.com'`（デフォルトのプレースホルダー）のままにしておきます。
2. 安全にメールアドレスを設定するために、一時的に以下の設定用関数を `Config.gs` の末尾に貼り付けます：
   ```javascript
   function runOnceToSetEmail() {
     setPersonalEmail("your_personal_email@gmail.com"); // ← あなたの実アドレスを記入
   }
   ```
3. エディタ上部のドロップダウンで **`runOnceToSetEmail`** を選択し、**「実行」** ボタン ▶ をクリックします（認証を求められた場合は許可します）。
4. 設定完了のログ（`個人メールアドレスを安全に更新しました: ...`）が出たら、貼り付けた `runOnceToSetEmail` 関数はコードから**削除**してください。

### ⚙️ その他の設定（任意）
`Config.gs` を開いて、必要に応じて以下を編集します：

```javascript
// 新しい資料が見つかったときにメール通知するか
NOTIFY_ON_NEW: true,
```

### 🗺️ 科目名マッピング（任意）
Classroomのコース名をわかりやすいフォルダ名に変換したい場合：

```javascript
const COURSE_NAME_MAP = {
  '線形代数': '数学/線形代数学',
  '英語': '語学/英語',
};
```

---

## Step 5: 初回実行と認証

1. エディタ上部のドロップダウンで **`listAllCourses`** を選択
2. **「実行」ボタン** ▶ をクリック
3. **認証ダイアログ**が表示されます：
   - 「権限を確認」をクリック
   - 大学アカウントを選択
   - 「詳細を表示」→「Classroom資料自動整理（安全ではないページ）に移動」
   - 「許可」をクリック
4. 下部の **実行ログ** にコース一覧が表示されることを確認

> 💡 「安全ではないページ」という警告は、自作スクリプトではGoogleの審査を受けていないためです。自分のスクリプトなので問題ありません。

---

## Step 6: テスト実行

1. ドロップダウンで **`testSyncFirstCourse`** を選択して実行
2. 最初のコースの資料一覧がログに表示されることを確認
3. 問題なければ **`syncClassroomMaterials`** を実行して全コースを同期

---

## Step 7: 自動トリガーを設定

### 方法A: スクリプトから自動設定（推奨）
1. ドロップダウンで **`setupTriggers`** を選択して実行
2. 毎日 8:00 と 20:00 に自動実行されるトリガーが作成されます

### 方法B: 手動でトリガー設定
1. 左サイドバーの **「トリガー」**（⏰アイコン）をクリック
2. 右下の **「+ トリガーを追加」** をクリック
3. 以下を設定：
   - 実行する関数: `syncClassroomMaterials`
   - イベントソース: **時間主導型**
   - タイプ: **日付ベースのタイマー**
   - 時刻: 好みの時間帯を選択
4. **「保存」** をクリック

---

## Step 8: NotebookLM との連携

NotebookLMには公式APIがないため、以下の半自動ワークフローで連携します。

1. 個人アカウント（`your_personal_email@gmail.com`）で [NotebookLM](https://notebooklm.google.com) にアクセス
2. 科目ごとにノートブックを作成
3. **「ソースを追加」→「Google Drive」** を選択
4. 共有された「📚 Classroom講義資料」フォルダ内の科目フォルダからファイルを選択
5. 新しい資料が追加されたときはメール通知が届くので、同じ手順でソースを更新

---

## 📁 作成されるフォルダ構造

```text
Google Drive（大学アカウント）
└── 📚 Classroom講義資料/
    ├── 線形代数学/
    │   ├── 第1回_講義スライド.pdf
    │   ├── 演習問題1.pdf
    │   └── ...
    ├── プログラミング基礎/
    │   ├── 第1回_資料.pdf
    │   └── ...
    └── 英語コミュニケーション/
        └── ...
```

---

## ❓ トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| 「Google Classroom API」が見つからない | 大学のIT管理者にAPIの利用許可を依頼 |
| 認証エラーが発生する | script.google.com に大学アカウントでログインし直す |
| コースが表示されない | Classroomでアクティブなコースがあるか確認 |
| ファイルがコピーされない | `Config.gs`の`TARGET_MIME_TYPES`を確認 |
| 実行時間超過エラー | `MAX_COURSES_PER_RUN`の値を小さくする |

---

## 🔧 メンテナンス

- **ログ確認**: Google Driveで「📋 Classroom同期ログ」スプレッドシートを開く
- **実行履歴**: スプレッドシートの「実行履歴」シートを確認
- **トリガー管理**: script.google.com →「トリガー」で確認・変更
