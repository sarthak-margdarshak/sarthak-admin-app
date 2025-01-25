import { Helmet } from "react-helmet-async";
import {Container} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import {Fragment} from "react";
import QuestionEditForm from "sections/@dashboard/management/content/question/component/QuestionEditForm";

export default function QuestionEditPage() {
  const { themeStretch } = useSettingsContext();

  const questionId = window.location.pathname.split("/")[3];

  return (
    <Fragment>
      <Helmet>
        <title> Question: Edit | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Edit Question"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Question",
              href: PATH_DASHBOARD.question.list,
            },
          ]}
        />

        <QuestionEditForm questionId={questionId} />
      </Container>
    </Fragment>
  );
}
