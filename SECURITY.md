# Security Policy (SECURITY.md)

Guidelines for maintaining the security and health of this repository.

👉 [日本語のセキュリティポリシーはこちら (Japanese Security Policy)](#japanese-security-policy)

## Supported Versions

We currently only provide security updates and support for the following versions:

| Version | Support Status |
| :--- | :--- |
| v1.0.x | 🟢 Supported (Latest) |
| < v1.0.0 | ❌ No longer supported |

## Reporting a Vulnerability

If you discover any security issues or vulnerabilities in this tool, please do not open a public thread (such as GitHub Issues). Instead, report them privately and securely through the following channels:

- **Discord Server**: [Official Contact Server (Invite Link)](https://discord.gg/nzPcNfTAU)
- **Discord Direct Message (DM)**: Send a friend request and message directly to the developer (Username: `ta_23___7__`)
- When reporting, it would be highly appreciated if you could provide details such as the steps to reproduce the issue and the estimated impact/scope.
- Upon receiving your report, we will promptly review the details and initiate the correction/response process.

---

## 🔒 Development & Operational Security Guidelines

To ensure the safety of your repository and deployed systems, operators (developers) should strictly adhere to the following settings and best practices.

### 1. GitHub Branch Protection Rules

To prevent unexpected pushes from breaking production code or exposing sensitive security details, we highly recommend enabling the following protection rules for the `main` branch.

#### Configuration Steps:
1. Open your GitHub repository and click the **"Settings"** tab.
2. Click **"Branches"** in the left menu.
3. Click **"Add branch protection rule"** (or edit the existing rule for the `main` branch).
4. Enter `main` in the **Branch name pattern** field.
5. Check the following items:
   - **Require a pull request before merging**:
     - Forces developers to push code to a `feature` branch first, review differences via a Pull Request, and then merge.
     - Optionally, enable **Require approvals** (1 or more reviewers).
   - **Require status checks to pass before merging**: Useful if you have automated tests or build checks (CI).
   - **Do not allow bypassing the above settings**: Prevents administrators from performing forced pushes or other bypass operations.
6. Click **"Create"** (or **"Save changes"**).

### 2. Handling Sensitive Credentials

To securely handle Google Apps Script authentication tokens and project-specific configuration data, ensure that the following files are NEVER included in Git tracking:

- **`.clasp.json`**:
  - Contains your Google Apps Script `scriptId`. This is added to `.gitignore` and removed from tracking.
- **`.clasprc.json`**:
  - Contains highly sensitive authentication tokens used by clasp CLI to access your Google account. This is added to `.gitignore` and must NEVER be published publicly.
- **Personal Email Address**:
  - Private information such as your destination email (`PERSONAL_EMAIL`) should not be hardcoded in the code. Instead, save and retrieve it dynamically using GAS **`PropertiesService`** (refer to `SETUP_GUIDE.md` for details).

---

<a id="japanese-security-policy"></a>
# セキュリティポリシー (SECURITY.md)

このリポジトリのセキュリティ状況を健全に保つためのガイドラインです。

👉 [English Version](#security-policy-securitymd)

## サポートされているバージョン

現在、以下のバージョンのみに対してセキュリティアップデートやサポートを提供しています。

| バージョン | サポート状況 |
| :--- | :--- |
| v1.0.x | 🟢 サポート対象 (最新) |
| < v1.0.0 | ❌ サポート終了 |

## 脆弱性の報告方法

本ツールに関するセキュリティ上の問題や脆弱性を発見した場合は、GitHub Issuesなどの一般公開されたスレッドではなく、以下の方法で個別かつ安全にご報告ください。

- **Discord サーバー**: [連絡用サーバー (招待リンク)](https://discord.gg/nzPcNfTAU)
- **Discord 個別DM**: 開発者宛に直接フレンド申請およびDMでご連絡ください（ユーザー名: `ta_23___7__`）
- 報告時には、発見した問題の再現手順や影響度（影響範囲）についての詳細を記載していただけますと幸いです。
- ご連絡を受信後、内容を迅速に確認し、修正・対応プロセスを開始します。

---

## 🔒 開発・運用セキュリティガイドライン

リポジトリおよび公開システムの安全性を確保するため、運用者（開発者）は以下の設定・ベストプラクティスを遵守してください。

### 1. GitHub のブランチ保護ルール (Branch Protection Rules)

予期しないプッシュによる本番コードの破損や、誤ったセキュリティ情報の混入を防ぐため、`main` ブランチに対して以下の保護ルールを有効にすることを強く推奨します。

#### 設定手順:
1. 対象の GitHub リポジトリを開き、**「Settings」** タブをクリックします。
2. 左メニューの **「Branches」** をクリックします。
3. **「Add branch protection rule」**（または `main` ブランチに対する既存ルールの編集）をクリックします。
4. **Branch name pattern** に `main` と入力します。
5. 以下の項目にチェックを入れます：
   - **Require a pull request before merging (マージ前にプルリクエストを必須にする)**:
     - 開発コードを一度 `feature` ブランチ等にプッシュし、PR を通じて変更差分を確認した上でマージするようにします。
     - 必要に応じて **Require approvals (レビュー承認 of 必須化)**（1人以上）を有効にします。
   - **Require status checks to pass before merging**: テストやビルドチェックなどのCIを導入している場合に有効です。
   - **Do not allow bypassing the above settings**: 管理者であっても強制プッシュなどの例外的な操作を行えないように制限します。
6. **「Create」**（または **「Save changes」**）をクリックします。

### 2. 秘密情報（クレデンシャル）の取り扱い

Google Apps Script の認証トークンやプロジェクト固有の設定情報を安全に扱うため、以下のファイルが絶対に Git 管理下に含まれないことを確認してください。

- **`.clasp.json`**:
  - Google Apps Script の `scriptId` を含みます。`.gitignore` に追記されており、追跡対象から外されています。
- **`.clasprc.json`**:
  - clasp CLI が利用する Google アカウントへの認証トークンを含む、極めて機密性の高いファイルです。すでに `.gitignore` に含まれていますが、絶対にパブリックに公開しないでください。
- **個人メールアドレス**:
  - 共有先アドレス（`PERSONAL_EMAIL`）などのプライベートな情報はコードにハードコードせず、GASの **`PropertiesService`** に動的保存して利用してください（詳細は `SETUP_GUIDE.md` を参照）。
