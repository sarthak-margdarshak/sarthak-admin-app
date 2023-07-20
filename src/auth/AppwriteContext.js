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
  static async getUserList() {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
    )).documents;
  }

  /**
   * Function to fetch users who can be invited
   * @returns List of users who can be invited to a team
   */
  static async getUserInviteList() {
    return await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
      [
        Query.equal('teamMember', ['']),
      ]
    );
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

  /**
   * Function to update profile team member
   * @param {string} userId User Id
   * @param {string} teamMember Id of team where user will be a member
   * @returns profile document
   */
  static async updateProfileTeamMember(userId, teamMember) {
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
  static async updateProfileTeamOwner(userId, teamOwner) {
    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
      userId,
      {
        teamOwner: teamOwner,
      }
    )
  }
}

// TEAM FUNCTIONS -------------------------------------------------------

export class Team {

  /**
   * Fuction to fetch teams which is associated with a particular user.
   * @param {string} userId user Id of user whose team need to be fetched
   * @returns - List of all team documents from table `teams`
   */
  static async getMyTeamData(userId) {
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
  static async getAllTeamData() {
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
  static async getTeamData(id) {
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
  static async addTeamToDatabase(name, teamOwner) {
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
  static async uploadTeamCover(file, teamId, teamOwner) {
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

// QUESTION FUNCTIONS ---------------------------------------------------

export class Question {

  /**
 * Function to get List of  Standards
 * @returns List of standards
 */
  static async getStandardList() {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.standards
    )).documents;
  }

  /**
   * Function to get List of  Subjects
   * @returns List of Subjects
   */
  static async getSubjectList() {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.subjects,
    )).documents;
  }

  /**
   * Function to get List of  Chapters
   * @returns List of Chapters
   */
  static async getChapterList() {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.chapters,
    )).documents;
  }

