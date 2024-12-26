import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useReducer } from "react";
import { appwriteDatabases } from "../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../config-global";
import { ProviderHelper } from "./ProviderHelper";

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
  questionData: null,
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
  updateStandardName: async () => {},
  updateSubjectName: async () => {},
  updateChapterName: async () => {},
  updateConceptName: async () => {},
};

const reducer = (state, action) => {
  if (action.type === "UPDATE") {
    return {
      ...state,
      standardsData: action.payload.standardsData,
    };
  }
  return state;
};

export const ViewContext = createContext(initialState);

QuestionTreeViewProvider.propTypes = {
  children: PropTypes.node,
};

export function QuestionTreeViewProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadStandard = useCallback(async () => {
    const tempStandardsData = await ProviderHelper.fetchStandards(
      state.standardsData
    );
    dispatch({
      type: "UPDATE",
      payload: {
        standardsData: tempStandardsData,
      },
    });
  }, [state.standardsData]);

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

  const refreshStandard = useCallback(async () => {
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
  }, [state]);

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

  const updateStandardName = useCallback(async (standardId) => {}, []);
  const updateSubjectName = useCallback(async (subjectId) => {}, []);
  const updateChapterName = useCallback(async (chapterId) => {}, []);
  const updateConceptName = useCallback(async (conceptId) => {}, []);

  const memoizedValue = useMemo(
    () => ({
      standardsData: state.standardsData,
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
      updateStandardName,
      updateSubjectName,
      updateChapterName,
      updateConceptName,
    }),
    [
      state.standardsData,
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
      updateStandardName,
      updateSubjectName,
      updateChapterName,
      updateConceptName,
    ]
  );

  return (
    <ViewContext.Provider value={memoizedValue}>
      {children}
    </ViewContext.Provider>
  );
}
