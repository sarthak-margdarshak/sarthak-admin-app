// appwrite
import { Client, Databases, ID, Permission, Query, Role, Storage, Functions, Teams } from "appwrite";
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
   * Function to create a team.
   * @param {string} name - Name of the team
   * @param {string} teamOwner - teamOwner ID
   * @returns - Team
   */
  static async addTeamToDatabase(name, teamOwner, id) {
    if (id) {
      return await databases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.teams,
        id,
        {
          name: name
        }
      )
    } else {
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
  static async addMemberToTeamDatabase(teamId, userId, ownerId, role, active, invitationAccepted) {
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
  static async listTeamMembership(id) {
    return await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.teamMembership,
      [
        Query.equal("teamId", [id]),
        Query.limit(100)
      ],
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
  static async onboardWelcome(name, email, password, designation, phoneNumber, managerId, managerName, managerDesignation, manageremail, managerPhone, role, teamId, teamName) {
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