/**
 * ============================================================
 * DriveManager.gs — Google Drive 操作モジュール
 * ============================================================
 * フォルダの作成、ファイルのコピー、共有設定を管理します。
 * ============================================================
 */

/**
 * ルートフォルダを取得または作成する
 * @returns {Folder} ルートフォルダオブジェクト
 */
function getOrCreateRootFolder() {
  try {
    const rootFolders = DriveApp.getFoldersByName(CONFIG.ROOT_FOLDER_NAME);
    
    if (rootFolders.hasNext()) {
      const folder = rootFolders.next();
      logDebug('ルートフォルダ発見: ' + folder.getName() + ' (ID: ' + folder.getId() + ')');
      return folder;
    }
    
    // 新規作成
    logInfo('ルートフォルダを作成中: ' + CONFIG.ROOT_FOLDER_NAME);
    const newFolder = DriveApp.createFolder(CONFIG.ROOT_FOLDER_NAME);
    logInfo('ルートフォルダを作成しました: ' + newFolder.getName() + ' (ID: ' + newFolder.getId() + ')');
    
    // 個人アカウントに共有（エラーでも続行）
    try {
      shareWithPersonalAccount(newFolder);
    } catch (shareErr) {
      logWarning('共有設定をスキップしました: ' + shareErr.message);
    }
    
    return newFolder;
    
  } catch (error) {
    logError('ルートフォルダの作成に失敗: ' + error.message);
    logError('対処法: Google Drive に手動で「' + CONFIG.ROOT_FOLDER_NAME + '」フォルダを作成してください');
    throw error;
  }
}

/**
 * 科目別のサブフォルダを取得または作成する
 * @param {Folder} parentFolder - 親フォルダ
 * @param {string} courseName - コース名
 * @returns {Folder} 科目フォルダオブジェクト
 */
function getOrCreateCourseFolder(parentFolder, courseName) {
  const folderName = mapCourseName(courseName);
  
  // サブフォルダ構造に対応（例: '数学/線形代数学'）
  const parts = folderName.split('/');
  let currentFolder = parentFolder;
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;
    
    const subFolders = currentFolder.getFoldersByName(trimmedPart);
    
    if (subFolders.hasNext()) {
      currentFolder = subFolders.next();
    } else {
      currentFolder = currentFolder.createFolder(trimmedPart);
      logInfo(`科目フォルダを作成しました: ${trimmedPart}`);
      
      // 新しいフォルダも個人アカウントに共有
      shareWithPersonalAccount(currentFolder);
    }
  }
  
  return currentFolder;
}

/**
 * Google Driveのファイルを指定フォルダにコピーする
 * @param {string} fileId - コピー元ファイルのID
 * @param {Folder} destinationFolder - コピー先フォルダ
 * @param {string} fileName - ファイル名
 * @returns {File|null} コピーされたファイル、失敗時はnull
 */
function copyFileToDrive(fileId, destinationFolder, fileName) {
  try {
    const sourceFile = DriveApp.getFileById(fileId);
    
    // MIMEタイプフィルタリング
    const mimeType = sourceFile.getMimeType();
    if (!isTargetMimeType(mimeType)) {
      logDebug(`スキップ（対象外のMIMEタイプ）: ${fileName} (${mimeType})`);
      return null;
    }
    
    // ファイルをコピー
    const copiedFile = sourceFile.makeCopy(fileName, destinationFolder);
    
    logInfo(`ファイルをコピーしました: ${fileName} → ${destinationFolder.getName()}`);
    return copiedFile;
    
  } catch (error) {
    logError(`ファイルのコピーに失敗しました: ${fileName} (ID: ${fileId}) - ${error.message}`);
    return null;
  }
}

/**
 * リンク情報をテキストファイルとして保存する
 * @param {string} url - リンクURL
 * @param {string} title - リンクタイトル
 * @param {Folder} destinationFolder - 保存先フォルダ
 * @param {string} parentTitle - 親資料/課題のタイトル
 * @returns {File|null} 作成されたファイル
 */
function saveLinkAsFile(url, title, destinationFolder, parentTitle) {
  try {
    const content = [
      `リンク: ${title}`,
      `URL: ${url}`,
      `元の資料/課題: ${parentTitle}`,
      `保存日時: ${new Date().toLocaleString('ja-JP')}`,
    ].join('\n');
    
    const fileName = '[Link] ' + title.substring(0, 50) + '.txt';
    const file = destinationFolder.createFile(fileName, content, 'text/plain');
    
    logInfo(`リンクを保存しました: ${fileName}`);
    return file;
    
  } catch (error) {
    logError(`リンクの保存に失敗しました: ${title} - ${error.message}`);
    return null;
  }
}

/**
 * フォルダを個人アカウントに共有する
 * セキュリティ: addViewer()で指定アカウントのみに閲覧権限を付与
 * リンク共有（ANYONE_WITH_LINK）は使用しない
 * @param {Folder} folder - 共有するフォルダ
 */
function shareWithPersonalAccount(folder) {
  try {
    var personalEmail = getPersonalEmail();
    
    // 既に共有されているかチェック
    var viewers = folder.getViewers();
    for (var i = 0; i < viewers.length; i++) {
      if (viewers[i].getEmail() === personalEmail) {
        logDebug('既に共有済み: ' + folder.getName());
        return;
      }
    }
    
    // 閲覧者として共有（指定アカウントのみ、通知メールなし）
    folder.addViewer(personalEmail);
    logInfo('フォルダを共有しました: ' + folder.getName() + ' → ' + personalEmail);
    
  } catch (error) {
    logWarning('フォルダの共有に失敗しました: ' + folder.getName() + ' - ' + error.message);
  }
}

/**
 * フォルダ内のファイル一覧を取得する（デバッグ用）
 * @param {Folder} folder - 対象フォルダ
 * @returns {Array<string>} ファイル名の配列
 */
function listFilesInFolder(folder) {
  const fileNames = [];
  const files = folder.getFiles();
  
  while (files.hasNext()) {
    fileNames.push(files.next().getName());
  }
  
  return fileNames;
}
