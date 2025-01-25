import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useReducer } from "react";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import {ProviderHelper} from "sections/@dashboard/management/content/hook/ProviderHelper";
import {ID} from "appwrite";
import { useSnackbar } from "components/snackbar";
import {Question} from "auth/Question";

const initialState = {
  standardsData: localStorage.getItem("standardsData")
    ? JSON.parse(localStorage.getItem("standardsData"))
    : {
        documents: {},
        total: -1,
        loadedOnce: false,
        lastStandardId: null,
        lastSynced: null,
      },
  dockOpen: true,
  questionsData: localStorage.getItem("questionsData")
    ? JSON.parse(localStorage.getItem("questionsData"))
    : {},
  bookIndex: localStorage.getItem("bookIndex")
    ? JSON.parse(localStorage.getItem("bookIndex"))
    : {},
  getBookIndex: async () => {},
  updateDock: () => {},
  updateQuestion: async () => {},
  loadStandard: async () => {},
  loadSubject: async () => {},
  loadChapter: async () => {},
  loadConcept: async () => {},
  loadQuestions: async () => {},
  loadMockTests: async () => {},
  refreshStandard: async () => {},
  refreshSubject: async () => {},
  refreshChapter: async () => {},
  refreshConcept: async () => {},
  refreshQuestions: async () => {},
  addStandard: async () => {},
  addSubject: async () => {},
  addChapter: async () => {},
  addConcept: async () => {},
};

