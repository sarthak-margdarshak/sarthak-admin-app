// appwrite
import { Client, Query, Storage, Teams } from "appwrite";
import { APPWRITE_API } from '../config-global';


// CLIENT INITIALIZATION ------------------------------------------------
const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const storage = new Storage(client);
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
}