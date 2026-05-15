/**
 * ============================================================
 * Config.gs — 設定管理モジュール
 * ============================================================
 * Google Classroom 講義資料 自動仕分けシステム
 * 
 * このファイルには全ての設定が集約されています。
 * 科目名のマッピングやフィルタリングルールをここで管理します。
 * ============================================================
 */

/**
 * グローバル設定
 * ユーザーはこのセクションのみ編集してください
 */
const CONFIG = {
  // ===== 基本設定 =====
  
  /** Google Drive上のルートフォルダ名 */
  ROOT_FOLDER_NAME: 'Classroom講義資料',
  
  /** 処理済みファイルを記録するスプレッドシート名 */
  LOG_SPREADSHEET_NAME: 'Classroom同期ログ',
  
  /** 個人アカウントのメールアドレス（共有先）
   *  セキュリティ: 初回実行時に initPersonalEmail() で設定されます
   *  変更する場合は setPersonalEmail('new@example.com') を実行してください
   */
  PERSONAL_EMAIL_DEFAULT: 'YOUR_EMAIL@example.com',
  
  // ===== 通知設定 =====
  
  /** 新しい資料が見つかったときにメール通知するか */
  NOTIFY_ON_NEW: true,
  
  /** 期限通知設定 */
  NOTIFY_DEADLINE: true,
  /** 通知する日数（7日前、3日前、1日前、当日） */
  DEADLINE_DAYS_TO_NOTIFY: [7, 3, 1, 0],
  
  /** 通知メールの送信先（大学メール） */
  NOTIFICATION_EMAIL: Session.getActiveUser().getEmail(),
  
  // ===== フィルタリング設定 =====
  
  /** 対象とするファイルタイプ（MIMEタイプ） - 空配列の場合は全て対象 */
  TARGET_MIME_TYPES: [
    'application/pdf',
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.presentation',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
  ],
  
  /** 除外するコース名のキーワード（部分一致） */
  EXCLUDED_COURSE_KEYWORDS: [
    // 例: 'テスト', 'アーカイブ'
  ],
  
  // ===== 共有設定 =====
  // セキュリティ: addViewer() で指定アカウントのみに共有（リンク共有は使用しない）
  
  // ===== 高度な設定 =====
  
  /** 1回の実行で処理するコース数の上限（実行時間制限対策） */
  MAX_COURSES_PER_RUN: 50,
  
  /** 1コースあたりの最大取得資料数 */
  MAX_MATERIALS_PER_COURSE: 100,
  
  /** デバッグモード（詳細ログ出力） */
  DEBUG: false,
};

/**
 * 科目名マッピング
 * Google Classroomのコース名 → Drive上のフォルダ名
 * 
 * キー: Classroomコース名に含まれるキーワード（部分一致）
 * 値: Google Drive上で使用するフォルダ名
 * 
 * マッピングに一致しない場合は、Classroomのコース名がそのまま使用されます
 * 
 * 例:
 * COURSE_NAME_MAP = {
 *   '線形代数': '数学/線形代数学',
 *   '微分積分': '数学/微分積分学',
 *   'プログラミング基礎': '情報/プログラミング基礎',
 *   '英語コミュニケーション': '語学/英語',
 *   '物理学実験': '理科/物理学実験',
 * };
 */
const COURSE_NAME_MAP = {
  // ここに受講科目のマッピングを追加してください
  // 追加しなくてもClassroomのコース名がそのまま使われます
};

/**
 * コース名をフォルダ名に変換する
 * @param {string} courseName - Classroomのコース名
 * @returns {string} フォルダ名
 */
function mapCourseName(courseName) {
  // マッピングテーブルから検索（部分一致）
  for (const [keyword, folderName] of Object.entries(COURSE_NAME_MAP)) {
    if (courseName.includes(keyword)) {
      return folderName;
    }
  }
  
  // マッピングに一致しない場合、コース名をそのまま使用
  // フォルダ名に使えない文字を除去
  return courseName.replace(/[\\\/\:\*\?\"\<\>\|]/g, '_').trim();
}

/**
 * コースが除外対象かどうかを判定する
 * @param {string} courseName - Classroomのコース名
 * @returns {boolean} 除外する場合はtrue
 */
function isExcludedCourse(courseName) {
  return CONFIG.EXCLUDED_COURSE_KEYWORDS.some(keyword => 
    courseName.includes(keyword)
  );
}

/**
 * ファイルが対象MIMEタイプかどうかを判定する
 * @param {string} mimeType - ファイルのMIMEタイプ
 * @returns {boolean} 対象の場合はtrue
 */
function isTargetMimeType(mimeType) {
  if (CONFIG.TARGET_MIME_TYPES.length === 0) {
    return true; // 空の場合は全て対象
  }
  return CONFIG.TARGET_MIME_TYPES.includes(mimeType);
}

// ============================================================
// セキュリティ: メールアドレスの安全管理
// ============================================================

/**
 * 個人アカウントのメールアドレスを取得する
 * PropertiesServiceに保存されていればそちらを使用し、
 * なければCONFIG.PERSONAL_EMAIL_DEFAULTを使用して保存する
 * @returns {string} メールアドレス
 */
function getPersonalEmail() {
  var props = PropertiesService.getScriptProperties();
  var email = props.getProperty('PERSONAL_EMAIL');
  
  if (email && email !== 'YOUR_EMAIL@example.com' && email.includes('@')) {
    return email;
  }
  
  // デフォルト値がプレースホルダー、または未設定の場合
  var defaultEmail = CONFIG.PERSONAL_EMAIL_DEFAULT;
  if (!defaultEmail || defaultEmail === 'YOUR_EMAIL@example.com') {
    logWarning('個人メールアドレスが未設定（またはデフォルトプレースホルダー）です。自動共有はスキップされます。');
    logWarning('解決方法: GASエディタ上で `setPersonalEmail("your_real_email@gmail.com")` を実行してください。');
    return null;
  }
  
  props.setProperty('PERSONAL_EMAIL', defaultEmail);
  logInfo('デフォルトの個人メールアドレスをPropertiesに保存しました: ' + defaultEmail);
  return defaultEmail;
}

/**
 * 個人アカウントのメールアドレスを変更する
 * GASエディタで setPersonalEmail('new@example.com') を実行
 * @param {string} email - 新しいメールアドレス
 */
function setPersonalEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email === 'YOUR_EMAIL@example.com') {
    logError('無効なメールアドレス形式、またはプレースホルダーです: ' + email);
    return;
  }
  PropertiesService.getScriptProperties().setProperty('PERSONAL_EMAIL', email);
  logInfo('個人メールアドレスを安全に更新しました: ' + email);
}
