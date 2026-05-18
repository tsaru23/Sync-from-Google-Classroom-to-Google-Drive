/**
 * ============================================================
 * Notifier.gs — 通知モジュール
 * ============================================================
 * 新しい資料が検出・処理されたときにメール通知を送信します。
 * ============================================================
 */

/**
 * 同期結果の通知メールを送信する
 * @param {Array<Object>} newFiles - 新規処理されたファイルの情報
 * @param {Object} stats - 統計情報 {courses, newCount, skipCount, errorCount}
 */
function sendNotification(newFiles, stats) {
  if (!CONFIG.NOTIFY_ON_NEW || newFiles.length === 0) return;

  const subject = `📚 Classroom資料同期: ${newFiles.length}件の新規資料を整理しました`;

  // コースごとにファイルをグループ化
  const grouped = {};
  for (const f of newFiles) {
    if (!grouped[f.courseName]) grouped[f.courseName] = [];
    grouped[f.courseName].push(f);
  }

  let body = '=== Google Classroom 講義資料 同期レポート ===\n\n';
  body += `実行日時: ${new Date().toLocaleString('ja-JP')}\n`;
  body += `処理コース数: ${stats.courses}\n`;
  body += `新規ファイル: ${stats.newCount}件\n`;
  body += `スキップ: ${stats.skipCount}件\n`;
  body += `エラー: ${stats.errorCount}件\n\n`;
  body += '--- 新規追加ファイル ---\n\n';

  for (const [course, files] of Object.entries(grouped)) {
    body += `【${course}】\n`;
    for (const f of files) {
      body += `  📄 ${f.fileName}\n`;
    }
    body += '\n';
  }

  body += '---\n';
  body += `Google Drive: https://drive.google.com\n`;
  body += `NotebookLM: https://notebooklm.google.com\n`;
  body += '\n💡 NotebookLMで新しいソースを追加するには:\n';
  body += '1. NotebookLMを開く\n';
  body += '2. 対象のノートブックを選択\n';
  body += '3.「ソースを追加」→「Google Drive」→ 共有フォルダから選択\n';

  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
    });
    logInfo('通知メールを送信しました');
  } catch (error) {
    logError('通知メール送信エラー: ' + error.message);
  }
}

/**
 * 期限間近の課題を通知する
 * @param {Array<Object>} assignments - 通知対象の課題リスト
 */
function sendDeadlineNotification(assignments) {
  if (assignments.length === 0) return;

  const subject = `⚠️ 期限間近！未提出の課題があります（${assignments.length}件）`;

  let body = '=== Google Classroom 課題期限通知 ===\n\n';
  body += `以下の課題の提出期限が近づいています。確認してください。\n\n`;

  // 残り日数ごとにソート
  assignments.sort((a, b) => a.daysRemaining - b.daysRemaining);

  for (const a of assignments) {
    const dayLabel = a.daysRemaining === 0 ? '【当日】' : `【${a.daysRemaining}日前】`;
    body += `${dayLabel} ${a.courseName}\n`;
    body += `  📌 ${a.title}\n`;
    body += `  📅 期限: ${a.dueDate}\n`;
    body += `  🔗 Classroom: ${a.alternateLink}\n\n`;
  }

  body += '---\n';
  body += `Google Classroom: https://classroom.google.com\n`;

  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
    });
    logInfo(`${assignments.length}件の期限通知メールを送信しました`);
  } catch (error) {
    logError('期限通知メール送信エラー: ' + error.message);
  }
}