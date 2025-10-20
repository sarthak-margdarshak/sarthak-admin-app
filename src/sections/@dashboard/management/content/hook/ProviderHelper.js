import { Query } from "appwrite";
import { appwriteDatabases, appwriteStorage } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";

export class ProviderHelper {
  static async fetchStandards(currBookIndexList) {
    // Create Query
    const queries = [
      Query.and([
        Query.isNull("subject"),
        Query.isNull("chapter"),
        Query.isNull("concept"),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
      Query.select("$id"),
    ];
    if (currBookIndexList.standards.length !== 0) {
      queries.push(
        Query.cursorAfter(
          currBookIndexList.standards[currBookIndexList.standards.length - 1]
            .$id
        )
      );
    }

    // Fetch result
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    // Add each standard in the map
    x.documents.forEach((value) =>
      currBookIndexList.standards.push({
        $id: value.$id,
        subjects: [],
        total: -1,
      })
    );
    currBookIndexList.total = x.total;

    return currBookIndexList;
  }

  static async fetchSubjects(currBookIndexList, standardId) {
    // Get standard index
    const standardIdIndex = currBookIndexList.standards.findIndex(
      (value) => value.$id === standardId
    );

    const queries = [
      Query.and([
        Query.equal("standard", standardId),
        Query.isNull("chapter"),
        Query.isNull("concept"),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
      Query.select("$id"),
    ];
    if (currBookIndexList.standards[standardIdIndex].subjects.length !== 0) {
      queries.push(
        Query.cursorAfter(
          currBookIndexList.standards[standardIdIndex].subjects[
            currBookIndexList.standards[standardIdIndex].subjects.length - 1
          ].$id
        )
      );
    }

    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    x.documents.forEach((value) =>
      currBookIndexList.standards[standardIdIndex].subjects.push({
        $id: value.$id,
        chapters: [],
        total: -1,
        lastChapterId: null,
      })
    );

    currBookIndexList.standards[standardIdIndex].total = x.total;

    return currBookIndexList;
  }

  static async fetchChapters(currBookIndexList, standardId, subjectId) {
    // Get standard and subject index
    const standardIdIndex = currBookIndexList.standards.findIndex(
      (value) => value.$id === standardId
    );
    const subjectIdIndex = currBookIndexList.standards[
      standardIdIndex
    ].subjects.findIndex((value) => value.$id === subjectId);

    const queries = [
      Query.and([
        Query.equal("standard", standardId),
        Query.equal("subject", subjectId),
        Query.isNull("concept"),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
      Query.select("$id"),
    ];
    if (
      currBookIndexList.standards[standardIdIndex].subjects[subjectIdIndex]
        .chapters.length !== 0
    ) {
      queries.push(
        Query.cursorAfter(
          currBookIndexList.standards[standardIdIndex].subjects[subjectIdIndex]
            .chapters[
            currBookIndexList.standards[standardIdIndex].subjects[
              subjectIdIndex
            ].chapters.length - 1
          ].$id
        )
      );
    }

    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    x.documents.forEach((value) =>
      currBookIndexList.standards[standardIdIndex].subjects[
        subjectIdIndex
      ].chapters.push({
        $id: value.$id,
        concepts: [],
        total: -1,
      })
    );

    currBookIndexList.standards[standardIdIndex].subjects[
      subjectIdIndex
    ].total = x.total;

    return currBookIndexList;
  }

  static async fetchConcepts(
    currBookIndexList,
    standardId,
    subjectId,
    chapterId
  ) {
    // Get standard, subject and chapter index
    const standardIdIndex = currBookIndexList.standards.findIndex(
      (value) => value.$id === standardId
    );
    const subjectIdIndex = currBookIndexList.standards[
      standardIdIndex
    ].subjects.findIndex((value) => value.$id === subjectId);
    const chapterIdIndex = currBookIndexList.standards[
      standardIdIndex
    ].subjects[subjectIdIndex].chapters.findIndex(
      (value) => value.$id === chapterId
    );

    const queries = [
      Query.and([
        Query.equal("standard", standardId),
        Query.equal("subject", subjectId),
        Query.equal("chapter", chapterId),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
      Query.select("$id"),
    ];
    if (
      currBookIndexList.standards[standardIdIndex].subjects[subjectIdIndex]
        .chapters[chapterIdIndex].concepts.length !== 0
    ) {
      queries.push(
        Query.cursorAfter(
          currBookIndexList.standards[standardIdIndex].subjects[subjectIdIndex]
            .chapters[chapterIdIndex].concepts[
            currBookIndexList.standards[standardIdIndex].subjects[
              subjectIdIndex
            ].chapters[chapterIdIndex].concepts.length - 1
          ].$id
        )
      );
    }

    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    x.documents.forEach((value) =>
      currBookIndexList.standards[standardIdIndex].subjects[
        subjectIdIndex
      ].chapters[chapterIdIndex].concepts.push({
        $id: value.$id,
      })
    );

    currBookIndexList.standards[standardIdIndex].subjects[
      subjectIdIndex
    ].chapters[chapterIdIndex].total = x.total;

    return currBookIndexList;
  }

  static async detectChangeInQuestion(questionId) {
    try {
      const questionLocalKey = `question_${questionId}`;
      const localQuestion = JSON.parse(localStorage.getItem(questionLocalKey));

      let x = (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          questionId,
          [Query.select("$updatedAt")]
        )
      ).$updatedAt;

      for (let lang of localQuestion.translatedLang) {
        const langObj = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedQuestions,
          [
            Query.equal("questionId", questionId),
            Query.equal("lang", lang),
            Query.select("$updatedAt"),
          ]
        );

        if (x < langObj.documents[0].$updatedAt) {
          x = langObj.documents[0].$updatedAt;
        }
      }

      return x > localQuestion.$updatedAt;
    } catch (error) {
      return true;
    }
  }

  static async downloadQuestion(questionId) {
    const questionLocalKey = `question_${questionId}`;
    try {
      const question = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId
      );

      delete question.$collectionId;
      delete question.$databaseId;
      delete question.$permissions;
      delete question.$sequence;

      if (question?.coverQuestion !== null && question?.coverQuestion !== "") {
        question.coverQuestion = appwriteStorage.getFileDownload(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          question?.coverQuestion
        );
      }

      const options = [];
      for (let i in question?.coverOptions) {
        if (
          question?.coverOptions[i] !== null &&
          question?.coverOptions[i] !== ""
        ) {
          const data = appwriteStorage.getFileDownload(
            APPWRITE_API.buckets.sarthakDatalakeBucket,
            question?.coverOptions[i]
          );
          options.push(data);
        } else {
          options.push(null);
        }
      }
      question.coverOptions = options;

      if (question?.coverAnswer !== null && question?.coverAnswer !== "") {
        question.coverAnswer = appwriteStorage.getFileDownload(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          question?.coverAnswer
        );
      }

      // Add other language questions too
      for (let lang of question.translatedLang) {
        const langObj = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedQuestions,
          [Query.equal("questionId", questionId), Query.equal("lang", lang)]
        );

        question[lang] = {
          contentAnswer: langObj.documents[0].contentAnswer,
          contentOptions: langObj.documents[0].contentOptions,
          contentQuestion: langObj.documents[0].contentQuestion,
        };

        if (question.$updatedAt < langObj.$updatedAt) {
          question.$updatedAt = langObj.$updatedAt;
        }
      }

      const y = JSON.stringify(question);
      localStorage.setItem(questionLocalKey, y);

      return question;
    } catch (error) {
      if (localStorage.getItem(questionLocalKey)) {
        localStorage.removeItem(questionLocalKey);
      }
      return null;
    }
  }

  static async detectChangeInBookIndex(bookIndexId) {
    const bookIndexLocalKey = `bookIndex_${bookIndexId}`;
    const localbookIndex = JSON.parse(localStorage.getItem(bookIndexLocalKey));

    let x = (
      await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        bookIndexId,
        [Query.select("$updatedAt")]
      )
    ).$updatedAt;

    return x > localbookIndex.$updatedAt;
  }

  static async downloadBookIndex(bookIndexId) {
    let bookIndex = null;
    let needToDownload = false;
    const bookIndexLocalKey = `bookIndex_${bookIndexId}`;
    if (localStorage.getItem(bookIndexLocalKey)) {
      needToDownload = await ProviderHelper.detectChangeInBookIndex(
        bookIndexId
      );
      if (!needToDownload) {
        bookIndex = JSON.parse(localStorage.getItem(bookIndexLocalKey));
      }
    } else {
      needToDownload = true;
    }

    if (needToDownload) {
      bookIndex = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        bookIndexId
      );

      delete bookIndex.$collectionId;
      delete bookIndex.$createdAt;
      delete bookIndex.$databaseId;
      delete bookIndex.$permissions;
      delete bookIndex.$sequence;

      if (bookIndex.concept) {
        bookIndex.label =
          (await ProviderHelper.downloadBookIndex(bookIndex.chapter)).label +
          " ⮞ " +
          bookIndex.concept;
      } else {
        if (bookIndex.chapter) {
          bookIndex.label =
            (await ProviderHelper.downloadBookIndex(bookIndex.subject)).label +
            " ⮞ " +
            bookIndex.chapter;
        } else {
          if (bookIndex.subject) {
            bookIndex.label =
              (await ProviderHelper.downloadBookIndex(bookIndex.standard))
                .label +
              " ⮞ " +
              bookIndex.subject;
          } else {
            bookIndex.label = bookIndex.standard;
          }
        }
      }

      const string_bookIndex = JSON.stringify(bookIndex);
      localStorage.setItem(bookIndexLocalKey, string_bookIndex);
    }
    return bookIndex;
  }

  static async canIndexBeDeleted(indexId) {
    const indexCheck = appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      [
        Query.or([
          Query.equal("standard", indexId),
          Query.equal("subject", indexId),
          Query.equal("chapter", indexId),
          Query.equal("concept", indexId),
        ]),
        Query.limit(1),
      ]
    );
    const questionCheck = appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      [
        Query.or([
          Query.equal("bookIndexId", indexId),
          Query.equal("standardId", indexId),
          Query.equal("subjectId", indexId),
          Query.equal("chapterId", indexId),
          Query.equal("conceptId", indexId),
        ]),
        Query.limit(1),
      ]
    );
    const mockTestCheck = appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      [
        Query.or([
          Query.equal("bookIndexId", indexId),
          Query.equal("standardId", indexId),
          Query.equal("subjectId", indexId),
          Query.equal("chapterId", indexId),
          Query.equal("conceptId", indexId),
        ]),
        Query.limit(1),
      ]
    );
    const productCheck = appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      [
        Query.or([
          Query.equal("bookIndexId", indexId),
          Query.equal("standardId", indexId),
          Query.equal("subjectId", indexId),
        ]),
        Query.limit(1),
      ]
    );

    const results = await Promise.all([
      indexCheck,
      questionCheck,
      mockTestCheck,
      productCheck,
    ]);
    const totalAssociatedItems = results.reduce(
      (sum, result) => sum + result.total,
      0
    );

    return totalAssociatedItems === 0;
  }
}
