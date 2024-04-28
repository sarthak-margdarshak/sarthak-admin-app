// appwrite
import { Client, Databases, Query, Storage } from "appwrite";
import { APPWRITE_API } from '../config-global';


// CLIENT INITIALIZATION ------------------------------------------------
const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const storage = new Storage(client);
const databases = new Databases(client);

// USER FUNCTIONS ------------------------------------------------------------

export class User {
  /**
   * Function to fetch a document from `sgi_users_profile` table
   * @param {string} id - User Id
   * @returns User Profile Data of user id
   */
  static async getProfileData(id) {
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
  static async getUserGeneralData(id) {
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
  static async getUserPermissionData(id) {
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
  static async getUserSocialLinksData(id) {
    return await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersSocialLinks,
      id,
    );
  }

  /**
   * Function to fetch user list
   * @returns User List
   */
  static async getUserList(name) {
    if (!name || name === '') {
      return (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.usersProfile,
        [
          Query.limit(100)
        ]
      )).documents;
    }
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
      [
        Query.search("name", name),
        Query.limit(100)
      ]
    )).documents;
  }

  /**
   * Function to fetch user profile image
   * @param {string} id - file id
   * @returns - Image URL
   */
  static async getImageProfileLink(id) {
    return (storage.getFilePreview(
      APPWRITE_API.buckets.userImage,
      id,
      undefined,
      undefined,
      undefined,
      20
    )).href;
  }

  /**
   * Function to block a membership/user
   * @param {string} membership Id of membership document
   * @returns Confirmation of this
   */
  static async blockUser(membership) {
  }

  /**
   * Function to update user permission
   * @param {string} userId User ID
   * @param {boolean} createTeam Permission to create Team
   * @param {boolean} createTask Permission to create Task
   * @returns Permission document
   */
  static async updatePermissions(userId, createTeam, createTask) {
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
  static async isPermissionUpdatable(userId, teamId, currentUser) {
    if (userId === currentUser) return 1;
    const data = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.teamMembership,
      [
        Query.equal('userId', [userId]),
        Query.equal('teamId', [teamId]),
      ],
    );
    if (data.total === 0) return 0;

    const data2 = await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.teams,
      teamId
    );
    if (data2?.teamOwner === currentUser) return 2;
    return 1;
  }
}