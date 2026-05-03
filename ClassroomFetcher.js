/**
 * ============================================================
 * ClassroomFetcher.gs — Google Classroom API 操作モジュール
 * ============================================================
 * Classroom APIを使用してコース情報と資料を取得する機能を提供します。
 * ============================================================
 */

/**
 * アクティブなコース一覧を取得する
 * @returns {Array<Object>} コースオブジェクトの配列
 */
function getActiveCourses() {
  const courses = [];
  let pageToken = null;
  
  try {
    do {
      // courseStates を文字列として渡す（GAS互換）
      const params = {
        courseStates: 'ACTIVE',
        pageSize: 30,
      };
      
      if (pageToken) {
        params.pageToken = pageToken;
      }
      
      const response = Classroom.Courses.list(params);
      
      if (response.courses) {
        for (const course of response.courses) {
          if (!isExcludedCourse(course.name)) {
            courses.push({
              id: course.id,
              name: course.name,
              section: course.section || '',
              description: course.descriptionHeading || '',
            });
          }
        }
      }
      
      pageToken = response.nextPageToken;
      
    } while (pageToken && courses.length < CONFIG.MAX_COURSES_PER_RUN);
    
  } catch (error) {
    logError('コース一覧の取得に失敗しました: ' + error.message);
    
    // ACTIVEフィルタで失敗した場合、フィルタなしで再試行
    logInfo('フィルタなしで再試行します...');
    try {
      const fallback = Classroom.Courses.list({ pageSize: 30 });
      if (fallback.courses) {
        for (const course of fallback.courses) {
          if (!isExcludedCourse(course.name)) {
            courses.push({
              id: course.id,
              name: course.name,
              section: course.section || '',
              description: course.descriptionHeading || '',
              state: course.courseState || 'UNKNOWN',
            });
          }
        }
        logInfo('フォールバック成功: ' + courses.length + ' 件のコースを取得');
        return courses;
      }
    } catch (fallbackErr) {
      logError('フォールバックも失敗: ' + fallbackErr.message);
    }
    
    throw error;
  }
  
  logInfo(courses.length + ' 件のアクティブコースを取得しました');
  return courses;
}

/**
 * 診断関数: Classroom API の接続状態を確認する
 * GASエディタで「diagnoseClassroomAPI」を選択して実行してください
 */
function diagnoseClassroomAPI() {
  console.log('=== Classroom API 診断開始 ===');
  console.log('実行アカウント: ' + Session.getActiveUser().getEmail());
  console.log('');
  
  // テスト1: フィルタなしでコース取得
  console.log('--- テスト1: フィルタなしでコース一覧取得 ---');
  try {
    var response1 = Classroom.Courses.list({ pageSize: 5 });
    console.log('レスポンス: ' + JSON.stringify(response1).substring(0, 500));
    if (response1.courses) {
      console.log('成功: ' + response1.courses.length + ' 件のコースが見つかりました');
      for (var i = 0; i < response1.courses.length; i++) {
        var c = response1.courses[i];
        console.log('  [' + c.courseState + '] ' + c.name + ' (ID: ' + c.id + ')');
      }
    } else {
      console.log('コースが0件です。Google Classroomにコースが登録されているか確認してください。');
    }
  } catch (err1) {
    console.log('エラー: ' + err1.message);
  }
  
  // テスト2: ACTIVEフィルタ
  console.log('');
  console.log('--- テスト2: ACTIVEフィルタでコース一覧取得 ---');
  try {
    var response2 = Classroom.Courses.list({ courseStates: 'ACTIVE', pageSize: 5 });
    console.log('レスポンス: ' + JSON.stringify(response2).substring(0, 500));
    if (response2.courses) {
      console.log('成功: ' + response2.courses.length + ' 件');
    } else {
      console.log('ACTIVEコースが0件です。');
    }
  } catch (err2) {
    console.log('エラー: ' + err2.message);
  }
  
  // テスト3: DriveApp 動作確認
  console.log('');
  console.log('--- テスト3: Google Drive 接続確認 ---');
  try {
    var rootFolder = DriveApp.getRootFolder();
    console.log('成功: ルートフォルダ = ' + rootFolder.getName());
  } catch (err3) {
    console.log('エラー: ' + err3.message);
  }
  
  console.log('');
  console.log('=== 診断完了 ===');
}

