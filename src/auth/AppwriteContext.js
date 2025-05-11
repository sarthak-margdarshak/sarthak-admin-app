import PropTypes from "prop-types";
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Account, Client, Databases, Functions, ID, Storage } from "appwrite";
import { APPWRITE_API } from "../config-global";
import MaintenancePage from "../pages/MaintenancePage";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { labels } from "../assets/data";

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo("en-US");

// CLIENT INITIALIZATION ------------------------------------------------
export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteFunctions = new Functions(appwriteClient);

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  updatePhoto: () => {},
};

const reducer = (state, action) => {
  return {
    ...state,
    ...action.payload,
  };
};

export const AuthContext = createContext(initialState);

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [underMaintenance, setUnderMaintenance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metadataContent = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.metadata,
          APPWRITE_API.documents.metadataContentDoc
        );
        setUnderMaintenance(metadataContent?.maintenance);
        if (!metadataContent?.maintenance) {
          const user = await appwriteAccount.get();
          if (user.prefs?.photo) {
            user.prefs.photo = appwriteStorage.getFileView(
              APPWRITE_API.buckets.sarthakDatalakeBucket,
              user.prefs?.photo
            );
          }
          dispatch({
            payload: {
              isInitialized: true,
              isAuthenticated: true,
              user: user,
            },
          });
        } else {
          dispatch({
            payload: {
              isInitialized: true,
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (error) {
        dispatch({
          payload: {
            isInitialized: true,
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    fetchData();
  }, [setUnderMaintenance]);

  const login = useCallback(async (email, password) => {
    try {
      await appwriteAccount.createEmailPasswordSession(email, password);
      const user = await appwriteAccount.get();
      if (
        user.labels.findIndex(
          (label) =>
            label === labels.founder ||
            label === labels.author ||
            label === labels.admin
        ) === -1
      ) {
        // Student
        await appwriteAccount.deleteSessions();
        dispatch({
          payload: {
            isInitialized: true,
            isAuthenticated: false,
            user: null,
          },
        });
        return {
          success: false,
          message:
            "Unauthorised login attempt. Please contact administrator on support@sarthakmargdarshak.in",
        };
      } else {
        if (user.prefs?.photo) {
          user.prefs.photo = appwriteStorage.getFileView(
            APPWRITE_API.buckets.sarthakDatalakeBucket,
            user.prefs?.photo
          );
        }
        dispatch({
          payload: {
            isInitialized: true,
            isAuthenticated: true,
            user: user,
          },
        });
        return { success: true, message: "" };
      }
    } catch (err) {
      dispatch({
        payload: {
          isInitialized: true,
          isAuthenticated: false,
          user: null,
        },
      });
      console.error(err);
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    window.localStorage.clear();
    await appwriteAccount.deleteSessions();
    dispatch({
      payload: {
        isAuthenticated: false,
        user: null,
      },
    });
  }, []);

  const updatePhoto = useCallback(async (file) => {
    try {
      const tempPrefs = await appwriteAccount.getPrefs();
      if (tempPrefs?.photo) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          tempPrefs?.photo
        );
      }
      const response = await appwriteStorage.createFile(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        ID.unique(),
        file
      );
      await appwriteAccount.updatePrefs({
        ...tempPrefs,
        photo: response.$id,
      });

      const user = await appwriteAccount.get();
      user.prefs.photo = appwriteStorage.getFileView(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        user.prefs?.photo
      );

      dispatch({
        payload: {
          user: user,
        },
      });

      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      login,
      logout,
      updatePhoto,
    }),
    [
      state.isInitialized,
      state.isAuthenticated,
      state.user,
      login,
      logout,
      updatePhoto,
    ]
  );

  if (underMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
