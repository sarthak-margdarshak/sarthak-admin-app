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
  static async updatePermissions(userId, createTeam) {
    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersPermissions,
      userId,
      {
        createTeam: createTeam,
      },
    );
  }
}