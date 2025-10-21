import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useReducer } from "react";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { ProviderHelper } from "sections/@dashboard/management/content/hook/ProviderHelper";
import { ID, Query } from "appwrite";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import { labels } from "assets/data";

const initialState = {
  // index
  bookIndexList: {
    standards: [],
    total: -1,
  },
  getBookIndex: async () => {},

  // dock
  dockOpen: localStorage.getItem("dockOpen")
    ? localStorage.getItem("dockOpen") === "1"
    : false,
  updateDock: () => {},

  // standard
  loadStandard: async () => {},
  addStandard: async () => {},
  deleteStandard: async () => {},

  // subject
  loadSubject: async () => {},
  addSubject: async () => {},
  deleteSubject: async () => {},

  // Chapters
  loadChapter: async () => {},
  addChapter: async () => {},
  deleteChapter: async () => {},

  // Concepts
  loadConcept: async () => {},
  addConcept: async () => {},
  deleteConcept: async () => {},

  // Search Lists
  searchList: {},
  loadSearchList: async () => {},
  addSearchList: async () => {},

  // Questions
  getQuestion: async () => {},

  // Mock Tests
  getMockTest: async () => {},

  // Products
  getProduct: async () => {},
};

const reducer = (state, action) => {
  if (action.type === "INDEX_UPDATE") {
    return {
      ...state,
      bookIndexList: action.payload.bookIndexList,
    };
  } else if (action.type === "DOCK_UPDATE") {
    return {
      ...state,
      dockOpen: action.payload.dockOpen,
    };
  } else if (action.type === "SEARCH_LIST_UPDATE") {
    return {
      ...state,
      searchList: action.payload.searchList,
    };
  }
  return state;
};

export const ContentContext = createContext(initialState);

ContentProvider.propTypes = {
  children: PropTypes.node,
};

