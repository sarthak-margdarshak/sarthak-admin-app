import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useSettingsContext } from "../../../../components/settings";
import { useEffect, useState } from "react";
import ReactKatex from "@pkasila/react-katex";
import Image from "../../../../components/image/Image";
import Iconify from "../../../../components/iconify";
import { APPWRITE_API } from "../../../../config-global";
import { Query } from "appwrite";
import StandardDisplayUI from "../../../../sections/@dashboard/question/view/StandardDisplayUI";
import SubjectDisplayUI from "../../../../sections/@dashboard/question/view/SubjectDisplayUI";
import ChapterDisplayUI from "../../../../sections/@dashboard/question/view/ChapterDisplayUI";
import ConceptDisplayUI from "../../../../sections/@dashboard/question/view/ConceptDisplayUI";
import { useSnackbar } from "notistack";
import {
  appwriteDatabases,
  appwriteFunctions,
} from "../../../../auth/AppwriteContext";
import { Link as RouterLink } from "react-router-dom";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { LoadingButton } from "@mui/lab";
import PermissionDeniedComponent from "../../../../sections/_examples/PermissionDeniedComponent";
import { Question } from "../../../../auth/Question";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { SarthakUserDisplayUI } from "../../../../sections/@dashboard/user/profile";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function MockTestViewPage() {
  const id = window.location.pathname.split("/")[3];

  const { themeStretch } = useSettingsContext();
  const { userProfile } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [mockTest, setMockTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        var x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          id
        );
        var mtd = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTestDriver,
          [Query.equal("mtdId", x.mockTestDriverId)]
        );
        x.mockTestDriverId = mtd.documents[0];
        var questions = [];
        for (let i in x.questions) {
          var qus = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.questions,
            x.questions[i]
          );
          qus.coverQuestion = await Question.getQuestionContentForPreview(
            qus?.coverQuestion
          );

          qus.coverOptionA = await Question.getQuestionContentForPreview(
            qus?.coverOptionA
          );

          qus.coverOptionB = await Question.getQuestionContentForPreview(
            qus?.coverOptionB
          );

          qus.coverOptionC = await Question.getQuestionContentForPreview(
            qus?.coverOptionC
          );

          qus.coverOptionD = await Question.getQuestionContentForPreview(
            qus?.coverOptionD
          );

          qus.coverAnswer = await Question.getQuestionContentForPreview(
            qus?.coverAnswer
          );
          questions.push(qus);
        }
        x.questions = questions;
        setMockTest(x);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
      setLoading(false);
    };
    fetchData();
  }, [id, enqueueSnackbar]);

  const publishMockTest = async () => {
    setPublishing(true);
    try {
      await appwriteFunctions.createExecution(
        APPWRITE_API.functions.publishMockTest,
        JSON.stringify({
          mockTestId: id,
          userId: userProfile.$id,
        })
      );
      setOpenPublishDialog(false);
      setMockTest({
        ...mockTest,
        published: true,
        publishedBy: userProfile.$id,
        publishedAt: new Date(),
      });
      enqueueSnackbar("Published Successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setPublishing(false);
  };

  return (
    <>
      <Helmet>
        <title>{"Mock-Test : View | " + mockTest?.mtId}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Mock-Test"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Mock-Test",
              href: PATH_DASHBOARD.mockTest.root,
            },
            {
              name: mockTest?.name,
            },
          ]}
          action={
            !loading && (
              <>
                {mockTest?.published ? (
                  <Alert
                    icon={<Iconify icon="icon-park-solid:correct" />}
                    severity="success"
                    variant="standard"
                    sx={{ m: 1 }}
                  >
                    Published
                  </Alert>
                ) : (
                  <Button
                    startIcon={<Iconify icon="ic:round-publish" />}
                    variant="outlined"
                    sx={{ m: 1 }}
                    onClick={() => setOpenPublishDialog(true)}
                  >
                    Publish
                  </Button>
                )}
                {!mockTest?.published && (
                  <Button
                    startIcon={<Iconify icon="ic:baseline-edit" />}
                    variant="contained"
                    sx={{ m: 1 }}
                    to={PATH_DASHBOARD.mockTest.edit(mockTest?.$id)}
                    component={RouterLink}
                  >
                    Edit
                  </Button>
                )}
              </>
            )
          }
        />

        {loading ? (
          <Skeleton height={400} />
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              my: 1,
              mb: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={12} md={2.3} lg={2.3} xl={2.3} padding={1}>
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Mock Test Driver Id -
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                    }}
                  >
                    {mockTest?.mockTestDriverId.mtdId}
                  </Typography>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Standards -
                  </Typography>
                  {mockTest?.mockTestDriverId.standardIds.map((value) => (
                    <StandardDisplayUI key={value} id={value} />
                  ))}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Subjects -
                  </Typography>
                  {mockTest?.mockTestDriverId.subjectIds.map((value) => (
                    <SubjectDisplayUI key={value} id={value} />
                  ))}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Chapters -
                  </Typography>
                  {mockTest?.mockTestDriverId.chapterIds.map((value) => (
                    <ChapterDisplayUI key={value} id={value} />
                  ))}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Concepts -
                  </Typography>
                  {mockTest?.mockTestDriverId.conceptIds.map((value) => (
                    <ConceptDisplayUI key={value} id={value} />
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ m: 1 }} />

            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9}>
                <Stack direction="column" sx={{ m: 2 }}>
                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                    >
                      Created By -
                    </Typography>
                    <SarthakUserDisplayUI userId={mockTest?.createdBy} />
                  </Stack>

                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                      variant="subtitle2"
                    >
                      Created At -
                    </Typography>
                    <Tooltip
                      title={new Date(mockTest?.$createdAt).toUTCString()}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textDecorationLine: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {timeAgo.format(new Date(mockTest?.$createdAt))}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9}>
                <Stack direction="column" sx={{ m: 2 }}>
                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                      variant="subtitle2"
                    >
                      Updated By -
                    </Typography>
                    <SarthakUserDisplayUI userId={mockTest?.updatedBy} />
                  </Stack>

                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                      variant="subtitle2"
                    >
                      Updated At -
                    </Typography>
                    <Tooltip
                      title={new Date(mockTest?.$updatedAt).toUTCString()}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textDecorationLine: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {timeAgo.format(new Date(mockTest?.$updatedAt))}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9}>
                {mockTest.published && (
                  <Stack direction="column" sx={{ m: 2 }}>
                    <Stack direction="row" sx={{ alignSelf: "center" }}>
                      <Typography
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                        variant="subtitle2"
                      >
                        Published By -
                      </Typography>
                      <SarthakUserDisplayUI userId={mockTest?.publishedBy} />
                    </Stack>

                    <Stack direction="row" sx={{ alignSelf: "center" }}>
                      <Typography
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                        variant="subtitle2"
                      >
                        Published At -
                      </Typography>
                      <Tooltip
                        title={new Date(mockTest?.publishedAt).toUTCString()}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            textDecorationLine: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {timeAgo.format(new Date(mockTest?.publishedAt))}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Stack>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ m: 1 }} />

            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={5.9}
                    lg={5.9}
                    xl={5.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Mock Test Name -
                      </Typography>
                      <Typography variant="body2">{mockTest?.name}</Typography>
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={5.9}
                    lg={5.9}
                    xl={5.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Level -
                      </Typography>
                      <Typography variant="body2">{mockTest?.level}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ m: 1 }} />

                <Grid container>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={5.9}
                    lg={5.9}
                    xl={5.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Mock Test Id -
                      </Typography>
                      <Typography variant="body2">{mockTest?.mtId}</Typography>
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={5.9}
                    lg={5.9}
                    xl={5.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Duration -
                      </Typography>
                      <Typography variant="body2">
                        {mockTest?.duration}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs={12} sm={12} md={5.9} lg={5.9} xl={5.9} padding={1}>
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mr: 1,
                      textDecorationLine: "underline",
                    }}
                  >
                    Description -
                  </Typography>
                  <Typography variant="body2">
                    {mockTest?.description}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Divider>
          <Chip label="Questions" />
        </Divider>

        {mockTest?.questions?.map((question) => (
          <Card sx={{ m: 1 }} key={question?.$id}>
            <Divider sx={{ mt: 1 }}>
              <Chip label={question?.qnId} />
            </Divider>
            <CardHeader
              title={<ReactKatex>{question?.contentQuestion || ""}</ReactKatex>}
            ></CardHeader>
            <CardContent>
              {question?.coverQuestion && (
                <Image
                  disabledEffect
                  alt="Question"
                  src={question?.coverQuestion}
                  sx={{ borderRadius: 1, ml: 2, width: 300 }}
                />
              )}

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
                          src={question?.coverOptionA}
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
                          src={question?.coverOptionB}
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
                          src={question?.coverOptionC}
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
                          src={question?.coverOptionD}
                          sx={{ borderRadius: 1, ml: 2, width: 400 }}
                        />
                      )}
                    </Stack>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Container>

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
                If you click AGREE, mock-test will be published. After that
                there won't be any edit entertained. You can click DISAGREE, if
                you feel that the mock-test is not ready to be published.
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
                onClick={publishMockTest}
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
