import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import UsersListComponent from "sections/@dashboard/management/admin/team/UsersListComponent";

export default function TeamListPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <Fragment>
      <Helmet>
        <title>Team: List | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Teams"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Team" },
          ]}
        />

        <UsersListComponent />
      </Container>
    </Fragment>
  );
}
