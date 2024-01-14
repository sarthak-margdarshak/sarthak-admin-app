import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useSettingsContext } from "../../../../components/settings";
import CreateMockTestModel from "../../../../sections/@dashboard/mock-test/CreateMockTestModel";

export default function MockTestNewPage() {

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Mock-Test: List | Standard</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mock-Test"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Mock-Test',
              href: PATH_DASHBOARD.mockTest.root,
            },
            {
              name: 'New'
            }
          ]}
        />

        <CreateMockTestModel />

      </Container>
    </>
  )
}