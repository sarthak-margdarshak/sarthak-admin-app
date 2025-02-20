import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { Fragment, useEffect, useState } from "react";
import QuestionEditForm from "sections/@dashboard/management/content/question/component/QuestionEditForm";
import { useLocation } from "react-router-dom";

export default function QuestionEditPage() {
  const { themeStretch } = useSettingsContext();

  const location = useLocation();
  const [questionId, setQuestionId] = useState(location.pathname.split("/")[3]);

  useEffect(() => {
    setQuestionId(location.pathname.split("/")[3]);
  }, [location.pathname]);

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