  /**
   * Function to get List of  Concepts
   * @returns List of Concepts
   */
  static async getConceptList() {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.concepts,
    )).documents;
  }

  /**
   * Function to get Id for a standard Name
   * @param {string} standard - Name of the Standard
   * @returns Id of the Standard
   */
  static async getStandardId(standard) {
    var standardId = null;
    const tempStandardList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.standards,
      [
        Query.equal('name', [standard])
      ]
    );
    if (tempStandardList.total === 0) {
      standardId = (await databases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.standards,
        ID.unique(),
        {
          name: standard,
        },
      )).$id;
    } else {
      standardId = tempStandardList.documents[0].$id;
    }
    return standardId;
  }

  /**
   * Function to get Id for a Subject Name
   * @param {string} subject - Name of the Subject
   * @returns Id of the Subject
   */
  static async getSubjectId(subject) {
    var subjectId = null;
    const tempSubjectList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.subjects,
      [
        Query.equal('name', [subject])
      ]
    );
    if (tempSubjectList.total === 0) {
      subjectId = (await databases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.subjects,
        ID.unique(),
        {
          name: subject,
        },
      )).$id;
    } else {
      subjectId = tempSubjectList.documents[0].$id;
    }
    return subjectId;
  }

  /**
   * Function to get Id for a chapter Name
   * @param {string} chapter - Name of the chapter
   * @returns Id of the chapter
   */
  static async getChapterId(chapter) {
    var chapterId = null;
    const tempChapterList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.chapters,
      [
        Query.equal('name', [chapter])
      ]
    );
    if (tempChapterList.total === 0) {
      chapterId = (await databases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.chapters,
        ID.unique(),
        {
          name: chapter,
        },
      )).$id;
    } else {
      chapterId = tempChapterList.documents[0].$id;
    }
    return chapterId;
  }

  /**
   * Function to get Id for a concept Name
   * @param {string} concept - Name of the concept
   * @returns Id of the concept
   */
  static async getConceptId(concept) {
    var conceptId = null;
    const tempConceptList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.concepts,
      [
        Query.equal('name', [concept])
      ]
    );
    if (tempConceptList.total === 0) {
      conceptId = (await databases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.concepts,
        ID.unique(),
        {
          name: concept,
        },
      )).$id;
    } else {
      conceptId = tempConceptList.documents[0].$id;
    }
    return conceptId;
  }

  /**
   * Function to create a question with status 'Initialize'
   * @param {string} userId - Current User
   * @returns Question Id
   */
  static async createQuestionId(userId) {
    return (await databases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      ID.unique(),
      {
        status: 'Initialize',
        createdBy: userId,
        updatedBy: userId,
      },
      [
        Permission.read(Role.any()),
        Permission.read(Role.users()),
        Permission.update(Role.users()),
      ]
    )).$id;
  }

  /**
   * Function to save metadata of a question
   * @param {string} questionId - Id of question. If null will create automatically and returns
   * @param {string} standard - name of standard
   * @param {string} subject - name of subject
   * @param {string} chapter - name of chapter
   * @param {string} concept - name of concept
   * @param {string} userId - Current User
   * @returns Question Object
   */
  static async uploadMetaDataQuestion(questionId, standard, subject, chapter, concept, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }
    const standardId = await this.getStandardId(standard);
    const subjectId = await this.getSubjectId(subject);
    const chapterId = await this.getChapterId(chapter);
    const conceptId = await this.getConceptId(concept);

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        standardId: standardId,
        subjectId: subjectId,
        chapterId: chapterId,
        conceptId: conceptId,
        updatedBy: userId,
      }
    )
  }

  /**
   * Function to get Id of question cover
   * @param {string} questionId - Id of question
   * @param {file} coverQuestionFile - question cover file
   * @param {string} userId - Current User
   * @returns Id of uploaded question cover
   */
  static async uploadQuestionCover(questionId, coverQuestionFile, userId) {
    const currentCoverQuestionFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverQuestion'])
      ]
    ))?.coverQuestion;

    if (!(currentCoverQuestionFile === null || currentCoverQuestionFile === '')) {
      await storage.deleteFile(
        APPWRITE_API.buckets.questionFiles,
        currentCoverQuestionFile,
      )
    }

    return (await storage.createFile(
      APPWRITE_API.buckets.questionFiles,
      ID.unique(),
      coverQuestionFile,
      [
        Permission.read(Role.any()),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )).$id;
  }

  /**
   * Function to Upload Question
   * @param {string} questionId - Id of question
   * @param {string} question - content of Question
   * @param {file} coverQuestionFile - File of Question cover
   * @param {string} userId - Current user
   * @returns - Question Object
   */
  static async uploadQuestionContent(questionId, question, coverQuestionFile, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }

    var coverQuestionId = null;
    if (coverQuestionFile) {
      coverQuestionId = await this.uploadQuestionCover(id, coverQuestionFile, userId);
    }

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        contentQuestion: question,
        coverQuestion: coverQuestionId,
        updatedBy: userId,
      }
    )
  }

  /**
   * Function to get Id of option A cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionAFile - Option A cover file
   * @param {string} userId - Current User
   * @returns Id of uploaded Option A cover
   */
  static async uploadOptionACover(questionId, coverOptionAFile, userId) {
    const currentCoverOptionAFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionA'])
      ]
    ))?.coverOptionA;

    if (!(currentCoverOptionAFile === null || currentCoverOptionAFile === '')) {
      await storage.deleteFile(
        APPWRITE_API.buckets.questionFiles,
        currentCoverOptionAFile,
      )
    }

    return (await storage.createFile(
      APPWRITE_API.buckets.questionFiles,
      ID.unique(),
      coverOptionAFile,
      [
        Permission.read(Role.any()),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )).$id;
  }

  /**
   * Function to Upload Option A
   * @param {string} questionId - Id of question
   * @param {string} optionA - content of option A
   * @param {file} coverOptionAFile - File of Option A cover
   * @param {string} userId - Current user
   * @returns - Question Object
   */
  static async uploadOptionAContent(questionId, optionA, coverOptionAFile, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }

    var coverOptionAId = null;
    if (coverOptionAFile) {
      coverOptionAId = await this.uploadOptionACover(id, coverOptionAFile, userId);
    }

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        contentOptionA: optionA,
        coverOptionA: coverOptionAId,
        updatedBy: userId,
      }
    )
  }

  /**
   * Function to get Id of option B cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionBFile - Option B cover file
   * @param {string} userId - Current User
   * @returns Id of uploaded Option B cover
   */
  static async uploadOptionBCover(questionId, coverOptionBFile, userId) {
    const currentCoverOptionBFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionB'])
      ]
    ))?.coverOptionB;

    if (!(currentCoverOptionBFile === null || currentCoverOptionBFile === '')) {
      await storage.deleteFile(
        APPWRITE_API.buckets.questionFiles,
        currentCoverOptionBFile,
      )
    }

    return (await storage.createFile(
      APPWRITE_API.buckets.questionFiles,
      ID.unique(),
      coverOptionBFile,
      [
        Permission.read(Role.any()),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )).$id;
  }

  /**
   * Function to Upload Option B
   * @param {string} questionId - Id of question
   * @param {string} optionB - content of option B
   * @param {file} coverOptionBFile - File of Option B cover
   * @param {string} userId - Current user
   * @returns - Question Object
   */
  static async uploadOptionBContent(questionId, optionB, coverOptionBFile, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }

    var coverOptionBId = null;
    if (coverOptionBFile) {
      coverOptionBId = await this.uploadOptionBCover(id, coverOptionBFile, userId);
    }

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        contentOptionB: optionB,
        coverOptionB: coverOptionBId,
        updatedBy: userId,
      }
    )
  }

  /**
   * Function to get Id of option C cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionCFile - Option C cover file
   * @param {string} userId - Current User
   * @returns Id of uploaded Option C cover
   */
  static async uploadOptionCCover(questionId, coverOptionCFile, userId) {
    const currentCoverOptionCFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionC'])
      ]
    ))?.coverOptionC;

    if (!(currentCoverOptionCFile === null || currentCoverOptionCFile === '')) {
      await storage.deleteFile(
        APPWRITE_API.buckets.questionFiles,
        currentCoverOptionCFile,
      )
    }

    return (await storage.createFile(
      APPWRITE_API.buckets.questionFiles,
      ID.unique(),
      coverOptionCFile,
      [
        Permission.read(Role.any()),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )).$id;
  }

  /**
   * Function to Upload Option C
   * @param {string} questionId - Id of question
   * @param {string} optionC - content of option C
   * @param {file} coverOptionCFile - File of Option C cover
   * @param {string} userId - Current user
   * @returns - Question Object
   */
  static async uploadOptionCContent(questionId, optionC, coverOptionCFile, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }

    var coverOptionCId = null;
    if (coverOptionCFile) {
      coverOptionCId = await this.uploadOptionCCover(id, coverOptionCFile, userId);
    }

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        contentOptionC: optionC,
        coverOptionC: coverOptionCId,
        updatedBy: userId,
      }
    )
  }

  /**
   * Function to get Id of option D cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionDFile - Option D cover file
   * @param {string} userId - Current User
   * @returns Id of uploaded Option D cover
   */
  static async uploadOptionDCover(questionId, coverOptionDFile, userId) {
    const currentCoverOptionDFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionD'])
      ]
    ))?.coverOptionD;

    if (!(currentCoverOptionDFile === null || currentCoverOptionDFile === '')) {
      await storage.deleteFile(
        APPWRITE_API.buckets.questionFiles,
        currentCoverOptionDFile,
      )
    }

    return (await storage.createFile(
      APPWRITE_API.buckets.questionFiles,
      ID.unique(),
      coverOptionDFile,
      [
        Permission.read(Role.any()),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )).$id;
  }

  /**
   * Function to Upload Option D
   * @param {string} questionId - Id of question
   * @param {string} optionD - content of option D
   * @param {file} coverOptionDFile - File of Option D cover
   * @param {string} userId - Current user
   * @returns - Question Object
   */
  static async uploadOptionDContent(questionId, optionD, coverOptionDFile, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }

    var coverOptionDId = null;
    if (coverOptionDFile) {
      coverOptionDId = await this.uploadOptionDCover(id, coverOptionDFile, userId);
    }

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        contentOptionD: optionD,
        coverOptionD: coverOptionDId,
        updatedBy: userId,
      }
    )
  }

  /**
   * Function to send for approval of a question
   * @param {string} questionId - Id of question
   * @param {string} userId - current user
   * @returns Question object
   */
  static async sendForApproval(questionId, userId) {
    // Get Approver ID
    const tempTeam = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.usersProfile,
      userId,
      [
        Query.select(['teamMember']),
      ]
    )).teamMember;
    if (tempTeam === null || tempTeam === '') {
      throw new Error("You have not joined any team. Please join a team to create Question.");
    }
    if (tempTeam === 'initial') {

      // Send Notification
      await databases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.notifications,
        ID.unique(),
        {
          userId: userId,
          type: 'QUESTION_REVIEW_RECIEVED',
          seen: false,
          completed: false,
          data: JSON.stringify(
            {
              questionId: questionId,
              createdBy: (await User.getProfileData(userId)).name
            }
          )
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.any()),
        ]
      )

      return await databases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.questions,
        questionId,
        {
          status: 'SentForReview',
          sentForReviewTo: userId,
        }
      )
    }
    const approverId = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.teams,
      tempTeam,
    ))?.teamOwner;

    // Send Notification
    await databases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.notifications,
      ID.unique(),
      {
        userId: approverId,
        type: 'QUESTION_REVIEW_RECIEVED',
        seen: false,
        completed: false,
        data: JSON.stringify(
          {
            questionId: questionId,
            createdBy: (await User.getProfileData(userId)).name
          }
        )
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),
      ]
    )

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      {
        status: 'SentForReview',
        sentForReviewTo: approverId,
      }
    )
  }

  static async getQuestion(questionId) {
    if (questionId) {
      return await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.questions,
        questionId
      );
    }
    return null;
  }

  static async getStandardName(standardId) {
    if (standardId) {
      return (await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.standards,
        standardId
      ))?.name;
    }
    return '';
  }

  static async getSubjectName(subjectId) {
    if (subjectId) {
      return (await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.subjects,
        subjectId
      ))?.name;
    }
    return '';
  }

  static async getChapterName(chapterId) {
    if (chapterId) {
      return (await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.chapters,
        chapterId
      ))?.name;
    }
    return '';
  }

  static async getConceptName(conceptId) {
    if (conceptId) {
      return (await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.concepts,
        conceptId
      ))?.name;
    }
    return '';
  }

  static async getQuestionContent(fileId) {
    if (fileId) {
      return storage.getFileView(
        APPWRITE_API.buckets.questionFiles,
        fileId
      ).href
    }
    return null;
  }

  static async getQuestionContentForPreview(fileId) {
    if (fileId) {
      return storage.getFileDownload(
        APPWRITE_API.buckets.questionFiles,
        fileId
      ).href
    }
    return null;
  }

  static async getFilteredQuestionList(standard, subject, chapter, concept, startDate, endDate, createdBy) {
    var queries = [];

    queries.push(Query.greaterThanEqual('$createdAt', startDate + 'T00:00:00.000+00:00'))
    queries.push(Query.lessThanEqual('$createdAt', endDate + 'T23:59:59.999+00:00'))

    if (standard?.length) {
      queries.push(Query.equal('standardId', standard))
    } else {
      queries.push(Query.notEqual('standardId', ['demo']))
    }

    if (subject?.length) {
      queries.push(Query.equal('subjectId', subject))
    } else {
      queries.push(Query.notEqual('subjectId', ['demo']))
    }

    if (chapter?.length) {
      queries.push(Query.equal('chapterId', chapter))
    } else {
      queries.push(Query.notEqual('chapterId', ['demo']))
    }

    if (concept?.length) {
      queries.push(Query.equal('conceptId', concept))
    } else {
      queries.push(Query.notEqual('conceptId', ['demo']))
    }

    if (createdBy?.length) {
      queries.push(Query.equal('createdBy', createdBy))
    } else {
      queries.push(Query.notEqual('createdBy', ['demo']))
    }

    const data = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      queries,
    )).documents;

    var ans = [];
    for (let i in data) {
      ans.push(
        {
          ...data[i],
          standard: await this.getStandardName(data[i].standardId),
          subject: await this.getSubjectName(data[i].subjectId),
          createdBy: (await User.getProfileData(data[i].createdBy))?.name,
          question: data[i].question,
        }
      )
    }

    return ans;
  }

  static async approveQuestion(questionId, userId) {
    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      {
        status: 'Approved',
        approvedBy: userId,
        updatedBy: userId,
      }
    )
  }

  static async reviewBackQuestion(questionId, userId, createdBy) {
    await databases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.notifications,
      ID.unique(),
      {
        userId: createdBy,
        type: 'QUESTION_REVIEW_RETURNED',
        seen: false,
        completed: false,
        data: JSON.stringify(
          {
            questionId: questionId,
            sentBy: (await User.getProfileData(userId)).name
          }
        )
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),
      ]
    )
    
    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      {
        status: 'ReviewedBack',
        reviewdBackTo: createdBy,
        updatedBy: userId,
      }
    )
  }

  static async activateQuestion(questionId, userId, status) {
    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      {
        status: status,
        updatedBy: userId,
      }
    )
  }
}

