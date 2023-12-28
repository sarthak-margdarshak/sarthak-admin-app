import { Button, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { useSettingsContext } from "../../../../../components/settings";
import Iconify from "../../../../../components/iconify";
import { Link as RouterLink } from 'react-router-dom';

export default function ListByStandard() {
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
            },
            {
              name: 'Standards'
            }
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.mockTest.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Mock-Test
            </Button>
          }
        />

      </Container>
    </>
  )
}