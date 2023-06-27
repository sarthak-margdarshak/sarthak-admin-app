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
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// appwrite
import { Account, Client, Databases, ID, Permission, Query, Role, Storage, Functions } from "appwrite";
import { APPWRITE_API } from '../config-global';


// CLIENT INITIALIZATION ------------------------------------------------
const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);
const functions = new Functions(client);


// FUNCTIONS ------------------------------------------------------------
/**
 * Function to fetch a document from `sgi_users_profile` table
 * @param {string} id - User Id
 * @returns User Profile Data of user id
 */
export async function getProfileData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersProfile,
    id,
  );
}

/**
 * Function to fetch a document from `sgi_users_general` table
 * @param {string} id - User Id
 * @returns - User General Data of user id
 */
export async function getUserGeneralData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersGeneral,
    id,
  );
}

/**
 * Function to fetch a document from `sgi_users_permissions` table
 * @param {string} id - User Id
 * @returns - User Permission Data of user id
 */
export async function getUserPermissionData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersPermissions,
    id,
  );
}

/**
 * Function to fetch a document from `sgi_users_social_links` table
 * @param {string} id - User Id
 * @returns - User Social Links Data of user id
 */
export async function getUserSocialLinksData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersSocialLinks,
    id,
  );
}

/**
 * Function to fetch users who can be invited
 * @returns List of users who can be invited to a team
 */
export async function getUserInviteList() {
  return await databases.listDocuments(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersProfile,
    [
      Query.equal('teamMember', ['']),
    ]
  );
}

// TEAM FUNCTIONS -------------------------------------------------------
/**
 * Fuction to fetch teams which is associated with a particular user.
 * @param {string} userId user Id of user whose team need to be fetched
 * @returns - List of all team documents from table `teams`
 */
export async function getMyTeamData(userId) {
  const profileData = await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersProfile,
    userId,
  );

  return await databases.listDocuments(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
    [
      Query.equal("$id", [profileData?.teamOwner, profileData?.teamMember]),
    ]
  );
}

/**
 * Function to fetch all teams data
 * @returns - List of all team present in the system.
 */
export async function getAllTeamData() {
  return await databases.listDocuments(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
  );
}

/**
 * Function to fetch team data of particular team.
 * @param {string} id - Id of team
 * @returns - Team data
 */
export async function getTeamData(id) {
  return await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
    id,
  );
}

/**
 * Function to create a team.
 * @param {string} name - Name of the team
 * @param {string} teamOwner - teamOwner ID
 * @returns - Team
 */
export async function addTeamToDatabase(name, teamOwner) {
  return await databases.createDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
    ID.unique(),
    {
      teamOwner: teamOwner,
      name: name,
      member: 1,
    },
    [
      Permission.update(Role.user(teamOwner)),
      Permission.read(Role.user(teamOwner)),
      Permission.delete(Role.user(teamOwner)),
      Permission.read(Role.any()),
    ]
  )
}

/**
 * Function to upload cover photo of a team.
 * @param {File} file - cover file
 * @param {string} teamId - team id
 * @param {string} teamOwner - team owner id
 */
export async function uploadTeamCover(file, teamId, teamOwner) {
  // Get Team Data to check existing Cover
  const team = await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
    teamId,
  );

  // If cover is already is present delete it
  if (team.cover) {
    await storage.deleteFile(
      APPWRITE_API.buckets.teamCover,
      team.cover,
    );
  }

  // Upload file and give permissions
  const coverData = await storage.createFile(
    APPWRITE_API.buckets.teamCover,
    ID.unique(),
    file,
    [
      Permission.update(Role.user(teamOwner)),
      Permission.read(Role.user(teamOwner)),
      Permission.delete(Role.user(teamOwner)),
      Permission.read(Role.any()),
    ]
  );

  // Update database
  await databases.updateDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
    teamId,
    {
      cover: coverData.$id,
    },
  );
}

/**
 * Function to create document in `sgi_team_membership` table
 * @param {string} teamId - Id of the team
 * @param {string} userId - Id of user
 * @param {string} ownerId - Id of the teamOwner
 * @param {string} role - Role of user in the team
 * @param {boolean} active - Active or blocked
 * @param {boolean} invitationAccepted Accepted Invitation or not
 * @returns - Membership object
 */
export async function addMemberToTeamDatabase(teamId, userId, ownerId, role, active, invitationAccepted) {
  var permissions = [];
  permissions.push(Permission.update(Role.user(ownerId)));
  permissions.push(Permission.read(Role.user(ownerId)));
  permissions.push(Permission.delete(Role.user(ownerId)));
  permissions.push(Permission.read(Role.any()));
  if (userId !== ownerId) {
    permissions.push(Permission.update(Role.user(userId)));
    permissions.push(Permission.read(Role.user(userId)));
    permissions.push(Permission.delete(Role.user(userId)));
  }
  return await databases.createDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teamMembership,
    ID.unique(),
    {
      teamId: teamId,
      userId: userId,
      role: role,
      active: active,
      invitationAccepted: invitationAccepted,
    },
    permissions,
  )
}

/**
 * Function to fetch all user present in the given team `id`
 * @param {string} id - team id
 * @returns - List of Team membership
 */
export async function listTeamMembership(id) {
  return await databases.listDocuments(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teamMembership,
    [
      Query.equal("teamId", [id]),
    ],
  );
}

