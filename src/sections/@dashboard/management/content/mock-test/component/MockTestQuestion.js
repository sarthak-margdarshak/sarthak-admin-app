import { Chip } from "@mui/material";
import Iconify from "components/iconify";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { APPWRITE_API } from "config-global";
import QuestionListTable from "sections/@dashboard/management/content/question/component/QuestionListTable";

export default function MockTestQuestion({ questionList }) {
  const { addSearchList } = useContent();
  const [searchId] = useState(crypto.randomUUID());

  useEffect(() => {
    const save = async () => {
      await addSearchList(
        searchId,
        questionList,
        questionList?.length,
        APPWRITE_API.collections.questions,
        null
      );
    };
    save().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Accordion>
      <AccordionSummary>
        <Chip
          label={"Questions (" + questionList?.length + ")"}
          color="success"
          icon={<Iconify icon="fluent-color:chat-bubbles-question-16" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <QuestionListTable data={questionList} searchId={searchId} />
      </AccordionDetails>
    </Accordion>
  );
}
