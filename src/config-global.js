import { PATH_DASHBOARD } from "./routes/paths";

export const APPWRITE_API = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  projectId: process.env.REACT_APP_APPWRITE_PROJECT_ID,
  databaseId: "sarthak_core_db",
  collections: {
    metadata: "metadata",
    bookIndex: "book_index",
    questions: "questions",
    mockTest: "mock_test",
    products: "products",
    translatedQuestions: "translated_questions",
  },
  documents: {
    metadataContentDoc: "content_doc",
  },
  buckets: {
    sarthakDatalakeBucket: "sarthak_datalake_bucket",
  },
  functions: {
    sarthakAPI: "sarthak-api",
  },
};

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'

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
