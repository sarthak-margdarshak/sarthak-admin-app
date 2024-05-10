// appwrite
import { Client, Databases, ID, Permission, Query, Role, Storage } from "appwrite";
import { APPWRITE_API } from '../config-global';
import { Team } from "./Team";

// CLIENT INITIALIZATION ------------------------------------------------
const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const storage = new Storage(client);
const databases = new Databases(client);

// QUESTION FUNCTIONS ---------------------------------------------------

export class Question {

  /**
 * Function to get List of  Standards
 * @returns List of standards
 */
  static async getStandardList(name) {
    if (!name || name === '') {
      return (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.standards,
        [
          Query.limit(100)
        ]
      )).documents;
    }
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.standards,
      [
        Query.search("name", name),
        Query.limit(100)
      ]
    )).documents;
  }

  /**
   * Function to get List of  Subjects
   * @returns List of Subjects
   */
  static async getSubjectList(name, standardId) {
    var standardList = [];
    if (standardId) {
      try {
        standardList = (await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.standards,
          standardId
        )).subjectIds;
      } catch (error) { }
    }

    var ans = [];
    if (!name || name === '') {
      ans = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.subjects,
        [
          Query.limit(100)
        ]
      )).documents;
    } else {
      ans = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.subjects,
        [
          Query.search("name", name),
          Query.limit(100)
        ]
      )).documents;
    }
    ans.sort((a, b) => standardList.includes(a.$id) ? -1 : 1);
    return ans;
  }

  /**
   * Function to get List of  Chapters
   * @returns List of Chapters
   */
  static async getChapterList(name, standardId, subjectId) {
    // Get standardList
    var standardList = [];
    if (standardId) {
      try {
        standardList = (await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.standards,
          standardId
        )).subjectIds;
      } catch (error) { }
    }

    // Get Subject List
    var subjectList = [];
    if (subjectId) {
      try {
        subjectList = (await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.subjects,
          subjectId
        )).chapterIds;
      } catch (error) { }
    }
    subjectList.sort((a, b) => standardList.includes(a.$id) ? -1 : 1);

    var ans = [];
    if (!name || name === '') {
      ans = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.chapters,
        [
          Query.limit(100)
        ]
      )).documents;
    } else {
      ans = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.chapters,
        [
          Query.search("name", name),
          Query.limit(100)
        ]
      )).documents;
    }
    ans.sort((a, b) => subjectList.includes(a.$id) ? -1 : 1);
    return ans;
  }

  /**
   * Function to get List of  Concepts
   * @returns List of Concepts
   */
  static async getConceptList(name, standardId, subjectId, chapterId) {
    // Get standardList
    var standardList = [];
    if (standardId) {
      try {
        standardList = (await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.standards,
          standardId
        )).subjectIds;
      } catch (error) { }
    }

    // Get Subject List
    var subjectList = [];
    if (subjectId) {
      try {
        subjectList = (await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.subjects,
          subjectId
        )).chapterIds;
      } catch (error) { }
    }
    subjectList.sort((a, b) => standardList.includes(a.$id) ? -1 : 1);

    // Get Chapter List
    var chapterList = [];
    if (chapterId) {
      try {
        chapterList = (await databases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.databases.chapters,
          chapterId
        )).conceptIds;
      } catch (err) { }
    }
    chapterList.sort((a, b) => subjectList.includes(a.$id) ? -1 : 1);

    var ans = [];
    if (!name || name === '') {
      ans = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.concepts,
        [
          Query.limit(100)
        ]
      )).documents;
    } else {
      ans = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.concepts,
        [
          Query.search("name", name),
          Query.limit(100)
        ]
      )).documents;
    }
    ans.sort((a, b) => chapterList.includes(a.$id) ? -1 : 1);
    return ans;
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
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
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
    var coverId = '';
    if (typeof (coverQuestionFile) !== 'string' && coverQuestionFile) {
      coverId = (await storage.createFile(
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

    const currentCoverQuestionFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverQuestion'])
      ]
    ))?.coverQuestion;

    if (typeof (coverQuestionFile) !== 'string') {
      if (!(currentCoverQuestionFile === null || currentCoverQuestionFile === '')) {
        await storage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverQuestionFile,
        )
      }
    } else {
      coverId = currentCoverQuestionFile;
    }

    return coverId;
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

    const coverQuestionId = await this.uploadQuestionCover(id, coverQuestionFile, userId);

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
    var coverId = '';
    if (typeof (coverOptionAFile) !== 'string' && coverOptionAFile) {
      coverId = (await storage.createFile(
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

    const currentCoverOptionAFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionA'])
      ]
    ))?.coverOptionA;

    if (typeof (coverOptionAFile) !== 'string') {
      if (!(currentCoverOptionAFile === null || currentCoverOptionAFile === '')) {
        await storage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionAFile,
        )
      }
    } else {
      coverId = currentCoverOptionAFile;
    }

    return coverId;
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

    const coverOptionAId = await this.uploadOptionACover(id, coverOptionAFile, userId);

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
    var coverId = '';
    if (typeof (coverOptionBFile) !== 'string' && coverOptionBFile) {
      coverId = (await storage.createFile(
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
    const currentCoverOptionBFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionB'])
      ]
    ))?.coverOptionB;

    if (typeof (coverOptionBFile) !== 'string') {
      if (!(currentCoverOptionBFile === null || currentCoverOptionBFile === '')) {
        await storage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionBFile,
        )
      }
    } else {
      coverId = currentCoverOptionBFile;
    }

    return coverId;
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

    const coverOptionBId = await this.uploadOptionBCover(id, coverOptionBFile, userId);

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
    var coverId = '';
    if (typeof (coverOptionCFile) !== 'string' && coverOptionCFile) {
      coverId = (await storage.createFile(
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
    const currentCoverOptionCFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionC'])
      ]
    ))?.coverOptionC;

    if (typeof (coverOptionCFile) !== 'string') {
      if (!(currentCoverOptionCFile === null || currentCoverOptionCFile === '')) {
        await storage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionCFile,
        )
      }
    } else {
      coverId = currentCoverOptionCFile;
    }

    return coverId;
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

    const coverOptionCId = await this.uploadOptionCCover(id, coverOptionCFile, userId);

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
    var coverId = '';
    if (typeof (coverOptionDFile) !== 'string' && coverOptionDFile) {
      coverId = (await storage.createFile(
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
    const currentCoverOptionDFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverOptionD'])
      ]
    ))?.coverOptionD;

    if (typeof (coverOptionDFile) !== 'string') {
      if (!(currentCoverOptionDFile === null || currentCoverOptionDFile === '')) {
        await storage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionDFile,
        )
      }
    } else {
      coverId = currentCoverOptionDFile;
    }

    return coverId;
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

    const coverOptionDId = await this.uploadOptionDCover(id, coverOptionDFile, userId);

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
   * Function to get Id of option D cover
   * @param {string} questionId - Id of question
   * @param {file} coverAnswerFile - Answer cover file
   * @param {string} userId - Current User
   * @returns Id of uploaded Option D cover
   */
  static async uploadAnswerCover(questionId, coverAnswerFile, userId) {
    var coverId = '';
    if (typeof (coverAnswerFile) !== 'string' && coverAnswerFile) {
      coverId = (await storage.createFile(
        APPWRITE_API.buckets.questionFiles,
        ID.unique(),
        coverAnswerFile,
        [
          Permission.read(Role.any()),
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      )).$id;
    }

    const currentCoverAnswerFile = (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      [
        Query.select(['coverAnswer'])
      ]
    ))?.coverAnswer;

    if (typeof (coverAnswerFile) !== 'string') {
      if (!(currentCoverAnswerFile === null || currentCoverAnswerFile === '')) {
        await storage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverAnswerFile,
        )
      }
    } else {
      coverId = currentCoverAnswerFile;
    }

    return coverId;
  }

  /**
   * Function to Upload Option D
   * @param {string} questionId - Id of question
   * @param {string} answerOption - Answer Options
   * @param {string} answer - content of answer
   * @param {file} coverAnswerFile - File of Answer cover
   * @param {string} userId - Current user
   * @returns - Question Object
   */
  static async uploadAnswerContent(questionId, answerOption, answer, coverAnswerFile, userId) {
    var id = questionId;
    if (questionId === null || questionId === '') {
      id = await this.createQuestionId(userId);
    }

    const coverAnswerId = await this.uploadAnswerCover(id, coverAnswerFile, userId);

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      id,
      {
        answerOption: answerOption,
        contentAnswer: answer,
        coverAnswer: coverAnswerId,
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
  static async sendForApproval(questionId, userId, approvingTeam) {
    const team = await Team.getTeamData(approvingTeam);

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      {
        status: 'SentForReview',
        sentForReviewTo: team?.teamOwner,
        sentForReviewAt: new Date(),
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

  static async getQuestionList(filterParameter, offset, limit) {
    var queries = [];
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));
    queries.push(Query.orderDesc("$createdAt"))

    if (filterParameter?.standardId) {
      queries.push(Query.equal('standardId', [filterParameter?.standardId]))
    }

    if (filterParameter?.subjectId) {
      queries.push(Query.equal('subjectId', [filterParameter?.subjectId]))
    }

    if (filterParameter?.chapterId) {
      queries.push(Query.equal('chapterId', [filterParameter?.chapterId]))
    }

    if (filterParameter?.conceptId) {
      queries.push(Query.equal('conceptId', [filterParameter?.conceptId]))
    }

    if (filterParameter?.status) {
      queries.push(Query.equal('status', [filterParameter?.status]))
    }

    if (filterParameter?.createdBy) {
      queries.push(Query.equal('createdBy', filterParameter?.createdBy))
    }

    if (filterParameter?.updatedBy) {
      queries.push(Query.equal('updatedBy', filterParameter?.updatedBy))
    }

    if (filterParameter?.approvedBy) {
      queries.push(Query.equal('approvedBy', filterParameter?.approvedBy))
    }

    if (filterParameter?.sentForReviewTo) {
      queries.push(Query.equal('sentForReviewTo', filterParameter?.sentForReviewTo))
    }

    if (filterParameter?.reviewedBackTo) {
      queries.push(Query.equal('reviewdBackTo', filterParameter?.reviewedBackTo))
    }

    if (filterParameter?.createdAt) {
      const dates = filterParameter?.createdAt.split('to');
      queries.push(Query.greaterThanEqual('$createdAt', dates[0]))
      queries.push(Query.lessThanEqual('$createdAt', dates[1]))
    }

    if (filterParameter?.updatedAt) {
      const dates = filterParameter?.updatedAt.split('to');
      queries.push(Query.greaterThanEqual('$updatedAt', dates[0]))
      queries.push(Query.lessThanEqual('$updatedAt', dates[1]))
    }

    if (filterParameter?.approvedAt) {
      const dates = filterParameter?.approvedAt.split('to');
      queries.push(Query.greaterThanEqual('approvedAt', dates[0]))
      queries.push(Query.lessThanEqual('approvedAt', dates[1]))
    }

    if (filterParameter?.sentForReviewAt) {
      const dates = filterParameter?.sentForReviewAt.split('to');
      queries.push(Query.greaterThanEqual('sentForReviewAt', dates[0]))
      queries.push(Query.lessThanEqual('sentForReviewAt', dates[1]))
    }

    if (filterParameter?.reviewedBackAt) {
      const dates = filterParameter?.reviewedBackAt.split('to');
      queries.push(Query.greaterThanEqual('reviewBackAt', dates[0]))
      queries.push(Query.lessThanEqual('reviewBackAt', dates[1]))
    }

    const data = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      queries,
    ));

    return data;
  }

  static async canAction(questionId, userId) {
    const question = await this.getQuestion(questionId);
    const isOwner = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.teams,
      [
        Query.equal('teamOwner', [userId])
      ]
    )).total !== 0;
    if (isOwner) return true;
    if (question?.status === 'Initialize') {
      return (userId === question?.createdBy)
    } else if (question?.status === 'SentForReview') {
      return (userId === question?.createdBy || userId === question?.reviewdBackTo)
    } else if (question?.status === 'ReviewedBack') {
      return (userId === question?.createdBy || userId === question?.reviewdBackTo)
    }
    return true;
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
        approvedAt: new Date(),
      }
    )
  }

  static async reviewBackQuestion(questionId, userId, createdBy, comment) {

    return await databases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.questions,
      questionId,
      {
        status: 'ReviewedBack',
        reviewdBackTo: createdBy,
        updatedBy: userId,
        reviewComment: comment,
        reviewBackAt: new Date(),
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

  static async getTotalQuestionSubjectWise() {
    const subjects = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.subjects,
      [
        Query.orderDesc("count"),
        Query.limit(5),
      ]
    );

    const totalQuestionCount = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      [Query.limit(1)]
    )).total;

    var currToatal = 0;
    var ans = [];
    for (let i in subjects.documents) {
      currToatal += subjects.documents[i].count;
      ans.push({ label: subjects.documents[i]?.name, value: subjects.documents[i].count })
    }
    ans.push({ label: 'Others', value: totalQuestionCount - currToatal })
    return ans;
  }

  static async getTotalQuestionStandardWise() {
    const standards = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.standards,
      [
        Query.orderDesc("count"),
        Query.limit(5),
      ]
    );

    const totalQuestionCount = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      [Query.limit(1)]
    )).total;

    var currToatal = 0;
    var ans = [];
    for (let i in standards.documents) {
      currToatal += standards.documents[i].count;
      ans.push({ label: standards.documents[i]?.name, value: standards.documents[i].count })
    }
    ans.push({ label: 'Others', value: totalQuestionCount - currToatal })
    return ans;
  }

  static async getTotalQuestionChapterWise() {
    const chapters = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.chapters,
      [
        Query.orderDesc("count"),
        Query.limit(5),
      ]
    );

    const totalQuestionCount = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      [Query.limit(1)]
    )).total;

    var currToatal = 0;
    var ans = [];
    for (let i in chapters.documents) {
      currToatal += chapters.documents[i].count;
      ans.push({ label: chapters.documents[i]?.name, value: chapters.documents[i].count })
    }
    ans.push({ label: 'Others', value: totalQuestionCount - currToatal })
    return ans;
  }

  static async getTotalQuestionConceptWise() {
    const concepts = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.concepts,
      [
        Query.orderDesc("count"),
        Query.limit(5),
      ]
    );

    const totalQuestionCount = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      [Query.limit(1)]
    )).total;

    var currToatal = 0;
    var ans = [];
    for (let i in concepts.documents) {
      currToatal += concepts.documents[i].count;
      ans.push({ label: concepts.documents[i]?.name, value: concepts.documents[i].count })
    }
    ans.push({ label: 'Others', value: totalQuestionCount - currToatal })
    return ans;
  }

  static async getQuestionTypedData() {
    return JSON.parse(
      (await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.sarthakInfoData,
        APPWRITE_API.documents.sarthak
      )).questionCount
    );
  }
}