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
import PropTypes from "prop-types";
// react
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
} from "react";
// appwrite
import {
  Account,
  Client,
  Databases,
  Functions,
  ID,
  Permission,
  Role,
  Storage,
  Teams,
} from "appwrite";
import { APPWRITE_API } from "../config-global";
import MaintenancePage from "../pages/MaintenancePage";

// CLIENT INITIALIZATION ------------------------------------------------
export const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export const teams = new Teams(client);
export const appwriteFunctions = new Functions(client);

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  profileImage: null,
  userProfile: null,
  sarthakInfoData: null,
  login: async () => {},
  logout: () => {},
  updateUserProfile: () => {},
};

const reducer = (state, action) => {
  // AUTH REDUCER
  if (action.type === "INITIAL") {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      sarthakInfoData: action.payload.sarthakInfoData,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  if (action.type === "LOGIN") {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      sarthakInfoData: action.payload.sarthakInfoData,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  if (action.type === "UPDATE_USER_PROFILE") {
    return {
      ...state,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(initialState);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [underMaintenance, setUnderMaintenance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sarthak = await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.sarthakInfoData,
          APPWRITE_API.documents.sarthak
        );
        setUnderMaintenance(sarthak?.maintenance);
        appwriteAccount.get().then(
          async function (response) {
            const adminUser = response;
            var adminUserProfile = null;
            try {
              adminUserProfile = await databases.getDocument(
                APPWRITE_API.databaseId,
                APPWRITE_API.collections.adminUsers,
                adminUser.$id
              );
            } catch (error) {}
            var profileImage = null;
            if (adminUserProfile?.photoUrl) {
              profileImage = storage.getFilePreview(
                APPWRITE_API.buckets.adminUserImage,
                adminUserProfile?.photoUrl,
                undefined,
                undefined,
                undefined,
                20
              ).href;
            }
            dispatch({
              type: "INITIAL",
              payload: {
                isInitialized: true,
                isAuthenticated: true,
                sarthakInfoData: sarthak,
                user: adminUser,
                profileImage: profileImage,
                userProfile: adminUserProfile,
              },
            });
          },
          async function () {
            dispatch({
              type: "INITIAL",
              payload: {
                isInitialized: true,
                isAuthenticated: false,
                sarthakInfoData: sarthak,
                user: null,
                profileImage: null,
                userProfile: null,
              },
            });
          }
        );
      } catch (error) {
        console.log(error.message);
        dispatch({
          type: "INITIAL",
          payload: {
            isInitialized: true,
            isAuthenticated: false,
            sarthakInfoData: null,
            user: null,
            profileImage: null,
            userProfile: null,
          },
        });
      }
    };
    fetchData();
  }, [setUnderMaintenance]);

  const login = useCallback(
    async (email, password) => {
      const sarthak = await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.sarthakInfoData,
        APPWRITE_API.documents.sarthak
      );
      try {
        await appwriteAccount.createEmailSession(email, password);
        const adminUser = await appwriteAccount.get();
        const currTeams = (await teams.list()).teams;
        const adminTeams = currTeams.filter(
          (val) =>
            val.$id === state.sarthakInfoData?.adminTeamId ||
            adminUser?.$id === APPWRITE_API.documents.ceoId
        );
        if (adminTeams.length !== 1) {
          appwriteAccount.deleteSessions();
          return { success: false, message: "Unauthorised login attempt." };
        }
        var adminUserProfile = null;
        try {
          adminUserProfile = await databases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.adminUsers,
            adminUser.$id
          );
        } catch (error) {
          console.log(error);
        }
        var profileImage = null;
        if (adminUserProfile.photoUrl) {
          profileImage = storage.getFilePreview(
            APPWRITE_API.buckets.adminUserImage,
            adminUserProfile.photoUrl,
            undefined,
            undefined,
            undefined,
            20
          ).href;
        }
        dispatch({
          type: "LOGIN",
          payload: {
            isInitialized: true,
            isAuthenticated: true,
            sarthakInfoData: sarthak,
            user: adminUser,
            profileImage: profileImage,
            userProfile: adminUserProfile,
          },
        });
        return { success: true, message: "" };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    [state.sarthakInfoData?.adminTeamId]
  );

  const logout = useCallback(async () => {
    await appwriteAccount.deleteSessions();
    dispatch({
      type: "LOGOUT",
      payload: {
        isAuthenticated: false,
        user: null,
        sarthakInfoData: null,
        profileImage: null,
        userProfile: null,
      },
    });
  }, []);

  const updateUserProfile = useCallback(
    async (data, photoFile = null) => {
      var tempData = data;
      if (photoFile) {
        if (state.userProfile.photoUrl) {
          await storage.deleteFile(
            APPWRITE_API.buckets.adminUserImage,
            state.userProfile.photoUrl
          );
        }

        const response = await storage.createFile(
          APPWRITE_API.buckets.adminUserImage,
          ID.unique(),
          photoFile,
          [
            Permission.update(Role.user(state.user.$id)),
            Permission.read(Role.user(state.user.$id)),
            Permission.delete(Role.user(state.user.$id)),
          ]
        );
        tempData = { ...tempData, photoUrl: response.$id };
      }

      const adminUserProfile = await databases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.adminUsers,
        state.user.$id,
        { ...tempData }
      );

      var profileImage = null;
      if (adminUserProfile.photoUrl) {
        profileImage = storage.getFilePreview(
          APPWRITE_API.buckets.adminUserImage,
          adminUserProfile.photoUrl,
          undefined,
          undefined,
          undefined,
          20
        ).href;
      }

      dispatch({
        type: "UPDATE_USER_PROFILE",
        payload: {
          profileImage: profileImage,
          userProfile: adminUserProfile,
        },
      });
    },
    [state]
  );

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      sarthakInfoData: state.sarthakInfoData,
      profileImage: state.profileImage,
      userProfile: state.userProfile,
      underMaintenance: state.underMaintenance,
      // auth functions
      login,
      logout,
      //update functions
      updateUserProfile,
    }),
    [
      state.isInitialized,
      state.isAuthenticated,
      state.user,
      state.sarthakInfoData,
      state.profileImage,
      state.userProfile,
      state.underMaintenance,
      login,
      logout,
      updateUserProfile,
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
