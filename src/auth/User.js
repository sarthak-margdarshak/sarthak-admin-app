// appwrite
import { Query } from "appwrite";
import { APPWRITE_API } from "../config-global";
import { appwriteDatabases } from "./AppwriteContext";

// USER FUNCTIONS ------------------------------------------------------------

export class User {
  /**
   * Function to fetch user list
   * @returns User List
   */
  static async getUserList(name) {
    if (!name || name === "") {
      const x = (
        await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.adminUsers,
          [Query.limit(100)]
        )
      ).documents;
      return x.map((val) => val?.name + " (" + val?.empId + ")");
    }
    const x = (
      await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.adminUsers,
        [Query.or([Query.contains("empId", name), Query.contains("name", name)]), Query.limit(100)]
      )
    ).documents;
    return x.map((val) => val?.name + " (" + val?.empId + ")");
  }
}