export function ContentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
  );

  const isFounder = user?.labels?.some((label) => label === labels.founder);

  const getBookIndex = useCallback(async (bookIndexId) => {
    return await ProviderHelper.downloadBookIndex(bookIndexId);
  }, []);

  const updateDock = useCallback((status) => {
    localStorage.setItem("dockOpen", status ? "1" : "0");
    dispatch({
      type: "DOCK_UPDATE",
      payload: {
        dockOpen: status,
      },
    });
  }, []);

  const loadStandard = useCallback(async () => {
    const tempBookIndexList = await ProviderHelper.fetchStandards(
      state.bookIndexList
    );
    dispatch({
      type: "INDEX_UPDATE",
      payload: {
        bookIndexList: tempBookIndexList,
      },
    });
  }, [state.bookIndexList]);

  const addStandard = useCallback(
    async (standardName) => {
      if (!isAdminOrFounder) {
        enqueueSnackbar("Only Admins and Founders can add standards", {
          variant: "error",
        });
        return;
      }
      if (
        standardName.trim() === "" ||
        standardName === null ||
        standardName === undefined
      ) {
        enqueueSnackbar("Standard name cannot be empty", {
          variant: "error",
        });
        return;
      }
      try {
        const x = await appwriteDatabases.createDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          ID.unique(),
          {
            standard: standardName,
          }
        );

        state.bookIndexList.standards.unshift({
          $id: x.$id,
          subjects: [],
          total: -1,
        });
        state.bookIndexList.total = state.bookIndexList.total + 1;

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: state.bookIndexList,
          },
        });
        enqueueSnackbar(
          "Standard [ " + standardName + " ] successfully created."
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isAdminOrFounder, enqueueSnackbar, state.bookIndexList]
  );

  const deleteStandard = useCallback(
    async (standardId, standardName) => {
      try {
        let tempBookIndexList = { ...state.bookIndexList };
        if (!isFounder) {
          enqueueSnackbar("Only Founders can delete standards", {
            variant: "error",
          });
          return;
        }

        const standardIndex = tempBookIndexList.standards.findIndex(
          (value) => value.$id === standardId
        );

        if (standardIndex === -1) {
          enqueueSnackbar("Standard not found", { variant: "error" });
          return;
        }

        if (!(await ProviderHelper.canIndexBeDeleted(standardId))) {
          enqueueSnackbar(
            "Standard cannot be deleted. It is referenced in some content.",
            { variant: "error" }
          );
          return;
        }

        await appwriteDatabases.deleteDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          standardId
        );

        tempBookIndexList.standards.splice(standardIndex, 1);
        tempBookIndexList.total = tempBookIndexList.total - 1;

        const bookIndexLocalKey = `bookIndex_${standardId}`;
        if (localStorage.getItem(bookIndexLocalKey)) {
          localStorage.removeItem(bookIndexLocalKey);
        }

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: tempBookIndexList,
          },
        });
        enqueueSnackbar(
          "Standard [ " + standardName + " ] successfully deleted."
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isFounder, enqueueSnackbar, state.bookIndexList]
  );

  const loadSubject = useCallback(
    async (standardId) => {
      const tempBookIndexList = await ProviderHelper.fetchSubjects(
        state.bookIndexList,
        standardId
      );
      dispatch({
        type: "INDEX_UPDATE",
        payload: {
          bookIndexList: tempBookIndexList,
        },
      });
    },
    [state.bookIndexList]
  );

  const addSubject = useCallback(
    async (subjectName, standardId) => {
      if (!isAdminOrFounder) {
        enqueueSnackbar("Only Admins and Founders can add subjects", {
          variant: "error",
        });
        return;
      }
      if (
        subjectName.trim() === "" ||
        subjectName === null ||
        subjectName === undefined
      ) {
        enqueueSnackbar("Subject name cannot be empty", {
          variant: "error",
        });
        return;
      }
      try {
        const x = await appwriteDatabases.createDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          ID.unique(),
          {
            standard: standardId,
            subject: subjectName,
          }
        );

        // Find the standard index
        const standardIndex = state.bookIndexList.standards.findIndex(
          (value) => value.$id === standardId
        );

        state.bookIndexList.standards[standardIndex].subjects.unshift({
          $id: x.$id,
          chapters: [],
          total: -1,
        });
        state.bookIndexList.standards[standardIndex].total =
          state.bookIndexList.standards[standardIndex].total + 1;

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: state.bookIndexList,
          },
        });
        enqueueSnackbar(
          "Subject [ " + subjectName + " ] successfully created."
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isAdminOrFounder, enqueueSnackbar, state.bookIndexList]
  );

  const deleteSubject = useCallback(
    async (subjectId, subjectName) => {
      try {
        let tempBookIndexList = { ...state.bookIndexList };
        if (!isFounder) {
          enqueueSnackbar("Only Founders can delete subjects", {
            variant: "error",
          });
          return;
        }

        let subjectIndex = -1;
        const standardIndex = tempBookIndexList.standards.findIndex((value) => {
          const x = value.subjects.findIndex((sub) => sub.$id === subjectId);
          if (x !== -1) {
            subjectIndex = x;
          }
          return x !== -1;
        });

        if (standardIndex === -1) {
          enqueueSnackbar("Subject not found", { variant: "error" });
          return;
        }

        if (subjectIndex === -1) {
          enqueueSnackbar("Subject not found", { variant: "error" });
          return;
        }

        if (!(await ProviderHelper.canIndexBeDeleted(subjectId))) {
          enqueueSnackbar(
            "Subject cannot be deleted. It is referenced in some content.",
            { variant: "error" }
          );
          return;
        }

        await appwriteDatabases.deleteDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          subjectId
        );

        tempBookIndexList.standards[standardIndex].subjects.splice(
          subjectIndex,
          1
        );
        tempBookIndexList.standards[standardIndex].total =
          tempBookIndexList.standards[standardIndex].total - 1;

        const bookIndexLocalKey = `bookIndex_${subjectId}`;
        if (localStorage.getItem(bookIndexLocalKey)) {
          localStorage.removeItem(bookIndexLocalKey);
        }

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: tempBookIndexList,
          },
        });
        enqueueSnackbar(
          "Subject [ " + subjectName + " ] successfully deleted."
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isFounder, enqueueSnackbar, state.bookIndexList]
  );

  const loadChapter = useCallback(
    async (standardId, subjectId) => {
      const tempBookIndexList = await ProviderHelper.fetchChapters(
        state.bookIndexList,
        standardId,
        subjectId
      );
      dispatch({
        type: "INDEX_UPDATE",
        payload: {
          bookIndexList: tempBookIndexList,
        },
      });
    },
    [state.bookIndexList]
  );

  const addChapter = useCallback(
    async (chapterName, standardId, subjectId) => {
      if (!isAdminOrFounder) {
        enqueueSnackbar("Only Admins and Founders can add chapters", {
          variant: "error",
        });
        return;
      }
      if (
        chapterName.trim() === "" ||
        chapterName === null ||
        chapterName === undefined
      ) {
        enqueueSnackbar("Chapter name cannot be empty", {
          variant: "error",
        });
        return;
      }
      try {
        const x = await appwriteDatabases.createDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          ID.unique(),
          {
            standard: standardId,
            subject: subjectId,
            chapter: chapterName,
          }
        );

        // Find the standard and subject indexes
        const standardIndex = state.bookIndexList.standards.findIndex(
          (value) => value.$id === standardId
        );
        const subjectIndex = state.bookIndexList.standards[
          standardIndex
        ].subjects.findIndex((value) => value.$id === subjectId);

        state.bookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].chapters.unshift({
          $id: x.$id,
          concepts: [],
          total: -1,
        });
        state.bookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].total =
          state.bookIndexList.standards[standardIndex].subjects[subjectIndex]
            .total + 1;

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: state.bookIndexList,
          },
        });
        enqueueSnackbar(
          "Chapter [ " + chapterName + " ] successfully created."
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isAdminOrFounder, enqueueSnackbar, state.bookIndexList]
  );

  const deleteChapter = useCallback(
    async (chapterId, chapterName) => {
      try {
        let tempBookIndexList = { ...state.bookIndexList };
        if (!isFounder) {
          enqueueSnackbar("Only Founders can delete chapters", {
            variant: "error",
          });
          return;
        }

        let subjectIndex = -1;
        let chapterIndex = -1;
        const standardIndex = tempBookIndexList.standards.findIndex((value) => {
          const x = value.subjects.findIndex((sub) => {
            const y = sub.chapters.findIndex((ch) => ch.$id === chapterId);
            if (y !== -1) {
              chapterIndex = y;
            }
            return y !== -1;
          });
          if (x !== -1) {
            subjectIndex = x;
          }
          return x !== -1;
        });

        if (standardIndex === -1) {
          enqueueSnackbar("Chapter not found", { variant: "error" });
          return;
        }

        if (subjectIndex === -1) {
          enqueueSnackbar("Chapter not found", { variant: "error" });
          return;
        }

        if (chapterIndex === -1) {
          enqueueSnackbar("Chapter not found", { variant: "error" });
          return;
        }

        if (!(await ProviderHelper.canIndexBeDeleted(chapterId))) {
          enqueueSnackbar(
            "Chapter cannot be deleted. It is referenced in some content.",
            { variant: "error" }
          );
          return;
        }

        await appwriteDatabases.deleteDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          chapterId
        );

        tempBookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].chapters.splice(chapterIndex, 1);
        tempBookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].total =
          tempBookIndexList.standards[standardIndex].subjects[subjectIndex]
            .total - 1;

        const bookIndexLocalKey = `bookIndex_${chapterId}`;
        if (localStorage.getItem(bookIndexLocalKey)) {
          localStorage.removeItem(bookIndexLocalKey);
        }

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: tempBookIndexList,
          },
        });
        enqueueSnackbar("Chapter " + chapterName + " successfully deleted.");
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isFounder, enqueueSnackbar, state.bookIndexList]
  );

  const loadConcept = useCallback(
    async (standardId, subjectId, chapterId) => {
      const tempBookIndexList = await ProviderHelper.fetchConcepts(
        state.bookIndexList,
        standardId,
        subjectId,
        chapterId
      );
      dispatch({
        type: "INDEX_UPDATE",
        payload: {
          bookIndexList: tempBookIndexList,
        },
      });
    },
    [state.bookIndexList]
  );

  const addConcept = useCallback(
    async (conceptName, standardId, subjectId, chapterId) => {
      if (!isAdminOrFounder) {
        enqueueSnackbar("Only Admins and Founders can add concepts", {
          variant: "error",
        });
        return;
      }
      if (
        conceptName.trim() === "" ||
        conceptName === null ||
        conceptName === undefined
      ) {
        enqueueSnackbar("Concept name cannot be empty", {
          variant: "error",
        });
        return;
      }
      try {
        const x = await appwriteDatabases.createDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          ID.unique(),
          {
            standard: standardId,
            subject: subjectId,
            chapter: chapterId,
            concept: conceptName,
          }
        );

        // Find the standard, subject and chapter indexes
        const standardIndex = state.bookIndexList.standards.findIndex(
          (value) => value.$id === standardId
        );
        const subjectIndex = state.bookIndexList.standards[
          standardIndex
        ].subjects.findIndex((value) => value.$id === subjectId);
        const chapterIndex = state.bookIndexList.standards[
          standardIndex
        ].subjects[subjectIndex].chapters.findIndex(
          (value) => value.$id === chapterId
        );

        state.bookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].chapters[chapterIndex].concepts.unshift({
          $id: x.$id,
        });
        state.bookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].chapters[chapterIndex].total =
          state.bookIndexList.standards[standardIndex].subjects[subjectIndex]
            .chapters[chapterIndex].total + 1;

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: state.bookIndexList,
          },
        });
        enqueueSnackbar(
          "Concept [ " + conceptName + " ] successfully created."
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isAdminOrFounder, enqueueSnackbar, state.bookIndexList]
  );

  const deleteConcept = useCallback(
    async (conceptId, conceptName) => {
      try {
        let tempBookIndexList = { ...state.bookIndexList };
        if (!isFounder) {
          enqueueSnackbar("Only Founders can delete concepts", {
            variant: "error",
          });
          return;
        }

        let subjectIndex = -1;
        let chapterIndex = -1;
        let conceptIndex = -1;
        const standardIndex = tempBookIndexList.standards.findIndex((value) => {
          const x = value.subjects.findIndex((sub) => {
            const y = sub.chapters.findIndex((ch) => {
              const z = ch.concepts.findIndex((con) => con.$id === conceptId);
              if (z !== -1) {
                conceptIndex = z;
              }
              return z !== -1;
            });
            if (y !== -1) {
              chapterIndex = y;
            }
            return y !== -1;
          });
          if (x !== -1) {
            subjectIndex = x;
          }
          return x !== -1;
        });

        if (standardIndex === -1) {
          enqueueSnackbar("Concept not found", { variant: "error" });
          return;
        }

        if (subjectIndex === -1) {
          enqueueSnackbar("Concept not found", { variant: "error" });
          return;
        }

        if (chapterIndex === -1) {
          enqueueSnackbar("Concept not found", { variant: "error" });
          return;
        }

        if (conceptIndex === -1) {
          enqueueSnackbar("Concept not found", { variant: "error" });
          return;
        }

        if (!(await ProviderHelper.canIndexBeDeleted(conceptId))) {
          enqueueSnackbar(
            "Concept cannot be deleted. It is referenced in some content.",
            { variant: "error" }
          );
          return;
        }

        await appwriteDatabases.deleteDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          conceptId
        );

        tempBookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].chapters[chapterIndex].concepts.splice(conceptIndex, 1);
        tempBookIndexList.standards[standardIndex].subjects[
          subjectIndex
        ].chapters[chapterIndex].total =
          tempBookIndexList.standards[standardIndex].subjects[subjectIndex]
            .chapters[chapterIndex].total - 1;

        const bookIndexLocalKey = `bookIndex_${conceptId}`;
        if (localStorage.getItem(bookIndexLocalKey)) {
          localStorage.removeItem(bookIndexLocalKey);
        }

        dispatch({
          type: "INDEX_UPDATE",
          payload: {
            bookIndexList: tempBookIndexList,
          },
        });
        enqueueSnackbar("Concept " + conceptName + " successfully deleted.");
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [isFounder, enqueueSnackbar, state.bookIndexList]
  );

  const loadSearchList = useCallback(
    async (searchId, queries, collection) => {
      if (state.searchList[searchId] !== undefined) {
        const data = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          state.searchList[searchId].collection,
          [
            ...state.searchList[searchId].query,
            Query.cursorAfter(
              state.searchList[searchId].list[
                state.searchList[searchId].list.length - 1
              ]
            ),
            Query.select("$id"),
          ]
        );

        const list = state.searchList[searchId].list.concat(
          data.documents.map((d) => d.$id)
        );

        addSearchList(
          searchId,
          list,
          data.total,
          state.searchList[searchId].collection,
          state.searchList[searchId].query
        );
      } else {
        const data = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          collection,
          [...queries, Query.select("$id")]
        );

        const list = data.documents.map((d) => d.$id);

        addSearchList(searchId, list, data.total, collection, queries);
      }

      return searchId;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.searchList]
  );

  const addSearchList = useCallback(
    (id, list, total, collection, query) => {
      state.searchList[id] = {
        list: list,
        total: total,
        collection: collection,
        query: query,
      };
      dispatch({
        type: "SEARCH_LIST_UPDATE",
        payload: {
          searchList: state.searchList,
        },
      });
    },
    [state.searchList]
  );

  const getQuestion = useCallback(async (questionId) => {
    let question = null;
    const questionLocalKey = `question_${questionId}`;
    if (localStorage.getItem(questionLocalKey)) {
      let changeDetected = await ProviderHelper.detectChangeInQuestion(
        questionId
      );
      if (changeDetected) {
        question = await ProviderHelper.downloadQuestion(questionId);
      } else {
        question = JSON.parse(localStorage.getItem(questionLocalKey));
      }
    } else {
      question = await ProviderHelper.downloadQuestion(questionId);
    }

    return question;
  }, []);

  const getMockTest = useCallback(async (mockTestId) => {
    let mockTest = null;
    const mockTestLocalKey = `mockTest_${mockTestId}`;
    if (localStorage.getItem(mockTestLocalKey)) {
      let changeDetected = await ProviderHelper.detectChangeInMockTest(
        mockTestId
      );
      if (changeDetected) {
        mockTest = await ProviderHelper.downloadMockTest(mockTestId);
      } else {
        mockTest = JSON.parse(localStorage.getItem(mockTestLocalKey));
      }
    } else {
      mockTest = await ProviderHelper.downloadMockTest(mockTestId);
    }

    return mockTest;
  }, []);

  const getProduct = useCallback(async (productId) => {
    let product = null;
    const productLocalKey = `product_${productId}`;

    if (localStorage.getItem(productLocalKey)) {
      let changeDetected = await ProviderHelper.detectChangeInProduct(
        productId
      );
      if (changeDetected) {
        product = await ProviderHelper.downloadProduct(productId);
      } else {
        product = JSON.parse(localStorage.getItem(productLocalKey));
      }
    } else {
      product = await ProviderHelper.downloadProduct(productId);
    }

    return product;
  }, []);

  const memoizedValue = useMemo(
    () => ({
      bookIndexList: state.bookIndexList,
      getBookIndex,
      dockOpen: state.dockOpen,
      updateDock,
      loadStandard,
      addStandard,
      deleteStandard,
      loadSubject,
      addSubject,
      deleteSubject,
      loadChapter,
      addChapter,
      deleteChapter,
      loadConcept,
      addConcept,
      deleteConcept,
      searchList: state.searchList,
      loadSearchList,
      addSearchList,
      getQuestion,
      getMockTest,
      getProduct,
    }),
    [
      state.bookIndexList,
      getBookIndex,
      state.dockOpen,
      updateDock,
      loadStandard,
      addStandard,
      deleteStandard,
      loadSubject,
      addSubject,
      deleteSubject,
      loadChapter,
      addChapter,
      deleteChapter,
      loadConcept,
      addConcept,
      deleteConcept,
      state.searchList,
      loadSearchList,
      addSearchList,
      getQuestion,
      getMockTest,
      getProduct,
    ]
  );

  return (
    <ContentContext.Provider value={memoizedValue}>
      {children}
    </ContentContext.Provider>
  );
}
