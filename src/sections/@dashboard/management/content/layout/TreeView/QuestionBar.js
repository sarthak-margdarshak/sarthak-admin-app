import { Button } from "@mui/material";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { useContent } from "../../hook/useContent";
import {PATH_DASHBOARD} from "../../../../../../routes/paths";
import {useNavigate} from "react-router-dom";

export default function QuestionBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
  questionId,
}) {
  const { standardsData } = useContent();
  const navigate = useNavigate();

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
      onClick={async () => navigate(PATH_DASHBOARD.question.view(questionId))}
    >
      {questionData.qnId}
    </Button>
  );
}
