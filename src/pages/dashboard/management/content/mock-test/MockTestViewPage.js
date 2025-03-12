import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useSettingsContext } from "components/settings";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import MockTestRowComponent from "sections/@dashboard/management/content/mock-test/component/MockTestRowComponent";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Iconify from "components/iconify";

export default function MockTestViewPage() {
  const { themeStretch } = useSettingsContext();
  const [searchParams] = useSearchParams();
  const { loadSearchList, searchList } = useContent();
  const navigate = useNavigate();
  const location = useLocation();

  const [mockTestId, setMockTestId] = useState(location.pathname.split("/")[3]);
  const [index, setIndex] = useState(-1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const searchId = searchParams.get("searchId");
  let idList = {};
  if (searchId && searchList[searchId] !== undefined) {
    idList = searchList[searchId];
  }

  useEffect(() => {
    const id = location.pathname.split("/")[3];
    setMockTestId(id);
    if (searchId && searchList[searchId] !== undefined) {
      setIndex(idList?.list?.findIndex((item) => item === id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
                  {index + 1 + " of " + idList?.total}
                </Typography>

                {loadingNextPage ? (
                  <Iconify icon="line-md:loading-loop" width={40} />
                ) : (
                  <IconButton
                    disabled={index === 0}
                    onClick={() =>
                      navigate(
                        PATH_DASHBOARD.mockTest.view(idList.list[index - 1]) +
                          window.location.search,
                        { replace: true }
                      )
                    }
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                )}

                {loadingNextPage ? (
                  <Iconify icon="line-md:loading-loop" width={40} />
                ) : (
                  <IconButton
                    disabled={index === idList?.total - 1}
                    onClick={async () => {
                      if (idList?.list?.length - 1 === index) {
                        setLoadingNextPage(true);
                        await loadSearchList(
                          searchId,
                          idList?.query,
                          idList?.collection
                        );
                        setLoadingNextPage(false);
                      }
                      idList = searchList[searchId];
                      navigate(
                        PATH_DASHBOARD.mockTest.view(idList.list[index + 1]) +
                          window.location.search,
                        { replace: true }
                      );
                    }}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                )}
              </Stack>
            </Grid>
          )}
        </Grid>

        <MockTestRowComponent mockTestId={mockTestId} />
      </Container>
    </Fragment>
  );
}
