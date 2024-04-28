// appwrite
import { Client, Databases, ID, Permission, Query, Role, Functions } from "appwrite";
import { APPWRITE_API } from '../config-global';
import { Question } from "./Question";


// CLIENT INITIALIZATION ------------------------------------------------
const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const databases = new Databases(client);
const functions = new Functions(client);

export class MockTest {
  static async createMockTestDriver(standardId, subjectId, chapterId, conceptId, time, questionCount) {
    const id = (await databases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestDriver,
      ID.unique(),
      {
        standardId: standardId,
        subjectId: subjectId,
        chapterId: chapterId,
        conceptId: conceptId,
        time: time,
        questionCount: questionCount,
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),
      ]
    )).$id;

    functions.createExecution(
      APPWRITE_API.functions.updateMockTests
    )
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return id;
  }

  static async getMockTestStandardList() {
    const standardList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestDriver,
      [
        Query.select(["standardId"]),
        Query.limit(100),
      ]
    );

    var x = new Set();

    for (let i = 0; i < standardList.total; i++) {
      x.add(standardList.documents[i].standardId);
    }

    var res = [];
    for (const i of x) {
      const name = await Question.getStandardName(i);
      const cnt = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.mockTests,
        [
          Query.equal("standardId", [i]),
          Query.limit(1)
        ]
      )).total
      res.push({ id: i, name: name, mockTestCnt: cnt })
    }
    return res;
  }

  static async getMockTestSubjectList(standardId) {
    const subjectList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestDriver,
      [
        Query.select(["subjectId"]),
        Query.equal("standardId", [standardId]),
        Query.limit(100),
      ]
    );

    var x = new Set();

    for (let i = 0; i < subjectList.total; i++) {
      x.add(subjectList.documents[i].subjectId);
    }

    var res = [];
    for (const i of x) {
      const name = await Question.getSubjectName(i);
      const cnt = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.mockTests,
        [
          Query.equal("standardId", [standardId]),
          Query.equal("subjectId", [i]),
          Query.limit(1)
        ]
      )).total
      res.push({ id: i, name: name, mockTestCnt: cnt })
    }
    return res;
  }

  static async getMockTestChapterList(standardId, subjectId) {
    const chapterList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestDriver,
      [
        Query.select(["chapterId"]),
        Query.equal("standardId", [standardId]),
        Query.equal("subjectId", [subjectId]),
        Query.limit(100),
      ]
    );

    var x = new Set();
    for (let i = 0; i < chapterList.total; i++) {
      x.add(chapterList.documents[i].chapterId);
    }

    var res = [];
    for (const i of x) {
      const name = await Question.getChapterName(i);
      const cnt = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.mockTests,
        [
          Query.equal("standardId", [standardId]),
          Query.equal("subjectId", [subjectId]),
          Query.equal("chapterId", [i]),
          Query.limit(1)
        ]
      )).total
      res.push({ id: i, name: name, mockTestCnt: cnt })
    }
    return res;
  }

  static async getMockTestConceptList(standardId, subjectId, chapterId) {
    const conceptList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestDriver,
      [
        Query.select(["conceptId"]),
        Query.equal("standardId", [standardId]),
        Query.equal("subjectId", [subjectId]),
        Query.equal("chapterId", [chapterId])
      ]
    );

    var x = new Set();
    for (let i = 0; i < conceptList.total; i++) {
      x.add(conceptList.documents[i].conceptId);
    }

    var res = [];
    for (const i of x) {
      const name = await Question.getConceptName(i);
      const cnt = (await databases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.mockTests,
        [
          Query.equal("standardId", [standardId]),
          Query.equal("subjectId", [subjectId]),
          Query.equal("chapterId", [chapterId]),
          Query.equal("conceptId", [i]),
          Query.limit(1)
        ]
      )).total
      res.push({ id: i, name: name, mockTestCnt: cnt })
    }
    return res;
  }

  static async getMockTestList(standardId, subjectId, chapterId, conceptId) {
    const mockTestList = await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTests,
      [
        Query.equal("standardId", [standardId]),
        Query.equal("subjectId", [subjectId]),
        Query.equal("chapterId", [chapterId]),
        Query.equal("conceptId", [conceptId]),
        Query.limit(100),
      ]
    );

    var res = [];
    for (let i = 0; i < mockTestList.total; i++) {
      res.push({ id: mockTestList.documents[i].$id, name: mockTestList.documents[i].name })
    }
    return res;
  }

  static async getMockTestDriver(standardId, subjectId, chapterId, conceptId) {
    return (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestDriver,
      [
        Query.equal("standardId", [standardId]),
        Query.equal("subjectId", [subjectId]),
        Query.equal("chapterId", [chapterId]),
        Query.equal("conceptId", [conceptId]),
      ]
    ))
  }

  static async getMockTest(id) {
    return (await databases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTests,
      id
    ));
  }

  /**
   * 
   * @param {string} standard 
   * @param {string} subject 
   * @param {string} chapter 
   * @param {string} concept 
   * @param {number} mrp 
   * @param {number} sellPrice 
   */
  static async updateMockTestPrice(standard, subject, chapter, concept, mrp, sellPrice) {
    if (!mrp) throw new Error("MRP Cannot be null")
    if (!sellPrice) throw new Error("sellPrice Cannot be null")
    var queries = []
    if (standard) {
      queries.push(Query.equal("standardId", standard));
    } else {
      queries.push(Query.isNull("standardId"));
    }

    if (subject) {
      queries.push(Query.equal("subjectId", subject));
    } else {
      queries.push(Query.isNull("subjectId"));
    }

    if (chapter) {
      queries.push(Query.equal("chapterId", chapter));
    } else {
      queries.push(Query.isNull("chapterId"));
    }

    if (concept) {
      queries.push(Query.equal("conceptId", concept));
    } else {
      queries.push(Query.isNull("conceptId"));
    }

    const x = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestPriceTag,
      queries
    ))

    if (x.total === 0) {
      // create
      await databases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.mockTestPriceTag,
        ID.unique(),
        {
          standardId: standard,
          subjectId: subject,
          chapterId: chapter,
          conceptId: concept,
          mrp: mrp,
          sell_price: sellPrice
        }
      )
    } else {
      // update
      await databases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.databases.mockTestPriceTag,
        x.documents[0].$id,
        {
          mrp: mrp,
          sell_price: sellPrice
        }
      )
    }
  }

  static async getMockTestPrice(standard, subject, chapter, concept) {
    var queries = []
    if (standard) {
      queries.push(Query.equal("standardId", standard));
    } else {
      queries.push(Query.isNull("standardId"));
    }

    if (subject) {
      queries.push(Query.equal("subjectId", subject));
    } else {
      queries.push(Query.isNull("subjectId"));
    }

    if (chapter) {
      queries.push(Query.equal("chapterId", chapter));
    } else {
      queries.push(Query.isNull("chapterId"));
    }

    if (concept) {
      queries.push(Query.equal("conceptId", concept));
    } else {
      queries.push(Query.isNull("conceptId"));
    }

    const x = (await databases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.databases.mockTestPriceTag,
      queries
    ))

    if (x.total === 0) {
      // create
      return { mrp: '', sellPrice: '' };
    } else {
      // update
      return { mrp: x.documents[0].mrp, sellPrice: x.documents[0].sell_price };
    }
  }
}