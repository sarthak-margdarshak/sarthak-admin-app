import { Query } from "appwrite";
import { appwriteDatabases } from "./AppwriteContext";

export class AppwriteHelper {
  /**
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {Array<string>} queries
   */
  static async listAllDocuments(databaseId, collectionId, queries) {
    var res = [];
    var tempQueries = queries;
    tempQueries.push(Query.limit(100));
    const page0 = await appwriteDatabases.listDocuments(
      databaseId,
      collectionId,
      tempQueries
    );
    if (page0.documents.length === 0) return res;
    res = res.concat(page0.documents);
    var availableNext = true;
    var lastId = page0.documents[page0.documents.length - 1].$id;
    while (availableNext) {
      var tempQueries_2 = tempQueries;
      tempQueries_2.push(Query.cursorAfter(lastId));
      const nextPage = await appwriteDatabases.listDocuments(
        databaseId,
        collectionId,
        tempQueries_2
      );
      if (nextPage.documents.length === 0) {
        availableNext = false;
      } else {
        res = res.concat(nextPage.documents);
        lastId = nextPage.documents[nextPage.documents.length - 1].$id;
      }
    }
    return res;
  }
}
