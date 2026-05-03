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

function getLogSpreadsheet() {
  if (_logSpreadsheet) return _logSpreadsheet;
  const files = DriveApp.getFilesByName(CONFIG.LOG_SPREADSHEET_NAME);
  if (files.hasNext()) {
    _logSpreadsheet = SpreadsheetApp.open(files.next());
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

// === コンソールログヘルパー ===
function logDebug(msg) { if (CONFIG.DEBUG) console.log('[DEBUG] ' + msg); }
function logInfo(msg) { console.log('[INFO] ' + msg); }
function logWarning(msg) { console.warn('[WARN] ' + msg); }
function logError(msg) { console.error('[ERROR] ' + msg); }