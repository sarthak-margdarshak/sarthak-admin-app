import { Query } from "appwrite";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";

export class ProviderHelper {
  static async fetchStandards(tempStandardsData) {
    // Create Query
    const queries = [
      Query.and([
        Query.isNull("subject"),
        Query.isNull("chapter"),
        Query.isNull("concept"),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ];
    if (tempStandardsData.lastStandardId !== null) {
      queries.push(Query.cursorAfter(tempStandardsData.lastStandardId));
    }

    if (tempStandardsData.lastSynced === null) {
      tempStandardsData.lastSynced = new Date().toISOString();
    }

    // Fetch result
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    // Add each standard in the map
    x.documents.forEach(
      (value) =>
        (tempStandardsData.documents[value.$id] = {
          ...value,
          subjects: {
            documents: {},
            total: -1,
            loadedOnce: false,
            lastSubjectId: null,
          },
          lastSynced: new Date().toISOString(),
        })
    );

    tempStandardsData.total = x.total;
    tempStandardsData.loadedOnce = true;

    // Update the last id which got fetched
    if (x.documents.length !== 0) {
      tempStandardsData.lastStandardId =
        x.documents[x.documents.length - 1].$id;
    }

    tempStandardsData.documents = Object.fromEntries(
      Object.entries(tempStandardsData.documents).sort(([, a], [, b]) =>
        b.$createdAt < a.$createdAt ? -1 : 1
      )
    );

    const y = JSON.stringify(tempStandardsData);
    localStorage.setItem("standardsData", y);

    return tempStandardsData;
  }

  static async fetchSubjects(standardsData, standardId) {
    const data = standardsData;
    const tempSubjectData = standardsData.documents[standardId];

    const queries = [
      Query.and([
        Query.equal("standard", standardId),
        Query.isNull("chapter"),
        Query.isNull("concept"),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ];
    if (tempSubjectData.subjects.lastSubjectId !== null) {
      queries.push(Query.cursorAfter(tempSubjectData.subjects.lastSubjectId));
    }

    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    x.documents.map(
      (value) =>
        (tempSubjectData.subjects.documents[value.$id] = {
          ...value,
          chapters: {
            documents: {},
            total: -1,
            loadedOnce: false,
            lastChapterId: null,
          },
          lastSynced: new Date().toISOString(),
        })
    );

    tempSubjectData.subjects.total = x.total;
    tempSubjectData.subjects.loadedOnce = true;

    if (x.documents.length !== 0) {
      tempSubjectData.subjects.lastSubjectId =
        x.documents[x.documents.length - 1].$id;
    }

    tempSubjectData.subjects.documents = Object.fromEntries(
      Object.entries(tempSubjectData.subjects.documents).sort(([, a], [, b]) =>
        b.$createdAt < a.$createdAt ? -1 : 1
      )
    );
    data.documents[standardId] = tempSubjectData;

    const y = JSON.stringify(data);
    localStorage.setItem("standardsData", y);

    return data;
  }

  static async fetchChapters(standardsData, standardId, subjectId) {
    const data = standardsData;
    const tempChapterData =
      standardsData.documents[standardId].subjects.documents[subjectId];

    const queries = [
      Query.and([
        Query.equal("standard", standardId),
        Query.equal("subject", subjectId),
        Query.isNull("concept"),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ];
    if (tempChapterData.chapters.lastChapterId !== null) {
      queries.push(Query.cursorAfter(tempChapterData.chapters.lastChapterId));
    }

    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    x.documents.map(
      (value) =>
        (tempChapterData.chapters.documents[value.$id] = {
          ...value,
          concepts: {
            documents: {},
            total: -1,
            loadedOnce: false,
            lastConceptId: null,
          },
          lastSynced: new Date().toISOString(),
        })
    );

    tempChapterData.chapters.total = x.total;
    tempChapterData.chapters.loadedOnce = true;

    if (x.documents.length !== 0) {
      tempChapterData.chapters.lastChapterId =
        x.documents[x.documents.length - 1].$id;
    }

    tempChapterData.chapters.documents = Object.fromEntries(
      Object.entries(tempChapterData.chapters.documents).sort(([, a], [, b]) =>
        b.$createdAt < a.$createdAt ? -1 : 1
      )
    );
    data.documents[standardId].subjects.documents[subjectId] = tempChapterData;

    const y = JSON.stringify(data);
    localStorage.setItem("standardsData", y);

    return data;
  }

  static async fetchConcepts(standardsData, standardId, subjectId, chapterId) {
    const data = standardsData;
    const tempConceptData =
      standardsData.documents[standardId].subjects.documents[subjectId].chapters
        .documents[chapterId];

    const queries = [
      Query.and([
        Query.equal("standard", standardId),
        Query.equal("subject", subjectId),
        Query.equal("chapter", chapterId),
      ]),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ];
    if (tempConceptData.concepts.lastConceptId !== null) {
      queries.push(Query.cursorAfter(tempConceptData.concepts.lastConceptId));
    }

    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      queries
    );

    x.documents.map(
      (value) =>
        (tempConceptData.concepts.documents[value.$id] = {
          ...value,
          lastSynced: new Date().toISOString(),
        })
    );

    tempConceptData.concepts.total = x.total;
    tempConceptData.concepts.loadedOnce = true;

    if (x.documents.length !== 0) {
      tempConceptData.concepts.lastConceptId =
        x.documents[x.documents.length - 1]?.$id;
    }

    tempConceptData.concepts.documents = Object.fromEntries(
      Object.entries(tempConceptData.concepts.documents).sort(([, a], [, b]) =>
        b.$createdAt < a.$createdAt ? -1 : 1
      )
    );
    data.documents[standardId].subjects.documents[subjectId].chapters.documents[
      chapterId
    ] = tempConceptData;

    const y = JSON.stringify(data);
    localStorage.setItem("standardsData", y);

    return data;
  }
}
