import { Chip } from "@mui/material";
import Iconify from "components/iconify";
import MockTestListTable from "sections/@dashboard/management/content/mock-test/component/MockTestListTable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";
import { useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { APPWRITE_API } from "config-global";

export default function QuestionMockTestList({ mockTestList }) {
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
          color="info"
          icon={<Iconify icon="solar:test-tube-bold" color="#e81f1f" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <MockTestListTable data={mockTestList} searchId={searchId} />
      </AccordionDetails>
    </Accordion>
  );
}
