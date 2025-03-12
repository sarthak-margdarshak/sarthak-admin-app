import { Chip } from "@mui/material";
import Iconify from "components/iconify";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";
import MockTestListTable from "sections/@dashboard/management/content/mock-test/component/MockTestListTable";
import { useEffect, useState } from "react";
import { APPWRITE_API } from "config-global";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function ProductMockTest({ mockTestList }) {
  const { addSearchList } = useContent();
  const [searchId] = useState(crypto.randomUUID());

  useEffect(() => {
    const save = async () => {
      await addSearchList(
        searchId,
        mockTestList,
        mockTestList?.length,
        APPWRITE_API.collections.mockTest,
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
          label={"Mock Tests (" + mockTestList?.length + ")"}
          color="error"
          icon={<Iconify icon="fluent-color:chat-bubbles-question-16" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <MockTestListTable data={mockTestList} searchId={searchId} />
      </AccordionDetails>
    </Accordion>
  );
}
