import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardActionArea,
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
  Skeleton,
  Stack,
} from "@mui/material";
import Image from "../../../../components/image/Image";
import ReactKatex from "@pkasila/react-katex";
import { useEffect, useState } from "react";
import { Question } from "../../../../auth/Question";
import Iconify from "../../../../components/iconify/Iconify";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useSnackbar } from "../../../../components/snackbar";
import PermissionDeniedComponent from "../../../_examples/PermissionDeniedComponent";
import { appwriteFunctions } from "../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../config-global";
import { LoadingButton } from "@mui/lab";

export default function QuestionRowComponent({ question }) {
  const navigate = useNavigate();

  const [coverQuestion, setCoverQuestion] = useState();
  const [coverOptionA, setCoverOptionA] = useState();
  const [coverOptionB, setCoverOptionB] = useState();
  const [coverOptionC, setCoverOptionC] = useState();
  const [coverOptionD, setCoverOptionD] = useState();
  const [coverAnswer, setCoverAnswer] = useState();
  const [published, setPublished] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);

  const { userProfile } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        var data;
        setPublished(question?.published);

        data = await Question.getQuestionContentForPreview(
          question?.coverQuestion
        );
        setCoverQuestion(data);

        data = await Question.getQuestionContentForPreview(
          question?.coverOptionA
        );
        setCoverOptionA(data);

        data = await Question.getQuestionContentForPreview(
          question?.coverOptionB
        );
        setCoverOptionB(data);

        data = await Question.getQuestionContentForPreview(
          question?.coverOptionC
        );
        setCoverOptionC(data);

        data = await Question.getQuestionContentForPreview(
          question?.coverOptionD
        );
        setCoverOptionD(data);

        data = await Question.getQuestionContentForPreview(
          question?.coverAnswer
        );
        setCoverAnswer(data);

        setIsDataLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, [question]);

  const publishQuestion = async () => {
    setPublishing(true);
    try {
      await appwriteFunctions.createExecution(
        APPWRITE_API.functions.publishQuestion,
        JSON.stringify({ questionId: question.$id, userId: userProfile.$id })
      );
      setOpenPublishDialog(false);
      question = { ...question, published: true };
      setPublished(true);
      enqueueSnackbar("Published Successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setPublishing(false);
  };

  if (isDataLoading) {
    return (
      <>
        <Divider>
          <Chip label={question?.$id} />
        </Divider>

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
          <Divider>
            <Chip label="Answer" />
          </Divider>
          <Skeleton sx={{ m: 2 }} variant="rounded" height={60} />
        </Card>
      </>
    );
  }

  return (
    <>
      <Divider>
        <Chip label={question?.qnId} />
      </Divider>

      <Card sx={{ m: 1 }}>
        <CardActionArea
          onClick={() => navigate(PATH_DASHBOARD.question.view(question?.$id))}
          disabled={!window.location.toString().match("list")}
        >
          <CardHeader
            title={<ReactKatex>{question?.contentQuestion || ""}</ReactKatex>}
          ></CardHeader>
          <CardContent>
            {question?.coverQuestion && (
              <Image
                disabledEffect
                alt="Question"
                src={coverQuestion}
                sx={{ borderRadius: 1, ml: 2, width: 300 }}
              />
            )}

            <Divider>
              <Chip label="Options" />
            </Divider>

            <Grid container>
              <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                <Alert
                  variant={
                    question?.answerOption?.includes("A")
                      ? "filled"
                      : "outlined"
                  }
                  severity={
                    question?.answerOption?.includes("A") ? "success" : "info"
                  }
                  icon={<Iconify icon="mdi:alphabet-a-box" />}
                  sx={{ m: 0.5 }}
                >
                  <Stack direction="column">
                    <ReactKatex>{question?.contentOptionA || ""}</ReactKatex>
                    {question?.coverOptionA && (
                      <Image
                        disabledEffect
                        alt="option A"
                        src={coverOptionA}
                        sx={{ borderRadius: 1, ml: 2, width: 400 }}
                      />
                    )}
                  </Stack>
                </Alert>
              </Grid>

              <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                <Alert
                  variant={
                    question?.answerOption?.includes("B")
                      ? "filled"
                      : "outlined"
                  }
                  severity={
                    question?.answerOption?.includes("B") ? "success" : "info"
                  }
                  icon={<Iconify icon="mdi:alphabet-b-box" />}
                  sx={{ m: 0.5 }}
                >
                  <Stack direction="column">
                    <ReactKatex>{question?.contentOptionB || ""}</ReactKatex>
                    {question?.coverOptionB && (
                      <Image
                        disabledEffect
                        alt="option B"
                        src={coverOptionB}
                        sx={{ borderRadius: 1, ml: 2, width: 400 }}
                      />
                    )}
                  </Stack>
                </Alert>
              </Grid>

              <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                <Alert
                  variant={
                    question?.answerOption?.includes("C")
                      ? "filled"
                      : "outlined"
                  }
                  severity={
                    question?.answerOption?.includes("C") ? "success" : "info"
                  }
                  icon={<Iconify icon="mdi:alphabet-c-box" />}
                  sx={{ m: 0.5 }}
                >
                  <Stack direction="column">
                    <ReactKatex>{question?.contentOptionC || ""}</ReactKatex>
                    {question?.coverOptionC && (
                      <Image
                        disabledEffect
                        alt="option C"
                        src={coverOptionC}
                        sx={{ borderRadius: 1, ml: 2, width: 400 }}
                      />
                    )}
                  </Stack>
                </Alert>
              </Grid>

              <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                <Alert
                  variant={
                    question?.answerOption?.includes("D")
                      ? "filled"
                      : "outlined"
                  }
                  severity={
                    question?.answerOption?.includes("D") ? "success" : "info"
                  }
                  icon={<Iconify icon="mdi:alphabet-d-box" />}
                  sx={{ m: 0.5 }}
                >
                  <Stack direction="column">
                    <ReactKatex>{question?.contentOptionD || ""}</ReactKatex>
                    {question?.coverOptionD && (
                      <Image
                        disabledEffect
                        alt="option D"
                        src={coverOptionD}
                        sx={{ borderRadius: 1, ml: 2, width: 400 }}
                      />
                    )}
                  </Stack>
                </Alert>
              </Grid>
            </Grid>

            <Divider>
              <Chip label="Answer" />
            </Divider>

            <Alert severity="warning" sx={{ m: 0.5 }} icon={false}>
              <ReactKatex>{question?.contentAnswer || ""}</ReactKatex>
              {question?.coverAnswer && (
                <Image
                  disabledEffect
                  alt="Question"
                  src={coverAnswer}
                  sx={{ borderRadius: 1, ml: 2, width: 300 }}
                />
              )}
            </Alert>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {published ? (
            <Button
              size="small"
              startIcon={<Iconify icon="icon-park-solid:correct" />}
              disabled
              color="success"
            >
              Published
            </Button>
          ) : (
            <Button
              size="small"
              startIcon={<Iconify icon="ic:round-publish" />}
              onClick={() => setOpenPublishDialog(true)}
            >
              Publish
            </Button>
          )}

          {!published && (
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.question.edit(question?.$id)}
              size="small"
              color="warning"
              startIcon={<Iconify icon="ic:baseline-edit" />}
            >
              Edit
            </Button>
          )}
        </CardActions>
      </Card>

      <Dialog
        open={openPublishDialog}
        onClose={() => setOpenPublishDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {userProfile.createTeam ? (
          <>
            <DialogTitle id="alert-dialog-title">
              Are you sure to Publish it?
            </DialogTitle>
            <DialogContent>
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
          </>
        ) : (
          <DialogContent>
            <PermissionDeniedComponent />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
