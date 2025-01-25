import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import React from "react";
import QuestionRowComponent from "sections/@dashboard/management/content/question/component/QuestionRowComponent";

export default function QuestionDetailsPage() {
  const { themeStretch } = useSettingsContext();

  const questionId = window.location.pathname.split("/")[3];

  return (
    <React.Fragment>
      <Helmet>
        <title>Question: View | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Question"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Question",
              href: PATH_DASHBOARD.question.list,
            },
            {
              name: questionId,
            },
          ]}
        />

        <QuestionRowComponent questionId={questionId} />
      </Container>
    </React.Fragment>
  );
}