/**
 * 指定コースの授業資料（CourseWorkMaterials）を取得する
 * @param {string} courseId - コースID
 * @returns {Array<Object>} 資料の添付ファイル情報の配列
 */
function getCourseMaterials(courseId) {
  const attachments = [];
  let pageToken = null;
  
  try {
    do {
      const params = {
        pageSize: 20,
      };
      
      if (pageToken) {
        params.pageToken = pageToken;
      }
      
      const response = Classroom.Courses.CourseWorkMaterials.list(courseId, params);
      
      if (response.courseWorkMaterial) {
        for (const material of response.courseWorkMaterial) {
          const extracted = extractAttachments(material, 'material');
          attachments.push(...extracted);
        }
      }
      
      pageToken = response.nextPageToken;
      
    } while (pageToken && attachments.length < CONFIG.MAX_MATERIALS_PER_COURSE);
    
  } catch (error) {
    // CourseWorkMaterials APIが利用できない場合（権限不足等）はスキップ
    if (error.message && error.message.includes('not found')) {
      logDebug(`コース ${courseId} にはCourseWorkMaterialsがありません`);
    } else {
      logWarning(`コース ${courseId} の資料取得でエラー: ${error.message}`);
    }
  }
  
  return attachments;
}

/**
 * 指定コースの課題（CourseWork）に添付されたファイルを取得する
 * @param {string} courseId - コースID
 * @returns {Array<Object>} 課題の添付ファイル情報の配列
 */
function getCourseWorkAttachments(courseId) {
  const attachments = [];
  let pageToken = null;
  
  try {
    do {
      const params = {
        pageSize: 20,
      };
      
      if (pageToken) {
        params.pageToken = pageToken;
      }
      
      const response = Classroom.Courses.CourseWork.list(courseId, params);
      
      if (response.courseWork) {
        for (const work of response.courseWork) {
          const extracted = extractAttachments(work, 'coursework');
          attachments.push(...extracted);
        }
      }
      
      pageToken = response.nextPageToken;
      
    } while (pageToken && attachments.length < CONFIG.MAX_MATERIALS_PER_COURSE);
    
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      logDebug(`コース ${courseId} にはCourseWorkがありません`);
    } else {
      logWarning(`コース ${courseId} の課題取得でエラー: ${error.message}`);
    }
  }
  
  return attachments;
}

/**
 * 資料/課題オブジェクトから添付ファイル情報を抽出する
 * @param {Object} item - 資料または課題オブジェクト
 * @param {string} type - 'material' または 'coursework'
 * @returns {Array<Object>} 添付ファイル情報の配列
 */
function extractAttachments(item, type) {
  const attachments = [];
  const materials = item.materials || [];
  
  for (const material of materials) {
    if (material.driveFile) {
      const driveFile = material.driveFile.driveFile;
      attachments.push({
        type: 'driveFile',
        sourceType: type,
        fileId: driveFile.id,
        title: driveFile.title || '無題',
        alternateLink: driveFile.alternateLink || '',
        parentTitle: item.title || '無題の' + (type === 'material' ? '資料' : '課題'),
        creationTime: item.creationTime || '',
        updateTime: item.updateTime || '',
      });
    }
    
    if (material.link) {
      attachments.push({
        type: 'link',
        sourceType: type,
        url: material.link.url,
        title: material.link.title || material.link.url,
        parentTitle: item.title || '無題の' + (type === 'material' ? '資料' : '課題'),
        creationTime: item.creationTime || '',
        updateTime: item.updateTime || '',
      });
    }
    
    // YouTube動画やFormsは必要に応じて追加可能
  }
  
  return attachments;
}

/**
 * 指定コースの全添付ファイルを取得する（資料 + 課題）
 * @param {string} courseId - コースID
 * @returns {Array<Object>} 全添付ファイル情報の配列
 */
function getAllCourseAttachments(courseId) {
  const materials = getCourseMaterials(courseId);
  const courseWork = getCourseWorkAttachments(courseId);
  
  const all = [...materials, ...courseWork];
  logDebug(`コース ${courseId}: 合計 ${all.length} 件の添付ファイル（資料: ${materials.length}, 課題: ${courseWork.length}）`);
  
  return all;
}