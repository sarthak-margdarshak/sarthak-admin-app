import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { Fragment } from "react";
import FilterView from "sections/@dashboard/management/content/layout/filter-view/FilterView";
import { APPWRITE_API } from "config-global";

export default function QuestionListPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <Fragment>
      <Helmet>
        <title>Question: List | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Question"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Questions",
            },
          ]}
        />

        <FilterView collection={APPWRITE_API.collections.questions} />
      </Container>
    </Fragment>
  );
}
