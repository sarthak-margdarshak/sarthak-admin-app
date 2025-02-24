import {Fragment, useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import {PATH_DASHBOARD} from "routes/paths";
import {Container} from "@mui/material";
import {useSettingsContext} from "components/settings";
import {useLocation} from "react-router-dom";
import MockTestEditForm from "sections/@dashboard/management/content/mock-test/component/MockTestEditForm";

export default function MockTestEditPage() {
  const { themeStretch } = useSettingsContext();
  const location = useLocation();
  const [mockTestId, setMockTestId] = useState(location.pathname.split("/")[3]);

  useEffect(() => {
    setMockTestId(location.pathname.split("/")[3]);
  }, [location.pathname]);

  return (
    <Fragment>
      <Helmet>
        <title> Mock Test: Edit | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Edit Mock Test"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Mock Test",
              href: PATH_DASHBOARD.mockTest.root,
            },
            {
              name: mockTestId
            },
          ]}
        />

        <MockTestEditForm mockTestId={mockTestId} />

      </Container>
    </Fragment>
  );
}
