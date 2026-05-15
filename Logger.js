/**
 * ============================================================
 * Logger.gs — ログ管理モジュール
 * ============================================================
 * 処理済みファイルの記録とログ出力を管理します。
 * ============================================================
 */

let _logSpreadsheet = null;
let _processedSheet = null;
let _historySheet = null;
let _notificationSheet = null;

function getLogSpreadsheet() {
  if (_logSpreadsheet) return _logSpreadsheet;
  const files = DriveApp.getFilesByName(CONFIG.LOG_SPREADSHEET_NAME);
  if (files.hasNext()) {
    _logSpreadsheet = SpreadsheetApp.open(files.next());
    // 必要に応じて新しいシートを初期化
    if (!_logSpreadsheet.getSheetByName('通知履歴')) {
      initializeNotificationSheet(_logSpreadsheet);
    }
  } else {
    _logSpreadsheet = SpreadsheetApp.create(CONFIG.LOG_SPREADSHEET_NAME);
    initializeLogSheets(_logSpreadsheet);
  }
  return _logSpreadsheet;
}

function initializeLogSheets(ss) {
  let sheet = ss.getActiveSheet();
  sheet.setName('処理済みファイル');
  sheet.getRange('A1:G1').setValues([[
    'ファイルID', 'ファイル名', 'コース名', 'タイプ', 'コピー先', '処理日時', 'ステータス'
  ]]);
  sheet.getRange('A1:G1').setFontWeight('bold').setBackground('#4285f4').setFontColor('#fff');
  sheet.setFrozenRows(1);

  let h = ss.insertSheet('実行履歴');
  h.getRange('A1:E1').setValues([[
    '実行日時', '処理コース数', '新規ファイル数', 'スキップ数', 'エラー数'
  ]]);
  h.getRange('A1:E1').setFontWeight('bold').setBackground('#34a853').setFontColor('#fff');
  h.setFrozenRows(1);

  initializeNotificationSheet(ss);
}

function initializeNotificationSheet(ss) {
  let n = ss.insertSheet('通知履歴');
  n.getRange('A1:E1').setValues([[
    '課題ID', '課題名', '通知タイミング', '通知日時', 'コース名'
  ]]);
  n.getRange('A1:E1').setFontWeight('bold').setBackground('#f4b400').setFontColor('#fff');
  n.setFrozenRows(1);
}

function getProcessedSheet() {
  if (_processedSheet) return _processedSheet;
  _processedSheet = getLogSpreadsheet().getSheetByName('処理済みファイル');
  return _processedSheet;
}

function getHistorySheet() {
  if (_historySheet) return _historySheet;
  _historySheet = getLogSpreadsheet().getSheetByName('実行履歴');
  return _historySheet;
}

function getNotificationSheet() {
  if (_notificationSheet) return _notificationSheet;
  _notificationSheet = getLogSpreadsheet().getSheetByName('通知履歴');
  return _notificationSheet;
}

function isFileProcessed(fileId) {
  const data = getProcessedSheet().getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === fileId) return true;
  }
  return false;
}

function isLinkProcessed(url) {
  return isFileProcessed(url);
}

/**
 * 期限通知が送信済みかどうかを確認する
 * @param {string} courseWorkId - 課題ID
 * @param {number} milestone - 通知タイミング（3, 1, 0など）
 * @returns {boolean} 送信済みの場合はtrue
 */
function isNotificationSent(courseWorkId, milestone) {
  const data = getNotificationSheet().getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // 課題IDとタイミングの両方が一致する場合のみ送信済みとする
    if (data[i][0] === courseWorkId && parseInt(data[i][2]) === milestone) {
      return true;
    }
  }
  return false;
}

function recordProcessedFile(id, fileName, courseName, type, folderName, status) {
  getProcessedSheet().appendRow([
    id, fileName, courseName, type, folderName,
    new Date().toLocaleString('ja-JP'), status,
  ]);
}

function recordRunHistory(courseCount, newCount, skipCount, errorCount) {
  getHistorySheet().appendRow([
    new Date().toLocaleString('ja-JP'), courseCount, newCount, skipCount, errorCount,
  ]);
}

/**
 * 通知送信を記録する
 * @param {Object} assignment - 課題情報
 * @param {number} milestone - 通知タイミング
 */
function recordNotificationSent(assignment, milestone) {
  getNotificationSheet().appendRow([
    assignment.id, assignment.title, milestone,
    new Date().toLocaleString('ja-JP'), assignment.courseName
  ]);
}

// === コンソールログヘルパー ===
function logDebug(msg) { if (CONFIG.DEBUG) console.log('[DEBUG] ' + sanitizeErrorMessage(msg)); }
function logInfo(msg) { console.log('[INFO] ' + sanitizeErrorMessage(msg)); }
function logWarning(msg) { console.warn('[WARN] ' + sanitizeErrorMessage(msg)); }
function logError(msg) { console.error('[ERROR] ' + sanitizeErrorMessage(msg)); }

/**
 * ログ・エラーメッセージ内の機密情報（メールアドレス、トークン、認証情報等）を安全にマスクする
 * @param {string|Error} error - エラーオブジェクトまたはメッセージ文字列
 * @returns {string} サニタイズされた文字列
 */
function sanitizeErrorMessage(error) {
  if (!error) return '不明なエラー';
  
  var msg = typeof error === 'object' ? (error.message || error.toString()) : String(error);
  
  // 1. メールアドレスのマスク化 (例: test@gmail.com -> ***@***.***)
  var emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  msg = msg.replace(emailRegex, '***@***.***');
  
  // 2. Google API トークン・シークレット等のマスク化（ya29で始まるOAuthトークンなど）
  var tokenRegex = /\b(ya29\.[a-zA-Z0-9_\-]+)\b/gi;
  msg = msg.replace(tokenRegex, '[OAUTH_TOKEN]');
  
  // 3. APIキー、パスワード、スクリプトID、フォルダID風のパラメータのマスク化
  var keyParamRegex = /(key|secret|token|password|credential|scriptId|folderId)=([a-zA-Z0-9_\-\.\~]+)/gi;
  msg = msg.replace(keyParamRegex, '$1=[REDACTED]');
  
  return msg;
}