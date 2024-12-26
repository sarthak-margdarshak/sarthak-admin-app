import { Button } from "@mui/material";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { useQuestionTreeViewContext } from "./useQuestionTreeViewContext";

export default function QuestionBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
  questionId,
}) {
  const { standardsData } = useQuestionTreeViewContext();
  const questionData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId].concepts.documents[conceptId].questions.documents[
      questionId
    ];

  return (
    <Button
      fullWidth
      variant="outlined"
      style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 105 }}
      color="info"
      startIcon={<StickyNote2Icon />}
      onClick={async () => console.log("Open this question")}
    >
      {questionData.qnId}
    </Button>
  );
}
