import {
  Alert,
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useSettingsContext } from "../../../../components/settings";
import React, { forwardRef, useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import ReactKatex from "@pkasila/react-katex";
import Image from "../../../../components/image/Image";
import Iconify from "../../../../components/iconify";
import { APPWRITE_API } from "../../../../config-global";
import { ID, Permission, Query, Role } from "appwrite";
import { AppwriteHelper } from "../../../../auth/AppwriteHelper";
import StandardDisplayUI from "../../../../sections/@dashboard/question/view/StandardDisplayUI";
import SubjectDisplayUI from "../../../../sections/@dashboard/question/view/SubjectDisplayUI";
import ChapterDisplayUI from "../../../../sections/@dashboard/question/view/ChapterDisplayUI";
import ConceptDisplayUI from "../../../../sections/@dashboard/question/view/ConceptDisplayUI";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Question } from "../../../../auth/Question";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { appwriteDatabases } from "../../../../auth/AppwriteContext";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MockTestNewPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { sarthakInfoData, userProfile } = useAuthContext();
  const [dragStarted, setDragStarted] = useState(false);
  const [mockTestDriverList, setMockTestDriverList] = useState([]);
  const [mockTestDriverId, setMockTestDriverId] = useState("");
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [mockTestName, setMockTestName] = useState("");
  const [description, setDescription] = useState("");
  const [mockTestId, setMockTestId] = useState("");
  const [duration, setDuration] = useState(0);
  const [dialogeOpen, setDialogeOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const [changingDriver, setChangingDriver] = useState(false);
  const [level, setLevel] = useState("MEDIUM");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const x = await getMockTestDriverList();
      setMockTestDriverList(x);
    };
    fetchData();
  }, [setMockTestDriverList]);

  const getMockTestDriverList = async () => {
    var queries = [Query.limit(100), Query.orderDesc("$createdAt")];
    const x = await AppwriteHelper.listAllDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTestDriver,
      queries
    );
    return x;
  };

  const changeDriver = async (event) => {
    if (event.target.value !== mockTestDriverId) {
      setCurrentValue(event.target.value);
      setConfirmDialogOpen(true);
    }
  };

  const initiateChangeDriver = async () => {
    setChangingDriver(true);
    try {
      setMockTestDriverId(currentValue);
      const x = mockTestDriverList.findIndex(
        (value) => value.mtdId === currentValue
      );
      setStandards(mockTestDriverList[x].standardIds);
      setSubjects(mockTestDriverList[x].subjectIds);
      setChapters(mockTestDriverList[x].chapterIds);
      setConcepts(mockTestDriverList[x].conceptIds);
      var queries = [Query.equal("published", true)];
      if (mockTestDriverList[x].standardIds.length) {
        queries.push(
          Query.equal("standardId", mockTestDriverList[x].standardIds)
        );
      }
      if (mockTestDriverList[x].subjectIds.length) {
        queries.push(
          Query.equal("subjectId", mockTestDriverList[x].subjectIds)
        );
      }
      if (mockTestDriverList[x].chapterIds.length) {
        queries.push(
          Query.equal("chapterId", mockTestDriverList[x].chapterIds)
        );
      }
      if (mockTestDriverList[x].conceptIds.length) {
        queries.push(
          Query.equal("conceptId", mockTestDriverList[x].conceptIds)
        );
      }
      var y = await AppwriteHelper.listAllDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        queries
      );
      for (let i in y) {
        y[i].coverQuestion = await Question.getQuestionContentForPreview(
          y[i]?.coverQuestion
        );

        y[i].coverOptionA = await Question.getQuestionContentForPreview(
          y[i]?.coverOptionA
        );

        y[i].coverOptionB = await Question.getQuestionContentForPreview(
          y[i]?.coverOptionB
        );

        y[i].coverOptionC = await Question.getQuestionContentForPreview(
          y[i]?.coverOptionC
        );

        y[i].coverOptionD = await Question.getQuestionContentForPreview(
          y[i]?.coverOptionD
        );

        y[i].coverAnswer = await Question.getQuestionContentForPreview(
          y[i]?.coverAnswer
        );
      }
      setAllQuestions(y);
      setSelectedQuestions([]);
      setConfirmDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setChangingDriver(false);
  };

  const onsubmit = async () => {
    setCreating(true);
    const questions = selectedQuestions.map((value) => value?.$id);
    try {
      const x =
        (
          await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.mockTest,
            [Query.limit(1)]
          )
        ).total + 1;
      const id = "MT" + x.toString().padStart(8, 0);
      setMockTestId(id);

      const y = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        ID.unique(),
        {
          name: mockTestName,
          description: description,
          questions: questions,
          mockTestDriverId: mockTestDriverId,
          mtId: id,
          duration: parseInt(duration),
          level: level,
          createdBy: userProfile.$id,
          updatedBy: userProfile.$id,
        },
        [Permission.update(Role.team(sarthakInfoData.adminTeamId))]
      );
      setMockTestId(id);
      enqueueSnackbar("Successfully Created");
      navigate(PATH_DASHBOARD.mockTest.view(y.$id));
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setCreating(false);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title> Mock-Test | New</title>
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
              name: "new",
            },
          ]}
          action={
            <LoadingButton
              loading={creating}
              variant="contained"
              onClick={onsubmit}
            >
              Create
            </LoadingButton>
          }
        />

        <Paper
          variant="outlined"
          sx={{
            p: 1,
            my: 1,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4} padding={1}>
              <FormControl fullWidth>
                <InputLabel id="mock-test-driver-select">
                  Mock Test Driver Id
                </InputLabel>
                <Select
                  labelId="mock-test-driver-select"
                  id="mock-test-driver-select"
                  value={mockTestDriverId}
                  label="Mock Test Driver Id"
                  onChange={changeDriver}
                >
                  {mockTestDriverList.map((value) => (
                    <MenuItem key={value.$id} value={value.mtdId}>
                      {value.mtdId}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Pick the Id of driver. Look at the list page to get the id.
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
              <Stack direction="column">
                <Typography variant="subtitle1">Standards</Typography>
                {mockTestDriverId !== "" && standards.length === 0 ? (
                  <Typography variant="body2">All</Typography>
                ) : (
                  standards.map((value) => (
                    <StandardDisplayUI key={value} id={value} />
                  ))
                )}
              </Stack>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
              <Stack direction="column">
                <Typography variant="subtitle1">Subjects</Typography>
                {mockTestDriverId !== "" && subjects.length === 0 ? (
                  <Typography variant="body2">All</Typography>
                ) : (
                  subjects.map((value) => (
                    <SubjectDisplayUI key={value} id={value} />
                  ))
                )}
              </Stack>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
              <Stack direction="column">
                <Typography variant="subtitle1">Chapters</Typography>
                {mockTestDriverId !== "" && chapters.length === 0 ? (
                  <Typography variant="body2">All</Typography>
                ) : (
                  chapters.map((value) => (
                    <ChapterDisplayUI key={value} id={value} />
                  ))
                )}
              </Stack>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
              <Stack direction="column">
                <Typography variant="subtitle1">Concepts</Typography>
                {mockTestDriverId !== "" && concepts.length === 0 ? (
                  <Typography variant="body2">All</Typography>
                ) : (
                  concepts.map((value) => (
                    <ConceptDisplayUI key={value} id={value} />
                  ))
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Grid container>
              <Grid item xs={12} sm={12} md={9} lg={9} xl={9} padding={1}>
                <TextField
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  id="mock-test-name"
                  label="Mock Test Name"
                  value={mockTestName}
                  onChange={(event) => setMockTestName(event.target.value)}
                  helperText="Enter a unique name"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3} padding={1}>
                <FormControl fullWidth>
                  <InputLabel id="mock-test-level">Level</InputLabel>
                  <Select
                    fullWidth
                    labelId="mock-test-level"
                    id="mock-test-level"
                    value={level}
                    label="Level"
                    onChange={(event) => setLevel(event.target.value)}
                  >
                    <MenuItem value="EASY">EASY</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="HARD">HARD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>
                <TextField
                  fullWidth
                  disabled
                  id="mock-test-id"
                  label="Mock Test Id"
                  value={mockTestId}
                  helperText="This is auto generated."
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>
                <TextField
                  fullWidth
                  id="mock-test-duration"
                  label="Duration"
                  type="number"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  helperText="Enter time in minute"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} padding={1}>
            <TextField
              fullWidth
              multiline
              rows={5.3}
              inputProps={{ maxLength: 500 }}
              id="mock-test-description"
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              helperText="Describe this mock test"
            />
          </Grid>
        </Grid>

        <Divider>
          <Chip label="Questions" />
        </Divider>
        <Reorder.Group
          values={selectedQuestions}
          onReorder={setSelectedQuestions}
          as="ol"
        >
          {selectedQuestions.map((question) => (
            <Reorder.Item
              value={question}
              key={question.$id}
              onDragStart={() => setDragStarted(true)}
              onDragEnd={() => setDragStarted(false)}
            >
              <Card sx={{ m: 1, cursor: dragStarted ? "grabbing" : "grab" }}>
                <Divider sx={{ mt: 1 }}>
                  <Chip label={question?.qnId} />
                </Divider>
                <CardHeader
                  title={
                    <ReactKatex>{question?.contentQuestion || ""}</ReactKatex>
                  }
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
                          question?.answerOption?.includes("A")
                            ? "success"
                            : "info"
                        }
                        icon={<Iconify icon="mdi:alphabet-a-box" />}
                        sx={{ m: 0.5 }}
                      >
                        <Stack direction="column">
                          <ReactKatex>
                            {question?.contentOptionA || ""}
                          </ReactKatex>
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
                          question?.answerOption?.includes("B")
                            ? "success"
                            : "info"
                        }
                        icon={<Iconify icon="mdi:alphabet-b-box" />}
                        sx={{ m: 0.5 }}
                      >
                        <Stack direction="column">
                          <ReactKatex>
                            {question?.contentOptionB || ""}
                          </ReactKatex>
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
                          question?.answerOption?.includes("C")
                            ? "success"
                            : "info"
                        }
                        icon={<Iconify icon="mdi:alphabet-c-box" />}
                        sx={{ m: 0.5 }}
                      >
                        <Stack direction="column">
                          <ReactKatex>
                            {question?.contentOptionC || ""}
                          </ReactKatex>
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
                          question?.answerOption?.includes("D")
                            ? "success"
                            : "info"
                        }
                        icon={<Iconify icon="mdi:alphabet-d-box" />}
                        sx={{ m: 0.5 }}
                      >
                        <Stack direction="column">
                          <ReactKatex>
                            {question?.contentOptionD || ""}
                          </ReactKatex>
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
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <Button
          fullWidth
          variant="outlined"
          sx={{ height: 200 }}
          onClick={() => setDialogeOpen(true)}
        >
          Add / Remove Questions
        </Button>

        <Dialog
          fullScreen
          open={dialogeOpen}
          scroll="body"
          onClose={() => setDialogeOpen(false)}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "sticky" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDialogeOpen(false)}
                aria-label="close"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Pick questions
              </Typography>
            </Toolbar>
          </AppBar>
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              my: 1,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Grid container>
              <Grid item xs={12} sm={12} md={10} lg={10} xl={10} padding={1}>
                {allQuestions.map((question) => (
                  <div key={question?.$id}>
                    <Divider>
                      <Chip label={question?.qnId} />
                    </Divider>

                    <Card sx={{ m: 1 }}>
                      <CardHeader
                        title={
                          <ReactKatex>
                            {question?.contentQuestion || ""}
                          </ReactKatex>
                        }
                        action={
                          <Checkbox
                            defaultChecked={
                              selectedQuestions.findIndex(
                                (value) => value?.$id === question?.$id
                              ) !== -1
                            }
                            onChange={(event) => {
                              var y = selectedQuestions;
                              if (event.target.checked) {
                                y.push(question);
                              } else {
                                const x = y.findIndex(
                                  (value) => value?.$id === question?.$id
                                );
                                y.splice(x, 1);
                              }
                              setSelectedQuestions(y);
                            }}
                          />
                        }
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
                                question?.answerOption?.includes("A")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-a-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <Stack direction="column">
                                <ReactKatex>
                                  {question?.contentOptionA || ""}
                                </ReactKatex>
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
                                question?.answerOption?.includes("B")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-b-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <Stack direction="column">
                                <ReactKatex>
                                  {question?.contentOptionB || ""}
                                </ReactKatex>
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
                                question?.answerOption?.includes("C")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-c-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <Stack direction="column">
                                <ReactKatex>
                                  {question?.contentOptionC || ""}
                                </ReactKatex>
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
                                question?.answerOption?.includes("D")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-d-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <Stack direction="column">
                                <ReactKatex>
                                  {question?.contentOptionD || ""}
                                </ReactKatex>
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
                  </div>
                ))}
              </Grid>
              <Divider orientation="vertical" flexItem />
            </Grid>
          </Paper>
        </Dialog>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Please Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure, you want to change driver id? If you click ok, you
              will loose currently saved questions.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <LoadingButton onClick={() => setConfirmDialogOpen(false)}>
              Disagree
            </LoadingButton>
            <LoadingButton
              loading={changingDriver}
              onClick={initiateChangeDriver}
              autoFocus
            >
              Agree
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  );
}
