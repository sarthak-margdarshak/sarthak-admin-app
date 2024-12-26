import { useContext } from "react";
//
import { ViewContext } from "./QuestionTreeViewProvider";

export const useQuestionTreeViewContext = () => {
  const context = useContext(ViewContext);

  if (!context)
    throw new Error(
      "useQuestionTreeViewContext context must be use inside QuestionTreeViewProvider"
    );

  return context;
};