/**
 * Function to fetch team cover
 * @param {string} id - file id
 * @returns - Image URL
 */
export async function getTeamCover(id) {
  return storage.getFileView(APPWRITE_API.buckets.teamCover, id);
}

/**
 * Function to fetch user profile image
 * @param {string} id - file id
 * @returns - Image URL
 */
export async function getImageProfileLink(id) {
  return storage.getFilePreview(APPWRITE_API.buckets.userImage, id);
}


// CLOUD FUNCTIONS
/**
 * Function to initiate welcome a user
 * @param {string} name - Name of the new user
 * @param {string} email - Email of reciepent
 * @param {string} password - Password of new User
 * @param {string} designation - Designation of user
 * @param {string} phoneNumber - Phone number of user
 * @param {string} managerId - Manager Id
 * @param {string} managerName - Name of manager
 * @param {string} managerDesignation - Designation of Manager
 * @param {string} manageremail - Email of manager
 * @param {string} managerPhone - Phone of Manager
 * @param {string} role - role of user in team
 * @param {string} teamId - team id
 * @param {string} teamName - team name
 * @returns - Confirmation of mail sent
 */
export async function onboardWelcome(name, email, password, designation, phoneNumber, managerId, managerName, managerDesignation, manageremail, managerPhone, role, teamId, teamName) {
  return await functions.createExecution(
    APPWRITE_API.functions.onboardWelcome,
    JSON.stringify(
      {
        name: name,
        email: email,
        password: password,
        designation: designation,
        phoneNumber: phoneNumber,
        managerId: managerId,
        managerName: managerName,
        managerDesignation: managerDesignation,
        manageremail: manageremail,
        managerPhone: managerPhone,
        role: role,
        teamId: teamId,
        teamName: teamName,
      }),
    true,
  );
}

/**
 * Function to initiate team invitation
 * @param {string} email - Email of reciepent
 * @param {string} userId - Id of the user
 * @param {string} teamName - team name
 * @param {string} name - Name of the user
 * @param {string} managerName - Name of manager
 * @param {string} managerDesignation - Designation of Manager
 * @param {string} manageremail - Email of manager
 * @param {string} managerPhone - Phone of Manager
 * @param {string} role - role of user in team
 * @param {string} teamId - team id
 * @param {string} managerId - Manager Id
 * @returns - Confirmation of mail sent
 */
export async function sendTeamInvitationEmail(email, userId, teamName, name, managerName, managerDesignation, manageremail, managerPhone, role, teamId, managerId) {
  return await functions.createExecution(
    APPWRITE_API.functions.teamInvite,
    JSON.stringify(
      {
        email: email,
        userId: userId,
        teamName: teamName,
        name: name,
        managerName: managerName,
        managerDesignation: managerDesignation,
        manageremail: manageremail,
        managerPhone: managerPhone,
        role: role,
        teamId: teamId,
        managerId: managerId
      }),
    true,
  );
}

/**
 * Function to block a membership/user
 * @param {string} membership Id of membership document
 * @returns Confirmation of this
 */
export async function blockUser(membership) {
  await updatePermissions(membership.userId, false, false);
  return await databases.deleteDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teamMembership,
    membership.$id,
  );
}

/**
 * Function to update user permission
 * @param {string} userId User ID
 * @param {boolean} createTeam Permission to create Team
 * @param {boolean} createTask Permission to create Task
 * @returns Permission document
 */
export async function updatePermissions(userId, createTeam, createTask) {
  return await databases.updateDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersPermissions,
    userId,
    {
      createTeam: createTeam,
      createTask: createTask,
    },
  );
}

/**
 * Function to know whether current user can update a permission or not
 * @param {string} userId User ID
 * @param {string} teamId team ID
 * @param {string} currentUser ID of current user logged in
 * @returns boolean
 */
export async function isPermissionUpdatable(userId, teamId, currentUser) {
  if(userId === currentUser) return 1;
  const data = await databases.listDocuments(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teamMembership,
    [
      Query.equal('userId', [userId]),
      Query.equal('teamId', [teamId]),
    ],
  );
  if(data.total===0) return 0;

  const data2 = await databases.getDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.teams,
    teamId
  );
  if(data2?.teamOwner===currentUser) return 2;
  return 1;
}

/**
 * Function to update profile team member
 * @param {string} userId User Id
 * @param {string} teamMember Id of team where user will be a member
 * @returns profile document
 */
export async function updateProfileTeamMember(userId, teamMember) {
  return await databases.updateDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersProfile,
    userId,
    {
      teamMember: teamMember,
    }
  )
}

/**
 * Function to update profile team owner
 * @param {string} userId 
 * @param {string} teamOwner Id of team where user will be a owner
 * @returns Profile Document
 */
export async function updateProfileTeamOwner(userId, teamOwner) {
  return await databases.updateDocument(
    APPWRITE_API.databaseId,
    APPWRITE_API.databases.usersProfile,
    userId,
    {
      teamOwner: teamOwner,
    }
  )
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
            errorMessage: error?.message,
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
  }, []);

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
      // team variables
      // team functions
    }),
    [state.isInitialized, state.isAuthenticated, state.user, state.errorMessage, state.profileImage, state.userProfile, state.userGeneral, state.userPermissions, state.userSocialLinks, login, logout, updatePassword, updateProfileImage, updateUserGeneral, updateUserSocialLinks, fetchGeneralData, fetchPermissionData, fetchSocialLinksData]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
