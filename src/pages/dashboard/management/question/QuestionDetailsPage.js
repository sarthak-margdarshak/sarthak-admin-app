import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// @mui
import { Button, Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import { useSettingsContext } from "../../../../components/settings";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
// sections
import QuestionDetails from "../../../../sections/@dashboard/question/edit/QuestionDetails";
import Iconify from "../../../../components/iconify/Iconify";
import React from "react";

// ----------------------------------------------------------------------

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
          action={
            <Button
              to={PATH_DASHBOARD.question.new}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Question
            </Button>
          }
        />

        <QuestionDetails inComingQuestionId={questionId} />
      </Container>
    </React.Fragment>
  );
}
