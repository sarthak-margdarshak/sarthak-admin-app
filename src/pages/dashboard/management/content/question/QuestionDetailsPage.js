import { Helmet } from "react-helmet-async";
import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { Fragment, useEffect, useState } from "react";
import QuestionRowComponent from "sections/@dashboard/management/content/question/component/QuestionRowComponent";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import Iconify from "components/iconify";

export default function QuestionDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const [searchParams] = useSearchParams();
  const { loadSearchList, searchList } = useContent();
  const navigate = useNavigate();
  const location = useLocation();

  const [questionId, setQuestionId] = useState(location.pathname.split("/")[3]);
  const [index, setIndex] = useState(-1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const searchId = searchParams.get("searchId");
  let idList = {};
  if (searchId && searchList[searchId] !== undefined) {
    idList = searchList[searchId];
  }

  useEffect(() => {
    const id = location.pathname.split("/")[3];
    if (searchId && searchList[searchId] !== undefined) {
      setIndex(idList?.list?.findIndex((item) => item === id));
      setQuestionId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Fragment>
      <Helmet>
        <title>Question: View | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <Grid container>
          <Grid item xs={index !== -1 ? 10 : 12}>
            <CustomBreadcrumbs
              heading="View Question"
              links={[
                {
                  name: "Dashboard",
                  href: PATH_DASHBOARD.root,
                },
                {
                  name: "Question",
                  href: PATH_DASHBOARD.question.list,
                },
                {
                  name: questionId,
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
                        PATH_DASHBOARD.question.view(idList.list[index - 1]) +
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
                        PATH_DASHBOARD.question.view(idList?.list[index + 1]) +
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

        <QuestionRowComponent questionId={questionId} />
      </Container>
    </Fragment>
  );
}
