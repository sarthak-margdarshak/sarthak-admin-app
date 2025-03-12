import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import FilterView from "sections/@dashboard/management/content/layout/filter-view/FilterView";
import { useSettingsContext } from "components/settings";
import { APPWRITE_API } from "config-global";

export default function MockTestListPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <Fragment>
      <Helmet>
        <title> Mock Test: List | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Mock Test"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Mock Test",
            },
          ]}
        />

        <FilterView collection={APPWRITE_API.collections.mockTest} />
      </Container>
    </Fragment>
  );
}
