import { Helmet } from "react-helmet-async";
import { Container, Button, Stack } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { Fragment } from "react";
import FilterView from "sections/@dashboard/management/content/layout/filter-view/FilterView";
import { APPWRITE_API } from "config-global";
import { useNavigate } from "react-router-dom";
import Iconify from "components/iconify";

export default function QuestionListPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  return (
    <Fragment>
      <Helmet>
        <title>Question: List | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
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

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate(PATH_DASHBOARD.question.bulkImport)}
          >
            Bulk Import
          </Button>
        </Stack>

        <FilterView collection={APPWRITE_API.collections.questions} />
      </Container>
    </Fragment>
  );
}
