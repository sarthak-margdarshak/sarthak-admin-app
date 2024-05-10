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
import PropTypes from 'prop-types';
// react
import { createContext, useEffect, useReducer, useCallback, useMemo, useState } from 'react';
// appwrite
import { Account, Client, Databases, ID, Permission, Role, Storage, Teams } from "appwrite";
import { APPWRITE_API } from '../config-global';
import MaintenancePage from '../pages/MaintenancePage';

// CLIENT INITIALIZATION ------------------------------------------------
export const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  profileImage: null,
  userProfile: null,
  login: async (email, password) => {},
  logout: () => {},
};

const reducer = (state, action) => {
  // AUTH REDUCER
  if (action.type === 'INITIAL') {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    };
  }
  if (action.type === 'UPDATE_USER_PROFILE') {
    return {
      ...state,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    }
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
  const [underMaintenance, setUnderMaintenance] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const sarthak = await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.sarthakInfoData,
        APPWRITE_API.documents.sarthak
      );
      setUnderMaintenance(sarthak?.maintenance)
      try {
        account.get().then(async function (response) {
          const adminUser = response;
          const adminUserProfile = await databases.getDocument(APPWRITE_API.databaseId, APPWRITE_API.collections.adminUsers, adminUser.$id, [])
          var profileImage = null;
          if (adminUserProfile.photoUrl) {
            profileImage = (storage.getFilePreview(APPWRITE_API.buckets.adminUserImage, adminUserProfile.photoUrl, undefined, undefined, undefined, 20)).href
          }
          dispatch({
            type: 'INITIAL',
            payload: {
              isInitialized: true,
              isAuthenticated: true,
              user: adminUser,
              profileImage: profileImage,
              userProfile: adminUserProfile,
            },
          });
        }, async function (error) {
          dispatch({
            type: 'INITIAL',
            payload: {
              isInitialized: true,
              isAuthenticated: false,
              user: null,
              profileImage: null,
              userProfile: null,
            },
          });
        });
      } catch (error) {
        console.log(error)
        dispatch({
          type: 'INITIAL',
          payload: {
            isInitialized: false,
            isAuthenticated: false,
            user: null,
            profileImage: null,
            userProfile: null,
          },
        });
      }
    }
    fetchData();
  }, [setUnderMaintenance]);

  const login = useCallback(async (email, password) => {
    try {
      await account.createEmailSession(email, password);
      const adminUser = await account.get();
      const currTeams = (await teams.list()).teams;
      const adminTeams = currTeams.filter((val, i) => val.$id === APPWRITE_API.teams.admin)
      if (adminTeams.length !== 1) {
        account.deleteSessions();
        return { success: false, message: "Unauthorised login attempt." }
      }
      const adminUserProfile = await databases.getDocument(APPWRITE_API.databaseId, APPWRITE_API.collections.adminUsers, adminUser.$id, [])
      var profileImage = null;
      if (adminUserProfile.photoUrl) {
        profileImage = (storage.getFilePreview(APPWRITE_API.buckets.adminUserImage, adminUserProfile.photoUrl, undefined, undefined, undefined, 20)).href
      }
      dispatch({
        type: 'LOGIN',
        payload: {
          isInitialized: true,
          isAuthenticated: true,
          user: adminUser,
          profileImage: profileImage,
          userProfile: adminUserProfile,
        },
      });
      return { success: true, message: "" }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }, []);

  const logout = useCallback(async () => {
    await account.deleteSessions();
    dispatch({
      type: 'LOGOUT',
      payload: {
        isAuthenticated: false,
        user: null,
        profileImage: null,
        userProfile: null,
      }
    });
  }, []);

  const updateUserProfile = useCallback(async (data, photoFile=null) => {
    var data = data;
    if (photoFile) {
      if (state.userProfile.photoUrl) {
        await storage.deleteFile(
          APPWRITE_API.buckets.adminUserImage,
          state.userProfile.photoUrl,
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
      data = {...data, photoUrl: response.$id}
    }

    const adminUserProfile = await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.adminUsers,
      state.user.$id,
      { ...data },
    );

    var profileImage = null;
    if (adminUserProfile.photoUrl) {
      profileImage = (storage.getFilePreview(APPWRITE_API.buckets.adminUserImage, adminUserProfile.photoUrl, undefined, undefined, undefined, 20)).href
    }

    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        profileImage: profileImage,
        userProfile: adminUserProfile,
      },
    });

  }, [state])

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      profileImage: state.profileImage,
      userProfile: state.userProfile,
      underMaintenance: state.underMaintenance,
      // auth functions
      login,
      logout,
      //update functions
      updateUserProfile,
    }),
    [state.isInitialized, state.isAuthenticated, state.user, state.profileImage, state.userProfile, state.underMaintenance, login, logout, updateUserProfile]
  );

  if (underMaintenance) {
    return <MaintenancePage />
  }

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
