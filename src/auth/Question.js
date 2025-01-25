import { APPWRITE_API } from "config-global";
import {
  appwriteStorage,
} from "auth/AppwriteContext";

export class Question {
  static async getQuestionContentForPreview(fileId) {
    if (fileId) {
      return appwriteStorage.getFileDownload(
        APPWRITE_API.buckets.questionFiles,
        fileId
      ).href;
    }
    return null;
  }
}