export class Notification {
  static async getAllNotification(user) {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.notifications,
      [
        Query.equal('userId', [user]),
        Query.orderDesc("$createdAt")
      ],
    )).documents;
  }

  static async getUnreadNotification(user) {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.notifications,
      [
        Query.equal('seen', [false]),
        Query.equal('userId', [user]),
        Query.orderDesc("$createdAt"),
      ],
    )).documents;
  }

  static async getUnreadNotificationCount(user) {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.notifications,
      [
        Query.equal('seen', [false]),
        Query.equal('userId', [user]),
      ],
    )).total
  }

  static async updateSeen(id) {
    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.notifications,
      id,
      {
        seen: true,
        completed: true,
      }
    )
  }

  static async updateInvitationAction(action, membershipId, userId, notificationId, managerName) {
    const execId = await functions.createExecution(
      APPWRITE_API.functions.acceptInvite,
      JSON.stringify(
        {
          action: action,
          membershipId: membershipId,
          userId: userId,
          notificationId: notificationId,
          managerName: managerName,
        }
      )
    );

    var notDone = true;
    while (notDone) {
      const data = await functions.getExecution(
        APPWRITE_API.functions.acceptInvite,
        execId?.$id
      );
      if (data?.status === 'completed') {
        break;
      } else if (data?.status === 'failed') {
        throw new Error('Some unexpected error occured !!!');
      }
    }
  }
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
  notificationCount: 0,
  underMaintenance: false,
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
      notificationCount: action.payload.notificationCount,
      underMaintenance: action.payload.underMaintenance,
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
      notificationCount: action.payload.notificationCount,
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
      notificationCount: action.payload.notificationCount,
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
  if (action.type === 'UPDATE_NOTIFICATION_BADGE') {
    return {
      ...state,
      notificationCount: action.payload.notificationCount,
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
      userGeneral = await User.getUserGeneralData(id)
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
      userPermissions = await User.getUserPermissionData(id);
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
      userSocialLinks = await User.getUserSocialLinksData(id);
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
        const sarthakInfoData = await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.sarthakInfoData,
          APPWRITE_API.databases.sarthakInfoDataCollection
        );
        dispatch({
          type: 'INITIAL',
          payload: {
            underMaintenance: sarthakInfoData?.maintenance,
          }
        })
        const user = response;
        const userProfile = await User.getProfileData(user.$id);
        var profileImage = null;
        const cnt = await Notification.getUnreadNotificationCount(user?.$id);
        client.subscribe('databases.' + APPWRITE_API.databaseId + '.collections.' + APPWRITE_API.databases.notifications + '.documents', async (response) => {
          const cnt = await Notification.getUnreadNotificationCount(user?.$id);
          dispatch({
            type: 'UPDATE_NOTIFICATION_BADGE',
            payload: {
              notificationCount: cnt,
            },
          });
        })
        if (userProfile.photoUrl) {
          profileImage = await User.getImageProfileLink(userProfile.photoUrl);
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
            notificationCount: cnt,
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
          notificationCount: 0,
          underMaintenance: true,
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
    const userProfile = await User.getProfileData(user.$id);
    var profileImage = null;
    if (userProfile.photoUrl) {
      profileImage = await User.getImageProfileLink(userProfile.photoUrl);
    }
    const cnt = await Notification.getUnreadNotificationCount(user?.$id);
    client.subscribe('databases.' + APPWRITE_API.databaseId + '.collections.' + APPWRITE_API.databases.notifications + '.documents', async (response) => {
      const cnt = await Notification.getUnreadNotificationCount(user?.$id);
      dispatch({
        type: 'UPDATE_NOTIFICATION_BADGE',
        payload: {
          notificationCount: cnt,
        },
      });
    })

    dispatch({
      type: 'LOGIN',
      payload: {
        isInitialized: true,
        isAuthenticated: true,
        errorMessage: null,
        user: user,
        profileImage: profileImage,
        userProfile: userProfile,
        notificationCount: cnt,
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
        notificationCount: 0,
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

    const userProfile = await User.getProfileData(state.user.$id);
    const profileImage = await User.getImageProfileLink(userProfile.photoUrl);
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
      notificationCount: state.notificationCount,
      underMaintenance: state.underMaintenance,
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
    [state.isInitialized, state.isAuthenticated, state.user, state.errorMessage, state.profileImage, state.userProfile, state.userGeneral, state.userPermissions, state.userSocialLinks, state.notificationCount, state.underMaintenance, login, logout, updatePassword, updateProfileImage, updateUserGeneral, updateUserSocialLinks, fetchGeneralData, fetchPermissionData, fetchSocialLinksData]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
