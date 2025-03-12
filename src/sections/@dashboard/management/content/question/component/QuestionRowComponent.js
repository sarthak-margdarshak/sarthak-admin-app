import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import Image from "components/image/Image";
import ReactKatex from "@pkasila/react-katex";
import React, { Fragment, useEffect, useState } from "react";
import Iconify from "components/iconify/Iconify";
import { useAuthContext } from "auth/useAuthContext";
import { useSnackbar } from "components/snackbar";
import PermissionDeniedComponent from "components/sub-component/PermissionDeniedComponent";
import {
  appwriteDatabases,
  appwriteFunctions,
  timeAgo,
} from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { LoadingButton } from "@mui/lab";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { Query } from "appwrite";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate, useSearchParams } from "react-router-dom";
import { labels, sarthakAPIPath } from "assets/data";
import { Marker } from "react-mark.js";
import QuestionMetadata from "sections/@dashboard/management/content/question/component/QuestionMetadata";
import QuestionMockTestList from "sections/@dashboard/management/content/question/component/QuestionMockTestList";

export default function QuestionRowComponent({
  questionId,
  defaultExpanded = true,
  showImages = true,
  showAnswer = true,
}) {
  const { questionsData, updateQuestion } = useContent();
  let question = questionsData[questionId];

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      if (question === undefined) {
        setIsDataLoading(true);
        await updateQuestion(questionId);
        setIsDataLoading(false);
      } else {
        const isChanged =
          (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.questions,
              questionId,
              [Query.select("$updatedAt")]
            )
          ).$updatedAt !== question?.$updatedAt;
        if (isChanged) {
          setIsDataLoading(true);
          await updateQuestion(questionId);
          setIsDataLoading(false);
        }
      }
      setIsDataLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const publishQuestion = async () => {
    setPublishing(true);
    try {
      const x = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({ questionId: question?.$id }),
        false,
        sarthakAPIPath.question.publish
      );
      const res = JSON.parse(x.responseBody);
      if (res.status === "failed") {
        enqueueSnackbar(res.error, { variant: "error" });
      } else {
        enqueueSnackbar("Published Successfully");
        await fetchData();
      }
      setOpenPublishDialog(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setPublishing(false);
  };

  if (isDataLoading) {
    return (
      <Fragment>
        <Card sx={{ m: 1 }}>
          <Skeleton sx={{ m: 2 }} variant="rounded" height={60} />
          <Divider>
            <Chip label="Options" />
          </Divider>
          <Grid container>
            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            </Grid>
            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            </Grid>
            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            </Grid>
            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            </Grid>
          </Grid>
        </Card>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Card sx={{ m: 1 }}>
        <CardHeader
          title={
            <Divider>
              <Chip
                label={
                  question["qnId"] +
                  " (" +
                  timeAgo.format(
                    Date.parse(
                      question?.lastSynced || "2000-01-01T00:00:00.000+00:00"
                    )
                  ) +
                  ")"
                }
                color="primary"
                icon={<Iconify icon="fluent-color:chat-bubbles-question-16" />}
              />
            </Divider>
          }
          action={
            <Stack direction="row">
              <Tooltip title="Refresh">
                <IconButton
                  aria-label="settings"
                  onClick={async () => {
                    setIsDataLoading(true);
                    await updateQuestion(questionId);
                    setIsDataLoading(false);
                  }}
                >
                  <Iconify
                    icon="solar:refresh-square-bold"
                    color="#ff8164"
                    width={35}
                  />
                </IconButton>
              </Tooltip>
              {question?.published && (
                <Tooltip title="Published">
                  <Image
                    src="/assets/images/certified/published.png"
                    sx={{ width: 50 }}
                    style={{ transform: "rotate(30deg)" }}
                  />
                </Tooltip>
              )}
            </Stack>
          }
        />

        <CardContent>
          <Marker mark={content}>
            <ReactKatex>{question?.contentQuestion || ""}</ReactKatex>
          </Marker>

          {question?.coverQuestion && showImages && (
            <Image
              disabledEffect
              alt="Question"
              src={question?.coverQuestion}
              sx={{ borderRadius: 1, ml: 2, mt: 1, maxWidth: 300 }}
            />
          )}

          <Divider sx={{ m: 1 }}>
            <Chip
              label="Options"
              variant="outlined"
              color="info"
              icon={<Iconify icon="famicons:options" />}
            />
          </Divider>

          <Grid container>
            {question?.contentOptions?.map((option, index) => (
              <Grid item sm={12} xs={12} md={6} lg={6} xl={6} key={index}>
                <Alert
                  variant={
                    question?.answerOptions[index] ? "filled" : "outlined"
                  }
                  severity={question?.answerOptions[index] ? "success" : "info"}
                  icon={
                    <Iconify
                      icon={
                        "mdi:alphabet-" +
                        String.fromCharCode(97 + index) +
                        "-box"
                      }
                    />
                  }
                  sx={{ m: 0.5 }}
                >
                  <Stack direction="column">
                    <Marker mark={content}>
                      <ReactKatex>
                        {question?.contentOptions[index] || ""}
                      </ReactKatex>
                    </Marker>
                    {question?.coverOptions[index] && showImages && (
                      <Image
                        disabledEffect
                        alt="options"
                        src={question?.coverOptions[index]}
                        sx={{ borderRadius: 1, ml: 2, maxWidth: 300 }}
                      />
                    )}
                  </Stack>
                </Alert>
              </Grid>
            ))}
          </Grid>

          {showAnswer && (
            <Fragment>
              <Divider sx={{ mt: 1, mb: 1 }}>
                <Chip
                  label="Answer"
                  variant="outlined"
                  color="warning"
                  icon={<Iconify icon="hugeicons:tick-double-03" />}
                />
              </Divider>

              <Alert severity="warning" sx={{ m: 0.5 }} icon={false}>
                <Marker mark={content}>
                  <ReactKatex>{question?.contentAnswer || ""}</ReactKatex>
                </Marker>
                {question?.coverAnswer && (
                  <Image
                    disabledEffect
                    alt="Question"
                    src={question?.coverAnswer}
                    sx={{ borderRadius: 1, ml: 2, maxWidth: 300 }}
                  />
                )}
              </Alert>
            </Fragment>
          )}
        </CardContent>

        <CardActions disableSpacing>
          {question?.published ? (
            <Tooltip title="Published">
              <Iconify icon="noto:locked" sx={{ m: 1 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Publish">
              <IconButton
                disabled={question?.published}
                onClick={() => setOpenPublishDialog(true)}
              >
                <Iconify icon="ic:round-publish" color="#ff2889" />
              </IconButton>
            </Tooltip>
          )}

          {!question?.published && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() =>
                  navigate(PATH_DASHBOARD.question.edit(questionId))
                }
              >
                <Iconify icon="fluent-color:edit-16" />
              </IconButton>
            </Tooltip>
          )}

          {!defaultExpanded && (
            <Tooltip title={"View"}>
              <IconButton
                onClick={() =>
                  navigate(PATH_DASHBOARD.question.view(questionId))
                }
              >
                <Iconify icon="mage:preview-fill" color="#287cff" />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>

        {defaultExpanded && (
          <CardContent>
            <QuestionMetadata question={question} />

            <QuestionMockTestList mockTestList={question?.mockTest} />
          </CardContent>
        )}
      </Card>

      <Dialog
        open={openPublishDialog}
        onClose={() => setOpenPublishDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogTitle id="alert-dialog-title">
              Are you sure to Publish it?
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText id="alert-dialog-description">
                If you click AGREE, question will be published. After that there
                won't be any edit entertained. You can click DISAGREE, if you
                feel that the question is not needed to be published.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={publishing}
                onClick={() => setOpenPublishDialog(false)}
              >
                Disagree
              </Button>
              <LoadingButton
                loading={publishing}
                onClick={publishQuestion}
                autoFocus
              >
                Agree
              </LoadingButton>
            </DialogActions>
          </Fragment>
        ) : (
          <DialogContent>
            <PermissionDeniedComponent />
          </DialogContent>
        )}
      </Dialog>
    </Fragment>
  );
}
