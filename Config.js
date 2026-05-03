/**
 * ============================================================
 * Config.gs — Configuration Module
 * ============================================================
 * Google Classroom Material Auto-Sync System
 * 
 * All settings are centralized in this file.
 * Manage course name mappings and filtering rules here.
 * ============================================================
 */

/**
 * Global Settings
 * Users should only edit this section.
 */
const CONFIG = {
  // ===== Basic Settings =====
  
  /** Root folder name on Google Drive */
  ROOT_FOLDER_NAME: 'Classroom_Materials',
  
  /** Spreadsheet name to record processed files */
  LOG_SPREADSHEET_NAME: 'Classroom_Sync_Log',
  
  /** Personal email address (for sharing)
   *  Security: Set by initPersonalEmail() on first run
   *  To change, execute setPersonalEmail('new@example.com')
   */
  PERSONAL_EMAIL_DEFAULT: 'YOUR_EMAIL@example.com',
  
  // ===== Notification Settings =====
  
  /** Whether to send email notification when new materials are found */
  NOTIFY_ON_NEW: true,
  
  /** Destination for notification emails (University email) */
  NOTIFICATION_EMAIL: Session.getActiveUser().getEmail(),
  
  // ===== Filtering Settings =====
  
  /** Target file types (MIME types) - Empty array means all types */
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
  
  /** Keywords of course names to exclude (partial match) */
  EXCLUDED_COURSE_KEYWORDS: [
    // e.g., 'Test', 'Archive'
  ],
  
  // ===== Sharing Settings =====
  // Security: Only shared with specified account via addViewer() (no link sharing)
  
  // ===== Advanced Settings =====
  
  /** Maximum number of courses to process per run (Execution time limit countermeasure) */
  MAX_COURSES_PER_RUN: 50,
  
  /** Maximum number of materials to fetch per course */
  MAX_MATERIALS_PER_COURSE: 100,
  
  /** Debug mode (Detailed log output) */
  DEBUG: false,
};

/**
 * Course Name Mapping
 * Google Classroom course name → Folder name on Drive
 * 
 * Key: Keyword contained in Classroom course name (partial match)
 * Value: Folder name to use on Google Drive
 * 
 * If no match, the Classroom course name is used as is.
 * 
 * Example:
 * COURSE_NAME_MAP = {
 *   'Linear Algebra': 'Math/Linear Algebra',
 *   'Calculus': 'Math/Calculus',
 *   'Programming Basics': 'CS/Programming Basics',
 *   'English Communication': 'Languages/English',
 *   'Physics Lab': 'Science/Physics Lab',
 * };
 */
const COURSE_NAME_MAP = {
  // Add your course mappings here
  // If not added, the Classroom course name will be used directly
};

/**
 * Convert course name to folder name
 * @param {string} courseName - Classroom course name
 * @returns {string} Folder name
 */
function mapCourseName(courseName) {
  for (const [keyword, folderName] of Object.entries(COURSE_NAME_MAP)) {
    if (courseName.includes(keyword)) {
      return folderName;
    }
  }
  
  // Remove characters that cannot be used in folder names
  return courseName.replace(/[\\\/\:\*\?\"\<\>\|]/g, '_').trim();
}

/**
 * Determine if a course should be excluded
 * @param {string} courseName - Classroom course name
 * @returns {boolean} true if excluded
 */
function isExcludedCourse(courseName) {
  return CONFIG.EXCLUDED_COURSE_KEYWORDS.some(keyword => 
    courseName.includes(keyword)
  );
}

/**
 * Determine if a file is a target MIME type
 * @param {string} mimeType - File MIME type
 * @returns {boolean} true if targeted
 */
function isTargetMimeType(mimeType) {
  if (CONFIG.TARGET_MIME_TYPES.length === 0) {
    return true; // All targeted if empty
  }
  return CONFIG.TARGET_MIME_TYPES.includes(mimeType);
}

// ============================================================
// Security: Email address safe management
// ============================================================

/**
 * Get personal email address
 * Use PropertiesService if saved, else use CONFIG.PERSONAL_EMAIL_DEFAULT
 * @returns {string} Email address
 */
function getPersonalEmail() {
  var props = PropertiesService.getScriptProperties();
  var email = props.getProperty('PERSONAL_EMAIL');
  
  if (email) {
    return email;
  }
  
  email = CONFIG.PERSONAL_EMAIL_DEFAULT;
  props.setProperty('PERSONAL_EMAIL', email);
  logInfo('Personal email address set: ' + email);
  return email;
}

/**
 * Change personal email address
 * Execute setPersonalEmail('new@example.com') in GAS editor
 * @param {string} email - New email address
 */
function setPersonalEmail(email) {
  if (!email || !email.includes('@')) {
    logError('Invalid email address: ' + email);
    return;
  }
  PropertiesService.getScriptProperties().setProperty('PERSONAL_EMAIL', email);
  logInfo('Personal email address updated: ' + email);
}
