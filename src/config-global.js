/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 * 
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 * 
 */

// IMPORT ---------------------------------------------------------------

// routes
import { PATH_DASHBOARD } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const APPWRITE_API = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  projectId: process.env.REACT_APP_APPWRITE_PROJECT_ID,
  databaseId: process.env.REACT_APP_APPWRITE_DATABASE,
  databases: {
    // User Databases
    usersProfile: process.env.REACT_APP_APPWRITE_DATABASE_USERS_PROFILE,
    usersGeneral: process.env.REACT_APP_APPWRITE_DATABASE_USERS_GENERAL,
    usersSocialLinks: process.env.REACT_APP_APPWRITE_DATABASE_USERS_SOCIALLINKS,
    usersPermissions: process.env.REACT_APP_APPWRITE_DATABASE_USERS_PERMISSIONS,
    // Team Databases
    teams: process.env.REACT_APP_APPWRITE_DATABASE_TEAMS,
    teamMembership: process.env.REACT_APP_APPWRITE_DATABASE_TEAM_MEMBERSHIP,
    // Question Databases
    questions: process.env.REACT_APP_APPWRITE_DATABASE_QUESTIONS,
    standards: process.env.REACT_APP_APPWRITE_DATABASE_STANDARDS,
    subjects: process.env.REACT_APP_APPWRITE_DATABASE_SUBJECTS,
    chapters: process.env.REACT_APP_APPWRITE_DATABASE_CHAPTERS,
    concepts: process.env.REACT_APP_APPWRITE_DATABASE_CONCEPTS,
    // Sarthak Infodata
    sarthakInfoData: process.env.REACT_APP_APPWRITE_DATABASE_SARTHAK_INFO_DATA,
    sarthakInfoDataCollection: process.env.REACT_APP_APPWRITE_DATABASE_SARTHAK_INFO_DATA_COLLECTION,
    // MockTest
    mockTests: process.env.REACT_APP_APPWRITE_DATABASE_MOCKTEST,
    mockTestDriver: process.env.REACT_APP_APPWRITE_DATABASE_MOCKTESTDRIVER,
    mockTestPriceTag: process.env.REACT_APP_APPWRITE_DATABASE_MOCKTESTPRICETAG,
  },
  buckets: {
    userImage: process.env.REACT_APP_APPWRITE_BUCKET_USERIMAGE,
    teamCover: process.env.REACT_APP_APPWRITE_BUCKET_TEAMCOVER,
    questionFiles: process.env.REACT_APP_APPWRITE_BUCKET_QUESTIONFILES,
  },
  functions: {
    onboardWelcome: process.env.REACT_APP_APPWRITE_FUCTION_ONBOARD_WELCOME,
    teamInvite: process.env.REACT_APP_APPWRITE_FUCTION_TEAM_INVITE,
    contactInstitute: process.env.REACT_APP_APPWRITE_FUCTION_CONTACT_INSTITUTE,
    createQuestion: process.env.REACT_APP_APPWRITE_FUCTION_CREATE_QUESTION,
    acceptInvite: process.env.REACT_APP_APPWRITE_FUCTION_ACCEPT_INVITE,
    updateMockTests: process.env.REACT_APP_APPWRITE_FUCTION_CREATE_MOCK_TEST,
  },
  team: {
    admin: process.env.REACT_APP_APPWRITE_TEAM_ADMIN,
    student: process.env.REACT_APP_APPWRITE_TEAM_STUDENT,
  },
  ceoId: process.env.REACT_APP_APPWRITE_CEO_ID,
};

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
