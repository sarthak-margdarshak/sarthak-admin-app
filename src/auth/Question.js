// appwrite
import { ID, Permission, Query, Role } from "appwrite";
import { APPWRITE_API } from "../config-global";
import {
  appwriteAccount,
  appwriteDatabases,
  appwriteStorage,
} from "./AppwriteContext";

// QUESTION FUNCTIONS ---------------------------------------------------

export class Question {
  /**
   * Function to get List of  Standards sorted by -> $createdAt, name, createdBy===currentUser
   * @returns List of standards
   */
  static async getStandardList(name) {
    var queries = [
      Query.limit(100),
      Query.orderDesc("$createdAt"),
      Query.orderAsc("name"),
    ];
    if (!name || name === "") {
    } else {
      queries.push(Query.search("name", name));
    }
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.standards,
      queries
    );

    return x.documents.map((val) => val?.name);
  }

  /**
   * Function to get List of  Subjects
   * @returns List of Subjects
   */
  static async getSubjectList(name, standardId) {
    var queries = [
      Query.limit(100),
      Query.orderDesc("$createdAt"),
      Query.orderAsc("name"),
    ];
    if (!name || name === "") {
    } else {
      queries.push(Query.search("name", name));
    }
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.subjects,
      queries
    );

    var subjectQueries = [Query.select(["subjectId"])];
    if (standardId === undefined || standardId === null || standardId === "") {
    } else {
      subjectQueries.push(Query.equal("standardId", standardId));
    }
    const subjectList = (
      await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        subjectQueries
      )
    ).documents.map((val) => val.subjectId);
    const subjectSet = new Set(subjectList);
    var ans = x.documents.sort((a, b) => (subjectSet.has(a.$id) ? -1 : 1));
    return ans.map((val) => val.name);
  }

  /**
   * Function to get List of  Chapters
   * @returns List of Chapters
   */
  static async getChapterList(
    name,
    standardId = undefined,
    subjectId = undefined
  ) {
    var queries = [
      Query.limit(100),
      Query.orderDesc("$createdAt"),
      Query.orderAsc("name"),
    ];
    if (!name || name === "") {
    } else {
      queries.push(Query.search("name", name));
    }
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.chapters,
      queries
    );

    var chapterQueries = [Query.select(["chapterId"])];
    if (standardId === undefined || standardId === null || standardId === "") {
    } else {
      chapterQueries.push(Query.equal("standardId", standardId));
    }
    if (subjectId === undefined || subjectId === null || subjectId === "") {
    } else {
      chapterQueries.push(Query.equal("subjectId", subjectId));
    }
    const chapterList = (
      await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        chapterQueries
      )
    ).documents.map((val) => val.chapterId);
    const chapterSet = new Set(chapterList);
    var ans = x.documents.sort((a, b) => (chapterSet.has(a.$id) ? -1 : 1));
    return ans.map((val) => val.name);
  }

  /**
   * Function to get List of  Concepts
   * @returns List of Concepts
   */
  static async getConceptList(
    name,
    standardId = undefined,
    subjectId = undefined,
    chapterId = undefined
  ) {
    var queries = [
      Query.limit(100),
      Query.orderDesc("$createdAt"),
      Query.orderAsc("name"),
    ];
    if (!name || name === "") {
    } else {
      queries.push(Query.search("name", name));
    }
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.concepts,
      queries
    );

    var conceptQueries = [Query.select(["conceptId"])];
    if (standardId === undefined || standardId === null || standardId === "") {
    } else {
      conceptQueries.push(Query.equal("standardId", standardId));
    }
    if (subjectId === undefined || subjectId === null || subjectId === "") {
    } else {
      conceptQueries.push(Query.equal("subjectId", subjectId));
    }
    if (chapterId === undefined || chapterId === null || chapterId === "") {
    } else {
      conceptQueries.push(Query.equal("chapterId", chapterId));
    }
    const conceptList = (
      await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        conceptQueries
      )
    ).documents.map((val) => val.conceptId);
    const conceptSet = new Set(conceptList);
    var ans = x.documents.sort((a, b) => (conceptSet.has(a.$id) ? -1 : 1));
    return ans.map((val) => val.name);
  }

  /**
   * Function to get Id for a standard Name
   * @param {string} standard - Name of the Standard
   * @returns Id of the Standard
   */
  static async getStandardId(standard) {
    if (standard === undefined || standard === null || standard === "") {
      return null;
    } else {
      var standardId = null;
      const tempStandardList = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.standards,
        [Query.equal("name", [standard])]
      );
      if (tempStandardList.total === 0) {
        standardId = (
          await appwriteDatabases.createDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.standards,
            ID.unique(),
            {
              name: standard,
            }
          )
        ).$id;
      } else {
        standardId = tempStandardList.documents[0].$id;
      }
      return standardId;
    }
  }

  /**
   * Function to get Id for a Subject Name
   * @param {string} subject - Name of the Subject
   * @returns Id of the Subject
   */
  static async getSubjectId(subject) {
    if (subject === undefined || subject === null || subject === "") {
      return null;
    } else {
      var subjectId = null;
      const tempSubjectList = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.subjects,
        [Query.equal("name", [subject])]
      );
      if (tempSubjectList.total === 0) {
        subjectId = (
          await appwriteDatabases.createDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.subjects,
            ID.unique(),
            {
              name: subject,
            }
          )
        ).$id;
      } else {
        subjectId = tempSubjectList.documents[0].$id;
      }
      return subjectId;
    }
  }

  /**
   * Function to get Id for a chapter Name
   * @param {string} chapter - Name of the chapter
   * @returns Id of the chapter
   */
  static async getChapterId(chapter) {
    if (chapter === undefined || chapter === null || chapter === "") {
      return null;
    } else {
      var chapterId = null;
      const tempChapterList = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.chapters,
        [Query.equal("name", [chapter])]
      );
      if (tempChapterList.total === 0) {
        chapterId = (
          await appwriteDatabases.createDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.chapters,
            ID.unique(),
            {
              name: chapter,
            }
          )
        ).$id;
      } else {
        chapterId = tempChapterList.documents[0].$id;
      }
      return chapterId;
    }
  }

  /**
   * Function to get Id for a concept Name
   * @param {string} concept - Name of the concept
   * @returns Id of the concept
   */
  static async getConceptId(concept) {
    if (concept === undefined || concept === null || concept === "") {
      return null;
    } else {
      var conceptId = null;
      const tempConceptList = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.concepts,
        [Query.equal("name", [concept])]
      );
      if (tempConceptList.total === 0) {
        conceptId = (
          await appwriteDatabases.createDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.concepts,
            ID.unique(),
            {
              name: concept,
            }
          )
        ).$id;
      } else {
        conceptId = tempConceptList.documents[0].$id;
      }
      return conceptId;
    }
  }

  /**
   * Function to create a question with status 'Initialize'
   * @param {string} userId - Current User
   * @returns Question Id
   */
  static async createQuestionId(adminTeamId) {
    return (
      await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        ID.unique(),
        {
          createdBy: (await appwriteAccount.get()).$id,
          updatedBy: (await appwriteAccount.get()).$id,
        },
        [
          Permission.read(Role.team(adminTeamId)),
          Permission.update(Role.team(adminTeamId)),
        ]
      )
    ).$id;
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
  static async uploadMetaDataQuestion(
    questionId,
    standard,
    subject,
    chapter,
    concept,
    adminTeamId
  ) {
    var id = questionId;
    if (questionId === null || questionId === "") {
      id = await this.createQuestionId(adminTeamId);
    }
    const standardId = await this.getStandardId(standard);
    const subjectId = await this.getSubjectId(subject);
    const chapterId = await this.getChapterId(chapter);
    const conceptId = await this.getConceptId(concept);

    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      id,
      {
        standardId: standardId,
        subjectId: subjectId,
        chapterId: chapterId,
        conceptId: conceptId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  /**
   * Function to get Id of question cover
   * @param {string} questionId - Id of question
   * @param {file} coverQuestionFile - question cover file
   * @returns Id of uploaded question cover
   */
  static async uploadQuestionCover(questionId, coverQuestionFile) {
    var coverId = "";
    if (typeof coverQuestionFile !== "string" && coverQuestionFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.questionFiles,
          ID.unique(),
          coverQuestionFile
        )
      ).$id;
    }

    const currentCoverQuestionFile = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["coverQuestion"])]
      )
    )?.coverQuestion;

    if (typeof coverQuestionFile !== "string") {
      if (
        !(currentCoverQuestionFile === null || currentCoverQuestionFile === "")
      ) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverQuestionFile
        );
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
   * @returns - Question Object
   */
  static async uploadQuestionContent(questionId, question, coverQuestionFile) {
    const coverQuestionId = await this.uploadQuestionCover(
      questionId,
      coverQuestionFile
    );

    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      {
        contentQuestion: question,
        coverQuestion: coverQuestionId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  /**
   * Function to get Id of option A cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionAFile - Option A cover file
   * @returns Id of uploaded Option A cover
   */
  static async uploadOptionACover(questionId, coverOptionAFile) {
    var coverId = "";
    if (typeof coverOptionAFile !== "string" && coverOptionAFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.questionFiles,
          ID.unique(),
          coverOptionAFile
        )
      ).$id;
    }

    const currentCoverOptionAFile = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["coverOptionA"])]
      )
    )?.coverOptionA;

    if (typeof coverOptionAFile !== "string") {
      if (
        !(currentCoverOptionAFile === null || currentCoverOptionAFile === "")
      ) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionAFile
        );
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
   * @returns - Question Object
   */
  static async uploadOptionAContent(questionId, optionA, coverOptionAFile) {
    const coverOptionAId = await this.uploadOptionACover(
      questionId,
      coverOptionAFile
    );

    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      {
        contentOptionA: optionA,
        coverOptionA: coverOptionAId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  /**
   * Function to get Id of option B cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionBFile - Option B cover file
   * @returns Id of uploaded Option B cover
   */
  static async uploadOptionBCover(questionId, coverOptionBFile) {
    var coverId = "";
    if (typeof coverOptionBFile !== "string" && coverOptionBFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.questionFiles,
          ID.unique(),
          coverOptionBFile
        )
      ).$id;
    }
    const currentCoverOptionBFile = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["coverOptionB"])]
      )
    )?.coverOptionB;

    if (typeof coverOptionBFile !== "string") {
      if (
        !(currentCoverOptionBFile === null || currentCoverOptionBFile === "")
      ) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionBFile
        );
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
   * @returns - Question Object
   */
  static async uploadOptionBContent(questionId, optionB, coverOptionBFile) {
    const coverOptionBId = await this.uploadOptionBCover(
      questionId,
      coverOptionBFile
    );
    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      {
        contentOptionB: optionB,
        coverOptionB: coverOptionBId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  /**
   * Function to get Id of option C cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionCFile - Option C cover file
   * @returns Id of uploaded Option C cover
   */
  static async uploadOptionCCover(questionId, coverOptionCFile) {
    var coverId = "";
    if (typeof coverOptionCFile !== "string" && coverOptionCFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.questionFiles,
          ID.unique(),
          coverOptionCFile
        )
      ).$id;
    }
    const currentCoverOptionCFile = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["coverOptionC"])]
      )
    )?.coverOptionC;

    if (typeof coverOptionCFile !== "string") {
      if (
        !(currentCoverOptionCFile === null || currentCoverOptionCFile === "")
      ) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionCFile
        );
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
   * @returns - Question Object
   */
  static async uploadOptionCContent(questionId, optionC, coverOptionCFile) {
    const coverOptionCId = await this.uploadOptionCCover(
      questionId,
      coverOptionCFile
    );

    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      {
        contentOptionC: optionC,
        coverOptionC: coverOptionCId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  /**
   * Function to get Id of option D cover
   * @param {string} questionId - Id of question
   * @param {file} coverOptionDFile - Option D cover file
   * @returns Id of uploaded Option D cover
   */
  static async uploadOptionDCover(questionId, coverOptionDFile) {
    var coverId = "";
    if (typeof coverOptionDFile !== "string" && coverOptionDFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.questionFiles,
          ID.unique(),
          coverOptionDFile
        )
      ).$id;
    }
    const currentCoverOptionDFile = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["coverOptionD"])]
      )
    )?.coverOptionD;

    if (typeof coverOptionDFile !== "string") {
      if (
        !(currentCoverOptionDFile === null || currentCoverOptionDFile === "")
      ) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverOptionDFile
        );
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
   * @returns - Question Object
   */
  static async uploadOptionDContent(questionId, optionD, coverOptionDFile) {
    const coverOptionDId = await this.uploadOptionDCover(
      questionId,
      coverOptionDFile
    );

    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      {
        contentOptionD: optionD,
        coverOptionD: coverOptionDId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  /**
   * Function to get Id of option D cover
   * @param {string} questionId - Id of question
   * @param {file} coverAnswerFile - Answer cover file
   * @returns Id of uploaded Option D cover
   */
  static async uploadAnswerCover(questionId, coverAnswerFile) {
    var coverId = "";
    if (typeof coverAnswerFile !== "string" && coverAnswerFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.questionFiles,
          ID.unique(),
          coverAnswerFile
        )
      ).$id;
    }

    const currentCoverAnswerFile = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["coverAnswer"])]
      )
    )?.coverAnswer;

    if (typeof coverAnswerFile !== "string") {
      if (!(currentCoverAnswerFile === null || currentCoverAnswerFile === "")) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.questionFiles,
          currentCoverAnswerFile
        );
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
   * @returns - Question Object
   */
  static async uploadAnswerContent(
    questionId,
    answerOption,
    answer,
    coverAnswerFile
  ) {
    const coverAnswerId = await this.uploadAnswerCover(
      questionId,
      coverAnswerFile
    );

    return await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      {
        answerOption: answerOption,
        contentAnswer: answer,
        coverAnswer: coverAnswerId,
        updatedBy: (await appwriteAccount.get()).$id,
      }
    );
  }

  static async getQuestion(questionId) {
    if (questionId) {
      if (questionId.match(/QN\d{8}/g)) {
        const x = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          [Query.equal("qnId", questionId)]
        );
        if (x.total === 1) return x.documents[0];
        else return null;
      } else {
        return await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          questionId
        );
      }
    }
    return null;
  }

  static async getStandardName(standardId) {
    if (standardId) {
      return (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.standards,
          standardId
        )
      )?.name;
    }
    return "";
  }

  static async getSubjectName(subjectId) {
    if (subjectId) {
      return (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.subjects,
          subjectId
        )
      )?.name;
    }
    return "";
  }

  static async getChapterName(chapterId) {
    if (chapterId) {
      return (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.chapters,
          chapterId
        )
      )?.name;
    }
    return "";
  }

  static async getConceptName(conceptId) {
    if (conceptId) {
      return (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.concepts,
          conceptId
        )
      )?.name;
    }
    return "";
  }

  static async getQuestionContent(fileId) {
    if (fileId) {
      return appwriteStorage.getFileView(
        APPWRITE_API.buckets.questionFiles,
        fileId
      ).href;
    }
    return null;
  }

  static async getQuestionContentForPreview(fileId) {
    if (fileId) {
      return appwriteStorage.getFileDownload(
        APPWRITE_API.buckets.questionFiles,
        fileId
      ).href;
    }
    return null;
  }

  static async getQuestionList(filterParameter, offset, limit) {
    var queries = [];
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));
    queries.push(Query.orderDesc("$createdAt"));

    if (
      filterParameter?.question !== undefined &&
      filterParameter?.question &&
      filterParameter?.question !== ""
    ) {
      queries.push(Query.search("contentQuestion", filterParameter?.question));
    }

    if (
      filterParameter?.optionA !== undefined &&
      filterParameter?.optionA &&
      filterParameter?.optionA !== ""
    ) {
      queries.push(Query.search("contentOptionA", filterParameter?.content));
    }

    if (
      filterParameter?.optionB !== undefined &&
      filterParameter?.optionB &&
      filterParameter?.optionB !== ""
    ) {
      queries.push(Query.search("contentOptionB", filterParameter?.content));
    }

    if (
      filterParameter?.optionC !== undefined &&
      filterParameter?.optionC &&
      filterParameter?.optionC !== ""
    ) {
      queries.push(Query.search("contentOptionC", filterParameter?.content));
    }

    if (
      filterParameter?.optionD !== undefined &&
      filterParameter?.optionD &&
      filterParameter?.optionD !== ""
    ) {
      queries.push(Query.search("contentOptionD", filterParameter?.content));
    }

    if (
      filterParameter?.answer !== undefined &&
      filterParameter?.answer &&
      filterParameter?.answer !== ""
    ) {
      queries.push(Query.search("contentAnswer", filterParameter?.content));
    }

    if (filterParameter?.standardId) {
      queries.push(Query.equal("standardId", [filterParameter?.standardId]));
    }

    if (filterParameter?.subjectId) {
      queries.push(Query.equal("subjectId", [filterParameter?.subjectId]));
    }

    if (filterParameter?.chapterId) {
      queries.push(Query.equal("chapterId", [filterParameter?.chapterId]));
    }

    if (filterParameter?.conceptId) {
      queries.push(Query.equal("conceptId", [filterParameter?.conceptId]));
    }

    if (filterParameter?.published) {
      queries.push(
        Query.equal("published", [filterParameter?.published === "true"])
      );
    }

    if (filterParameter?.createdBy) {
      queries.push(Query.equal("createdBy", filterParameter?.createdBy));
    }

    if (filterParameter?.updatedBy) {
      queries.push(Query.equal("updatedBy", filterParameter?.updatedBy));
    }

    if (filterParameter?.approvedBy) {
      queries.push(Query.equal("approvedBy", filterParameter?.approvedBy));
    }

    if (filterParameter?.createdAt) {
      const dates = filterParameter?.createdAt.split("to");
      queries.push(Query.greaterThanEqual("$createdAt", dates[0]));
      queries.push(Query.lessThanEqual("$createdAt", dates[1]));
    }

    if (filterParameter?.updatedAt) {
      const dates = filterParameter?.updatedAt.split("to");
      queries.push(Query.greaterThanEqual("$updatedAt", dates[0]));
      queries.push(Query.lessThanEqual("$updatedAt", dates[1]));
    }

    if (filterParameter?.approvedAt) {
      const dates = filterParameter?.approvedAt.split("to");
      queries.push(Query.greaterThanEqual("approvedAt", dates[0]));
      queries.push(Query.lessThanEqual("approvedAt", dates[1]));
    }

    const data = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      queries
    );

    return data;
  }
}
