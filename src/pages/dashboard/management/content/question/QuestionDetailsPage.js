import { Helmet } from "react-helmet-async";
import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { Fragment, useEffect, useState } from "react";
import QuestionRowComponent from "sections/@dashboard/management/content/question/component/QuestionRowComponent";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function QuestionDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const { searchList } = useContent();
  const navigate = useNavigate();

  const location = useLocation();
  const [questionId, setQuestionId] = useState(location.pathname.split("/")[3]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const id = location.pathname.split("/")[3];
    setIndex(searchList.findIndex((item) => item.$id === id));
    setQuestionId(id);
  }, [location.pathname, searchList]);

  return (
    <Fragment>
      <Helmet>
        <title>Question: View | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <Grid container>
          <Grid item xs={10}>
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
                  {index + 1 + " of " + searchList.length}
                </Typography>
                <IconButton
                  disabled={index === 0}
                  onClick={() =>
                    navigate(
                      PATH_DASHBOARD.question.view(searchList[index - 1].$id) +
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
                      PATH_DASHBOARD.question.view(searchList[index + 1].$id) +
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

        <QuestionRowComponent questionId={questionId} />
      </Container>
    </Fragment>
  );
}
