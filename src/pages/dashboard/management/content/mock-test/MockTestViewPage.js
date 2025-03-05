import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useSettingsContext } from "components/settings";
import { useLocation, useNavigate } from "react-router-dom";
import MockTestRowComponent from "sections/@dashboard/management/content/mock-test/component/MockTestRowComponent";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function MockTestViewPage() {
  const { themeStretch } = useSettingsContext();
  const { searchList } = useContent();
  const navigate = useNavigate();

  const location = useLocation();
  const [mockTestId, setMockTestId] = useState(location.pathname.split("/")[3]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const id = location.pathname.split("/")[3];
    setIndex(searchList.findIndex((item) => item.$id === id));
    setMockTestId(location.pathname.split("/")[3]);
  }, [location.pathname, searchList]);

  return (
    <Fragment>
      <Helmet>
        <title> Mock Test: View | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <Grid container>
          <Grid item xs={index !== -1 ? 10 : 12}>
            <CustomBreadcrumbs
              heading="View Mock Test"
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
                  name: mockTestId,
                },
              ]}
            />
          </Grid>

          {index !== -1 && (
            <Grid item xs={2}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {index + 1 + " of " + searchList.length}
                </Typography>
                <IconButton
                  disabled={index === 0}
                  onClick={() =>
                    navigate(
                      PATH_DASHBOARD.mockTest.view(searchList[index - 1].$id) +
                        window.location.search,
                      { replace: true }
                    )
                  }
                >
                  <ArrowLeftIcon />
                </IconButton>
                <IconButton
                  disabled={index === searchList.length - 1}
                  onClick={() =>
                    navigate(
                      PATH_DASHBOARD.mockTest.view(searchList[index + 1].$id) +
                        window.location.search,
                      { replace: true }
                    )
                  }
                >
                  <ArrowRightIcon />
                </IconButton>
              </Stack>
            </Grid>
          )}
        </Grid>

        <MockTestRowComponent mockTestId={mockTestId} />
      </Container>
    </Fragment>
  );
}
