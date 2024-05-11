// appwrite
import { Client, Databases, Query, Storage, Functions, Teams } from "appwrite";
import { APPWRITE_API } from '../config-global';


// CLIENT INITIALIZATION ------------------------------------------------
const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const storage = new Storage(client);
const databases = new Databases(client);
const functions = new Functions(client);
const teams = new Teams(client);


// TEAM FUNCTIONS -------------------------------------------------------

export class Team {

  /**
   * Fuction to fetch teams which is associated with a particular user.
   * @returns - List of all team documents from table `teams`
   */
  static async getMyTeamData() {
    return await teams.list(
      [
        Query.limit(100)
      ]
    );
  }

  /**
   * Function to fetch team cover
   * @param {string} id - file id
   * @returns - Image URL
   */
  static async getTeamCover(id) {
    return storage.getFileView(
      APPWRITE_API.buckets.teamCover,
      id).href;
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
  static async sendTeamInvitationEmail(email, userId, teamName, name, managerName, managerDesignation, manageremail, managerPhone, role, teamId, managerId) {
    const checkMembership = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.teamMembership,
      [
        Query.equal('teamId', [teamId]),
        Query.equal('userId', [userId]),
      ]
    );
    if (checkMembership.total !== 0) {
      throw new Error('User already a member of the team.');
    }
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
}