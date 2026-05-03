/**
 * ============================================================
 * Code.gs — メイン処理スクリプト
 * ============================================================
 * Google Classroom 講義資料 自動仕分けシステム
 * 
 * 5分間隔のトリガーで自動実行されます（平日 9:00〜18:15 のみ）。
 * 手動実行する場合は syncClassroomMaterials() を実行してください。
 * ============================================================
 */

/**
 * 現在が授業時間帯（平日 9:00〜18:15）かどうかを判定する
 * @returns {boolean} 授業時間帯であればtrue
 */
function isClassHours() {
  const now = new Date();
  const day = now.getDay(); // 0=日, 6=土
  if (day === 0 || day === 6) return false; // 土日は除外

  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // 9:00 (540分) 〜 18:15 (1095分)
  return timeInMinutes >= 540 && timeInMinutes <= 1095;
}

/**
 * メイン同期関数
 * 5分間隔トリガーで実行される（授業時間帯のみ処理）
 */
function syncClassroomMaterials() {
  // 授業時間帯チェック（手動実行時はスキップ可能）
  if (!isClassHours()) {
    // 授業時間外は何もせず終了（ログも最小限にしてAPI消費を抑える）
    return;
  }

  logInfo('===== Classroom資料同期を開始します =====');

  const stats = { courses: 0, newCount: 0, skipCount: 0, errorCount: 0 };
  const newFiles = [];

  try {
    // 1. Classroom APIでコース一覧を先に取得（Drive操作より前に実行）
    const courses = getActiveCourses();
    stats.courses = courses.length;
    logInfo(courses.length + ' 件のアクティブコースを処理します');

    // 2. 各コースの添付ファイル情報を先に全取得
    const courseData = [];
    for (const course of courses) {
      logInfo('--- コース: ' + course.name + ' ---');
      const attachments = getAllCourseAttachments(course.id);
      courseData.push({ course: course, attachments: attachments });
    }

    // 3. Drive操作（フォルダ作成・ファイルコピー）
    const rootFolder = getOrCreateRootFolder();

    for (const data of courseData) {
      const course = data.course;
      const attachments = data.attachments;
      const courseFolder = getOrCreateCourseFolder(rootFolder, course.name);

      for (const att of attachments) {
        try {
          if (att.type === 'driveFile') {
            // 重複チェック
            if (isFileProcessed(att.fileId)) {
              stats.skipCount++;
              logDebug(`スキップ（処理済み）: ${att.title}`);
              continue;
            }

            // ファイルをコピー
            const copied = copyFileToDrive(att.fileId, courseFolder, att.title);
            if (copied) {
              recordProcessedFile(att.fileId, att.title, course.name, 'driveFile', courseFolder.getName(), '成功');
              newFiles.push({ courseName: course.name, fileName: att.title });
              stats.newCount++;
            } else {
              stats.skipCount++;
            }

          } else if (att.type === 'link') {
            if (isLinkProcessed(att.url)) {
              stats.skipCount++;
              continue;
            }
            const saved = saveLinkAsFile(att.url, att.title, courseFolder, att.parentTitle);
            if (saved) {
              recordProcessedFile(att.url, att.title, course.name, 'link', courseFolder.getName(), '成功');
              newFiles.push({ courseName: course.name, fileName: att.title });
              stats.newCount++;
            }
          }
        } catch (err) {
          stats.errorCount++;
          logError(`処理エラー: ${att.title} - ${err.message}`);
          recordProcessedFile(att.fileId || att.url, att.title, course.name, att.type, '', 'エラー');
        }
      }
    }

    // 4. 実行履歴を記録
    recordRunHistory(stats.courses, stats.newCount, stats.skipCount, stats.errorCount);

    // 5. 通知メール送信
    sendNotification(newFiles, stats);

    logInfo(`===== 同期完了: 新規=${stats.newCount}, スキップ=${stats.skipCount}, エラー=${stats.errorCount} =====`);

  } catch (error) {
    logError('同期処理で致命的エラーが発生しました: ' + error.message);
    logError(error.stack);
  }
}

/**
 * トリガーを自動設定する（初回のみ実行）
 * 5分間隔で実行し、関数内で授業時間帯（平日9:00〜18:15）を判定する
 */
function setupTriggers() {
  // 既存トリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  for (const t of triggers) {
    if (t.getHandlerFunction() === 'syncClassroomMaterials') {
      ScriptApp.deleteTrigger(t);
    }
  }

  // 5分間隔のトリガー（時間帯フィルタは syncClassroomMaterials 内で実施）
  ScriptApp.newTrigger('syncClassroomMaterials')
    .timeBased()
    .everyMinutes(5)
    .create();

  logInfo('トリガーを設定しました: 5分間隔（平日 9:00〜18:15 のみ実行）');
}

/**
 * テスト用関数: 最初のコースだけで動作確認する
 */
function testSyncFirstCourse() {
  logInfo('===== テスト実行開始 =====');

  // Classroom APIを先に呼ぶ（Drive操作より前）
  const courses = getActiveCourses();

  if (courses.length === 0) {
    logInfo('アクティブなコースが見つかりません');
    return;
  }

  const course = courses[0];
  logInfo('テスト対象コース: ' + course.name);

  // Classroom APIで添付ファイルを取得
  const attachments = getAllCourseAttachments(course.id);
  logInfo('添付ファイル数: ' + attachments.length);
  for (const att of attachments) {
    logInfo('  - [' + att.type + '] ' + att.title + ' (元: ' + att.parentTitle + ')');
  }

  // Drive操作は最後に実行
  logInfo('--- Drive操作開始 ---');
  const rootFolder = getOrCreateRootFolder();
  const courseFolder = getOrCreateCourseFolder(rootFolder, course.name);
  logInfo('フォルダ作成成功: ' + courseFolder.getName());

  logInfo('===== テスト完了 =====');
}

/**
 * コース一覧を確認する（セットアップ時に使用）
 */
function listAllCourses() {
  const courses = getActiveCourses();
  logInfo(`=== アクティブコース一覧（${courses.length}件）===`);
  for (const c of courses) {
    logInfo(`  ID: ${c.id} | 名前: ${c.name} | セクション: ${c.section}`);
  }
}