const reducer = (state, action) => {
  if (action.type === "UPDATE") {
    return {
      ...state,
      standardsData: action.payload.standardsData,
    };
  } else if (action.type === "DOCK_UPDATE") {
    return {
      ...state,
      dockOpen: action.payload.dockOpen,
    }
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
  
  const updateDock = useCallback(
    (status) => {
    dispatch({
      type: "DOCK_UPDATE",
      payload: {
        dockOpen: status,
      },
    });
    },
    []
  );
  
  const getBookIndex = useCallback(
    async (id) => {
      try {
        if (id && id !== "") {
          if (state.bookIndex[id] !== undefined) {
            return state.bookIndex[id];
          }
          const data = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.bookIndex,
            id
          )
          let tmpLabel
          if (data.subject === null && data.chapter === null && data.concept === null) {
            tmpLabel = data.standard;
          } else {
            data.standard = (await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.bookIndex,
              data.standard
            )).standard;

            if (data.chapter === null && data.concept === null) {
              tmpLabel = data.standard + " 🢒 " + data.subject;
            } else {
              data.subject = (await appwriteDatabases.getDocument(
                APPWRITE_API.databaseId,
                APPWRITE_API.collections.bookIndex,
                data.subject
              )).subject;

              if (data.concept === null) {
                tmpLabel = data.standard + " 🢒 " + data.subject + " 🢒 " + data.chapter;
              } else {
                data.chapter = (await appwriteDatabases.getDocument(
                  APPWRITE_API.databaseId,
                  APPWRITE_API.collections.bookIndex,
                  data.chapter
                )).chapter;

                tmpLabel = data.standard + " 🢒 " + data.subject + " 🢒 " + data.chapter + " 🢒 " + data.concept;
              }
            }
          }

          state.bookIndex[id] = tmpLabel;
          const y = JSON.stringify(state.bookIndex);
          localStorage.setItem("bookIndex", y);

          return tmpLabel;
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    },
    [state.bookIndex]
  );
  
  const updateQuestion = useCallback(
    async (questionId) => {
    const question = await appwriteDatabases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId
    )

    if(question?.coverQuestion !== null && question?.coverQuestion !== "") {
      question.coverQuestion = await Question.getQuestionContentForPreview(
        question?.coverQuestion
      );
    }

    const options = []
    for (let i in question?.coverOptions) {
      if(question?.coverOptions[i] !== null && question?.coverOptions[i] !== "") {
        const data = await Question.getQuestionContentForPreview(
          question?.coverOptions[i]
        );
        options.push(data)
      } else {
        options.push(null)
      }
    }
    question.coverOptions = options;

    if(question?.coverAnswer !== null && question?.coverAnswer !== "") {
      question.coverAnswer = await Question.getQuestionContentForPreview(
        question?.coverAnswer
      );
    }
    
    state.questionsData[question.$id] = {
      ...question,
      lastSynced: new Date().toISOString(),
    }

    const y = JSON.stringify(state.questionsData);
    localStorage.setItem("questionsData", y);
    
    dispatch({
      type: "QUESTION_UPDATE",
      payload: {
        questionData: state.questionsData,
      }
    })
  },
    [state.questionsData]
  );

  const loadStandard = useCallback(
    async () => {
    const tempStandardsData = await ProviderHelper.fetchStandards(
      state.standardsData
    );
    dispatch({
      type: "UPDATE",
      payload: {
        standardsData: tempStandardsData,
      },
    });
  },
    [state.standardsData]
  );

  const loadSubject = useCallback(
    async (standardId) => {
      const data = await ProviderHelper.fetchSubjects(
        state.standardsData,
        standardId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: data,
        },
      });
    },
    [state.standardsData]
  );

  const loadChapter = useCallback(
    async (standardId, subjectId) => {
      const data = await ProviderHelper.fetchChapters(
        state.standardsData,
        standardId,
        subjectId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: data,
        },
      });
    },
    [state.standardsData]
  );

  const loadConcept = useCallback(
    async (standardId, subjectId, chapterId) => {
      const data = await ProviderHelper.fetchConcepts(
        state.standardsData,
        standardId,
        subjectId,
        chapterId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: data,
        },
      });
    },
    [state.standardsData]
  );

  const loadQuestions = useCallback(
    async (standardId, subjectId, chapterId, conceptId) => {
      const data = await ProviderHelper.fetchQuestions(
        state.standardsData,
        standardId,
        subjectId,
        chapterId,
        conceptId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: data,
        },
      });
    },
    [state.standardsData]
  );

  const loadMockTests = useCallback(
    async (standardId, subjectId, chapterId, conceptId) => {
      const data = await ProviderHelper.fetchMockTests(
        state.standardsData,
        standardId,
        subjectId,
        chapterId,
        conceptId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: data,
        },
      });
    },
    [state.standardsData]
  );

  const refreshStandard = useCallback(
    async () => {
    state.standardsData = {
      documents: {},
      total: -1,
      loadedOnce: false,
      lastStandardId: null,
      lastSynced: null,
    };
    const tempStandardsData = await ProviderHelper.fetchStandards(
      state.standardsData
    );
    dispatch({
      type: "UPDATE",
      payload: {
        standardsData: tempStandardsData,
      },
    });
  },
    [state]
  );

  const refreshSubject = useCallback(
    async (standardId) => {
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        standardId
      );

      const data = state.standardsData;

      data.documents[standardId] = {
        ...x,
        subjects: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastSubjectId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      };
      const tempStandardsData = await ProviderHelper.fetchSubjects(
        data,
        standardId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: tempStandardsData,
        },
      });
    },
    [state.standardsData]
  );

  const refreshChapter = useCallback(
    async (standardId, subjectId) => {
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        subjectId
      );

      const data = state.standardsData;

      data.documents[standardId].subjects.documents[subjectId] = {
        ...x,
        chapters: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastChapterId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      };
      const tempStandardsData = await ProviderHelper.fetchChapters(
        data,
        standardId,
        subjectId
      );
      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: tempStandardsData,
        },
      });
    },
    [state.standardsData]
  );

  const refreshConcept = useCallback(
    async (standardId, subjectId, chapterId) => {
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        chapterId
      );

      const data = state.standardsData;

      data.documents[standardId].subjects.documents[
        subjectId
      ].chapters.documents[chapterId] = {
        ...x,
        concepts: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastConceptId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      };

      const tempStandardsData = await ProviderHelper.fetchConcepts(
        state.standardsData,
        standardId,
        subjectId,
        chapterId
      );

      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: tempStandardsData,
        },
      });
    },
    [state.standardsData]
  );

  const refreshQuestions = useCallback(
    async (standardId, subjectId, chapterId, conceptId) => {
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        conceptId
      );

      const data = state.standardsData;

      data.documents[standardId].subjects.documents[
        subjectId
      ].chapters.documents[chapterId].concepts.documents[conceptId] = {
        ...x,
        questions: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastQuestionId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      };

      const tempStandardsData = await ProviderHelper.fetchQuestions(
        state.standardsData,
        standardId,
        subjectId,
        chapterId,
        conceptId
      );

      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: tempStandardsData,
        },
      });
    },
    [state.standardsData]
  );

  const addStandard = useCallback(
    async (standardName) => {
    try {
      const x = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        ID.unique(),
        {
          standard: standardName,
        }
      )

      state.standardsData.documents[x.$id] = {
        ...x,
        subjects: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastSubjectId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      };
      state.standardsData.total = state.standardsData.total + 1;
      state.standardsData.loadedOnce = true;
      if (state.standardsData.lastStandardId === null) {
        state.standardsData.lastStandardId = x.$id;
      }
      if (state.standardsData.lastSynced === null) {
        state.standardsData.lastSynced = new Date().toISOString();
      }

      state.standardsData.documents = Object.fromEntries(
        Object.entries(state.standardsData.documents)
          .sort(([, a], [, b]) => b.$createdAt < a.$createdAt ? -1 : 1)
      )

      const y = JSON.stringify(state.standardsData);
      localStorage.setItem("standardsData", y);

      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: state.standardsData,
        },
      });
      enqueueSnackbar("Standard " + standardName + " successfully created.");
    } catch (error) {
      enqueueSnackbar(error.message, {variant: "error"});
    }
  },
    [enqueueSnackbar, state.standardsData]
  );

  const addSubject = useCallback(
    async (subjectName, standardId) => {
    try {
      const x = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        ID.unique(),
        {
          standard: standardId,
          subject: subjectName,
        }
      )

      state.standardsData.documents[standardId].subjects.documents[x.$id] = {
        ...x,
        chapters: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastChapterId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      }

      state.standardsData.documents[standardId].subjects.total = state.standardsData.documents[standardId].subjects.total + 1;
      state.standardsData.documents[standardId].subjects.loadedOnce = true;
      if (state.standardsData.documents[standardId].subjects.lastStandardId === null) {
        state.standardsData.lastStandardId = x.$id;
      }
      if (state.standardsData.documents[standardId].subjects.lastSynced === null) {
        state.standardsData.lastSynced = new Date().toISOString();
      }

      state.standardsData.documents[standardId].subjects.documents = Object.fromEntries(
        Object.entries(state.standardsData.documents[standardId].subjects.documents)
          .sort(([, a], [, b]) => b.$createdAt < a.$createdAt ? -1 : 1)
      )

      const y = JSON.stringify(state.standardsData);
      localStorage.setItem("standardsData", y);

      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: state.standardsData,
        },
      });
      enqueueSnackbar("Subject " + subjectName + " successfully created.");
    } catch (e) {
      enqueueSnackbar(e.message, {variant: "error"});
    }
  },
    [enqueueSnackbar, state.standardsData]
  );
  
  const addChapter = useCallback(
    async (chapterName, standardId, subjectId) => {
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
      )

      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[x.$id] = {
        ...x,
        concepts: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastConceptId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      }

      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.total = state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.total + 1;
      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.loadedOnce = true;
      if (state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.lastStandardId === null) {
        state.standardsData.lastStandardId = x.$id;
      }
      if (state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.lastSynced === null) {
        state.standardsData.lastSynced = new Date().toISOString();
      }

      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents = Object.fromEntries(
        Object.entries(state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents)
          .sort(([, a], [, b]) => b.$createdAt < a.$createdAt ? -1 : 1)
      )

      const y = JSON.stringify(state.standardsData);
      localStorage.setItem("standardsData", y);

      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: state.standardsData,
        },
      });
      enqueueSnackbar("Chapter " + chapterName + " successfully created.");
    } catch (e) {
      enqueueSnackbar(e.message, {variant: "error"});
    }
  },
    [enqueueSnackbar, state.standardsData]
  );
  
  const addConcept = useCallback(
    async (conceptName, standardId, subjectId, chapterId) => {
    try {
      const x = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        ID.unique(),
        {
          standard: standardId,
          subject: subjectId,
          chapter: chapterId,
          concept: conceptName
        }
      )

      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.documents[x.$id] = {
        ...x,
        questions: {
          documents: {},
          total: -1,
          loadedOnce: false,
          lastQuestionId: null,
        },
        mockTests: {
          documents: [],
          total: -1,
          loadedOnce: false,
          lastMockTestId: null,
        },
        lastSynced: new Date().toISOString(),
      }

      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.total = state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.total + 1;
      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.loadedOnce = true;
      if (state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.lastStandardId === null) {
        state.standardsData.lastStandardId = x.$id;
      }
      if (state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.lastSynced === null) {
        state.standardsData.lastSynced = new Date().toISOString();
      }

      state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.documents = Object.fromEntries(
        Object.entries(state.standardsData.documents[standardId].subjects.documents[subjectId].chapters.documents[chapterId].concepts.documents)
          .sort(([, a], [, b]) => b.$createdAt < a.$createdAt ? -1 : 1)
      )

      const y = JSON.stringify(state.standardsData);
      localStorage.setItem("standardsData", y);

      dispatch({
        type: "UPDATE",
        payload: {
          standardsData: state.standardsData,
        },
      });
      enqueueSnackbar("Concept " + conceptName + " successfully created.");
    } catch (e) {
      enqueueSnackbar(e.message, {variant: "error"});
    }
  },
    [enqueueSnackbar, state.standardsData]
  );

  const memoizedValue = useMemo(
    () => ({
      standardsData: state.standardsData,
      dockOpen: state.dockOpen,
      questionsData: state.questionsData,
      bookIndex: state.bookIndex,
      getBookIndex,
      updateDock,
      updateQuestion,
      loadStandard,
      loadSubject,
      loadChapter,
      loadConcept,
      loadQuestions,
      loadMockTests,
      refreshStandard,
      refreshSubject,
      refreshChapter,
      refreshConcept,
      refreshQuestions,
      addStandard,
      addSubject,
      addChapter,
      addConcept,
    }),
    [
      state.standardsData,
      state.dockOpen,
      state.questionsData,
      state.bookIndex,
      getBookIndex,
      updateDock,
      updateQuestion,
      loadStandard,
      loadSubject,
      loadChapter,
      loadConcept,
      loadQuestions,
      loadMockTests,
      refreshStandard,
      refreshSubject,
      refreshChapter,
      refreshConcept,
      refreshQuestions,
      addStandard,
      addSubject,
      addChapter,
      addConcept,
    ]
  );

  return (
    <ContentContext.Provider value={memoizedValue}>
      {children}
    </ContentContext.Provider>
  );
}
