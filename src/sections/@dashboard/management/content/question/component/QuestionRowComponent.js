import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "components/image/Image";
import ReactKatex from "@pkasila/react-katex";
import { Fragment, useEffect, useState } from "react";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Query } from "appwrite";
import SarthakUserDisplayUI from "sections/@dashboard/management/admin/user/SarthakUserDisplayUI";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router-dom";
import { labels, sarthakAPIPath } from "assets/data";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ebebeb",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function QuestionRowComponent({
  questionId,
  defaultExpanded = true,
  showImages = true,
  showAnswer = true,
}) {
  const { questionsData, updateQuestion } = useContent();
  let question = questionsData[questionId];

  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      setIsDataLoading(true);
      if (question === undefined) {
        await updateQuestion(questionId);
      } else {
        const isChanged =
          (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.questions,
              questionId,
              [Query.select("$updatedAt")]
            )
          ).$updatedAt !== question.$updatedAt;
        if (isChanged) {
          await updateQuestion(questionId);
        }
      }
      setIsDataLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const publishQuestion = async () => {
    setPublishing(true);
    try {
      const x = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({ questionId: question.$id }),
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
          <Divider>
            <Chip label="Answer" />
          </Divider>
          <Skeleton sx={{ m: 2 }} variant="rounded" height={60} />
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
                  question?.qnId +
                  " (" +
                  timeAgo.format(Date.parse(question?.lastSynced)) +
                  ")"
                }
                color="primary"
                icon={<Iconify icon="solar:question-square-bold-duotone" />}
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
          <ReactKatex>{question?.contentQuestion || ""}</ReactKatex>

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
                    <ReactKatex>
                      {question?.contentOptions[index] || ""}
                    </ReactKatex>
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
              <Divider>
                <Chip
                  label="Answer"
                  variant="outlined"
                  color="warning"
                  icon={<Iconify icon="simple-icons:answer" />}
                />
              </Divider>

              <Alert severity="warning" sx={{ m: 0.5 }} icon={false}>
                <ReactKatex>{question?.contentAnswer || ""}</ReactKatex>
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

          {defaultExpanded && (
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <Tooltip title={expanded ? "Show Less" : "Show More"}>
                <ExpandMoreIcon />
              </Tooltip>
            </ExpandMore>
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
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Divider>
                <Chip
                  label="Metadata"
                  variant="outlined"
                  icon={<Iconify icon="vscode-icons:file-type-eas-metadata" />}
                />
              </Divider>

              <Grid container sx={{ mt: 2 }} spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Index →</Typography>
                      <Typography>
                        {question.standard.standard +
                          " 🢒 " +
                          question.subject.subject +
                          " 🢒 " +
                          question.chapter.chapter +
                          " 🢒 " +
                          question.concept.concept}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>System Generated Id →</Typography>
                      <Typography>{questionId}</Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Sarthak Id →</Typography>
                      <Typography>{question.qnId}</Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Status →</Typography>
                      <Typography>
                        {question.published ? "Published" : "Draft"}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Created By →</Typography>
                      <SarthakUserDisplayUI userId={question.creator} />
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Created At →</Typography>
                      <Tooltip title={question?.$createdAt}>
                        <Typography>
                          {timeAgo.format(Date.parse(question?.$createdAt))}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Updated By →</Typography>
                      <SarthakUserDisplayUI userId={question.updater} />
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography>Updated At →</Typography>
                      <Tooltip title={question?.$updatedAt}>
                        <Typography>
                          {timeAgo.format(Date.parse(question?.$updatedAt))}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Item>
                </Grid>

                {question.published && (
                  <Fragment>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography>Approved By →</Typography>
                          <SarthakUserDisplayUI userId={question.approver} />
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography>Approved At →</Typography>
                          <Tooltip title={question?.approvedAt}>
                            <Typography>
                              {timeAgo.format(Date.parse(question?.approvedAt))}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </Item>
                    </Grid>
                  </Fragment>
                )}
              </Grid>

              <Divider sx={{ m: 1 }}>
                <Chip label="Mock Tests" />
              </Divider>

              {/*TODO: Add mock test details */}
            </CardContent>
          </Collapse>
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
