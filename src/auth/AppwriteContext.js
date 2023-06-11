import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import localStorageAvailable from '../utils/localStorageAvailable';
// appwrite
import { Account, Client, Databases, ID, Permission, Role, Storage } from "appwrite";
import { APPWRITE_API } from '../config-global';

// ----------------------------------------------------------------------

const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// ----------------------------------------------------------------------

// FETCH FUNCTIONS FOR ALL DATA
export async function getUserGeneralData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersGeneral,
    id,
  );
}

export async function getUserPermissionData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersPermissions,
    id,
  );
}

export async function getUserSocialLinksData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersSocialLinks,
    id,
  );
}

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  errorMessage: null,
  user: null,
  profileImage: null,
  userProfile: null,
  userGeneral: null,
  userPermissions: null,
  userSocialLinks: null,
};

const reducer = (state, action) => {
  // AUTH REDUCER
  if (action.type === 'INITIAL') {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      errorMessage: action.payload.errorMessage,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
      userGeneral: action.payload.userGeneral,
      userPermissions: action.payload.userPermissions,
      userSocialLinks: action.payload.userSocialLinks,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      errorMessage: action.payload.errorMessage,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
      userGeneral: action.payload.userGeneral,
      userPermissions: action.payload.userPermissions,
      userSocialLinks: action.payload.userSocialLinks,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      errorMessage: action.payload.errorMessage,
      user: action.payload.user,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
      userGeneral: action.payload.userGeneral,
      userPermissions: action.payload.userPermissions,
      userSocialLinks: action.payload.userSocialLinks,
    };
  }
  if (action.type === 'UPDATE_PASSWORD') {
    return {
      ...state,
      errorMessage: action.payload.errorMessage,
    };
  }
  // UPDATE REDUCER
  if (action.type === 'UPDATE_PROFILE_IMAGE') {
    return {
      ...state,
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      errorMessage: action.payload.errorMessage,
      profileImage: action.payload.profileImage,
      userProfile: action.payload.userProfile,
    }
  }
  if (action.type === 'UPDATE_USER_GENERAL') {
    return {
      ...state,
      userGeneral: action.payload.userGeneral,
    }
  }
  if (action.type === 'UPDATE_USER_SOCIAL_LINKS') {
    return {
      ...state,
      userSocialLinks: action.payload.userSocialLinks,
    }
  }
  // FETCH REDUCER
  if (action.type === 'FETCH_GENERAL_DATA') {
    return {
      ...state,
      userGeneral: action.payload.userGeneral,
    }
  }
  if (action.type === 'FETCH_PERMISSION_DATA') {
    return {
      ...state,
      userPermissions: action.payload.userPermissions,
    }
  }
  if (action.type === 'FETCH_SOCIAL_LINKS_DATA') {
    return {
      ...state,
      userSocialLinks: action.payload.userSocialLinks,
    }
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();



  // ******** BEGINS : FETCH PROFILE DATA FUNCTIONS : INTERNAL USE ********
  // Get User Profile Data
  const getProfileData = async (id) => {
    return await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
      id,
    );
  }

  // Get User Profile Image Link
  const getImageProfileLink = async (id) => {
    return storage.getFileView(APPWRITE_API.buckets.userImage, id);
  }
  // ******** END : FETCH PROFILE DATA FUNCTIONS : INTERNAL USE ********



  // ******** BEGINS : FETCH DATA FUNCTIONS : ON DEMAND ********
  // Fetch User General Data
  const fetchGeneralData = useCallback(async (id) => {
    var userGeneral = state.userGeneral;
    if (!userGeneral) {
      userGeneral = await getUserGeneralData(id)
    }
    dispatch({
      type: 'FETCH_GENERAL_DATA',
      payload: {
        userGeneral: userGeneral,
      },
    });
  }, [state]);

  // Fetch User Permissions Data
  const fetchPermissionData = useCallback(async (id) => {
    var userPermissions = state.userPermissions;
    if (!userPermissions) {
      userPermissions = await getUserPermissionData(id);
    }
    dispatch({
      type: 'FETCH_PERMISSION_DATA',
      payload: {
        userPermissions: userPermissions,
      },
    });
  }, [state]);

  // Fetch User Social Links Data
  const fetchSocialLinksData = useCallback(async (id) => {
    var userSocialLinks = state.userSocialLinks;
    if (!userSocialLinks) {
      userSocialLinks = await getUserSocialLinksData(id);
    }
    dispatch({
      type: 'FETCH_SOCIAL_LINKS_DATA',
      payload: {
        userSocialLinks: userSocialLinks,
      },
    });
  }, [state]);
  // ******** END : FETCH DATA FUNCTIONS : ON DEMAND ********



  // ******** BEGINS : AUTH FUNCTIONS ********
  // INITIAL
  const initialize = useCallback(() => {
    try {
      account.get().then(async function (response) {
        const user = response;
        const userProfile = await getProfileData(user.$id);
        var profileImage = null;
        if (userProfile.photoUrl) {
          profileImage = await getImageProfileLink(userProfile.photoUrl);
        }
        dispatch({
          type: 'INITIAL',
          payload: {
            isInitialized: true,
            isAuthenticated: true,
            errorMessage: null,
            user: user,
            profileImage: profileImage,
            userProfile: userProfile,
          },
        });
      }, async function (error) {
        dispatch({
          type: 'INITIAL',
          payload: {
            isInitialized: true,
            isAuthenticated: false,
            errorMessage: error,
            user: null,
            profileImage: null,
            userProfile: null,
            userGeneral: null,
            userPermissions: null,
            userSocialLinks: null,
          },
        });
      });
    } catch (error) {
      dispatch({
        type: 'INITIAL',
        payload: {
          isInitialized: false,
          isAuthenticated: false,
          errorMessage: error,
          user: null,
          profileImage: null,
          userProfile: null,
          userGeneral: null,
          userPermissions: null,
          userSocialLinks: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    await account.createEmailSession(email, password);
    const user = await account.get();
    const userProfile = await getProfileData(user.$id);
    var profileImage = null;
    if (userProfile.photoUrl) {
      profileImage = await getImageProfileLink(userProfile.photoUrl);
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        isInitialized: true,
        isAuthenticated: true,
        errorMessage: null,
        user: user,
        profileImage: profileImage,
        userProfile: userProfile,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await account.deleteSessions();
    dispatch({
      type: 'LOGOUT',
      payload: {
        isInitialized: true,
        isAuthenticated: false,
        errorMessage: null,
        user: null,
        profileImage: null,
        userProfile: null,
        userGeneral: null,
        userPermissions: null,
        userSocialLinks: null,
      }
    });
  }, []);

  // UPDATE PASSWORD
  const updatePassword = useCallback(async (oldPassword, newPassword) => {
    await account.updatePassword(newPassword, oldPassword);
    dispatch({
      type: 'UPDATE_PASSWORD',
      payload: {}
    });
  }, []);
  // ******** END : AUTH FUNCTIONS ********



  // ******** BEGINS : UPDATE DATA FUNCTIONS ********
  // UPDATE PROFILE IMAGE
  const updateProfileImage = useCallback(async (file) => {
    if (state.profileImage) {
      await storage.deleteFile(
        APPWRITE_API.buckets.userImage,
        state.userProfile.photoUrl,
      );
    }

    const response = await storage.createFile(
      APPWRITE_API.buckets.userImage,
      ID.unique(),
      file,
      [
        Permission.update(Role.user(state.user.$id)),
        Permission.read(Role.user(state.user.$id)),
        Permission.delete(Role.user(state.user.$id)),
        Permission.read(Role.any()),
      ]
    );

    await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
      state.user.$id,
      {
        photoUrl: response.$id
      },
    );

    const userProfile = await getProfileData(state.user.$id);
    const profileImage = await getImageProfileLink(userProfile.photoUrl);
    dispatch({
      type: 'UPDATE_PROFILE_IMAGE',
      payload: {
        isInitialized: true,
        isAuthenticated: true,
        errorMessage: null,
        profileImage: profileImage,
        userProfile: userProfile,
      }
    })
  }, [state])

  // UPDATE USER GENERAL
  const updateUserGeneral = useCallback(async (info) => {
    await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersGeneral,
      state.user.$id,
      {
        address: info.address,
        country: info.country,
        city: info.city,
        state: info.state,
        zipCode: info.zipCode,
        about: info.about,
        schoolCollege: info.schoolCollege,
      },
    );

    const userGeneral = await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersGeneral,
      state.user.$id,
    );

    dispatch({
      type: 'UPDATE_USER_GENERAL',
      payload: {
        userGeneral: userGeneral,
      },
    });

  }, [state])

  // UPDATE USER SOCIAL LINKS
  const updateUserSocialLinks = useCallback(async (info) => {
    await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersSocialLinks,
      state.user.$id,
      {
        facebookId: info.facebookId === '' ? null : info.facebookId,
        instagramId: info.instagramId === '' ? null : info.instagramId,
        linkedinId: info.linkedinId === '' ? null : info.linkedinId,
        twitterId: info.twitterId === '' ? null : info.twitterId,
      },
    );

    const userSocialLinks = await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersSocialLinks,
      state.user.$id,
    );

    dispatch({
      type: 'UPDATE_USER_SOCIAL_LINKS',
      payload: {
        userSocialLinks: userSocialLinks,
      },
    });
  }, [state])
  // ******** END : UPDATE DATA FUNCTIONS ********



  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      errorMessage: state.errorMessage,
      profileImage: state.profileImage,
      userProfile: state.userProfile,
      userGeneral: state.userGeneral,
      userPermissions: state.userPermissions,
      userSocialLinks: state.userSocialLinks,
      // auth functions
      login,
      logout,
      updatePassword,
      //update functions
      updateProfileImage,
      updateUserGeneral,
      updateUserSocialLinks,
      // fetch functions
      fetchGeneralData,
      fetchPermissionData,
      fetchSocialLinksData,
    }),
    [state.isInitialized, state.isAuthenticated, state.user, state.errorMessage, state.profileImage, state.userProfile, state.userGeneral, state.userPermissions, state.userSocialLinks, login, logout, updatePassword, updateProfileImage, updateUserGeneral, updateUserSocialLinks, fetchGeneralData, fetchPermissionData, fetchSocialLinksData]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
