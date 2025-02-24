import {useSnackbar} from "notistack";
import { useNavigate } from "react-router-dom";
import React, {forwardRef, Fragment, useEffect, useState} from "react";
import {appwriteDatabases} from "../../../../../../auth/AppwriteContext";
import {APPWRITE_API} from "../../../../../../config-global";
import {Query} from "appwrite";
import {
  Breadcrumbs, Button, Card, Chip, Dialog,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Skeleton, Slide,
  TextField
} from "@mui/material";
import { Reorder } from "framer-motion";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MockTestEditForm({mockTestId}) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [dragStarted, setDragStarted] = useState(false);
  const [mockTest, setMockTest] = useState("");
  const [dialogeOpen, setDialogeOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const update = async () => {
      let x = mockTest;
      setIsDataLoading(true);
      if (x === undefined) {
        // x = await updateQuestion(questionId);
      } else {
        const isChanged =
          (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.mockTest,
              mockTestId,
              [Query.select("$updatedAt")]
            )
          ).$updatedAt !== mockTest.$updatedAt;
        if (isChanged) {
          // x = await updateQuestion(questionId);
        }
      }
      setMockTest(x);
      setIsDataLoading(false);
    };
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  // const onsubmit = async () => {
  //   setSaving(true);
  //   const questions = selectedQuestions.map((value) => value?.$id);
  //   try {
  //     const y = await appwriteDatabases.updateDocument(
  //       APPWRITE_API.databaseId,
  //       APPWRITE_API.collections.mockTest,
  //       id,
  //       {
  //         name: mockTestName,
  //         description: description,
  //         questions: questions,
  //         duration: duration,
  //         level: level,
  //         updatedBy: userProfile.$id,
  //       },
  //       [Permission.update(Role.team(sarthakInfoData.adminTeamId))]
  //     );
  //     setMockTestId(id);
  //     enqueueSnackbar("Successfully Saved");
  //     navigate(PATH_DASHBOARD.mockTest.view(y.$id));
  //   } catch (error) {
  //     console.log(error);
  //     enqueueSnackbar(error.message, { variant: "error" });
  //   }
  //   setSaving(false);
  // };

  if (isDataLoading) {
    return <Skeleton height={150} />
  }

  return (
    <Fragment>
      <Divider />

      {/*<Breadcrumbs sx={{ mb: 1, mt: 1 }}>*/}
      {/*  <Link*/}
      {/*    underline="hover"*/}
      {/*    sx={{ display: "flex", alignItems: "center" }}*/}
      {/*    color="inherit"*/}
      {/*  >*/}
      {/*    {mockTest?.standard?.standard}*/}
      {/*  </Link>*/}
      {/*  <Link*/}
      {/*    underline="hover"*/}
      {/*    sx={{ display: "flex", alignItems: "center" }}*/}
      {/*    color="inherit"*/}
      {/*  >*/}
      {/*    {mockTest?.subject?.subject}*/}
      {/*  </Link>*/}
      {/*  <Link*/}
      {/*    underline="hover"*/}
      {/*    sx={{ display: "flex", alignItems: "center" }}*/}
      {/*    color="inherit"*/}
      {/*  >*/}
      {/*    {mockTest?.chapter?.chapter}*/}
      {/*  </Link>*/}
      {/*  <Link*/}
      {/*    underline="hover"*/}
      {/*    sx={{ display: "flex", alignItems: "center" }}*/}
      {/*    color="inherit"*/}
      {/*  >*/}
      {/*    {mockTest?.concept?.concept}*/}
      {/*  </Link>*/}
      {/*</Breadcrumbs>*/}

      {/*  <Grid container>*/}
      {/*    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>*/}
      {/*      <Grid container>*/}
      {/*        <Grid item xs={12} sm={12} md={9} lg={9} xl={9} padding={1}>*/}
      {/*          <TextField*/}
      {/*            fullWidth*/}
      {/*            inputProps={{ maxLength: 100 }}*/}
      {/*            id="mock-test-name"*/}
      {/*            label="Mock Test Name"*/}
      {/*            value={mockTest.name}*/}
      {/*            onChange={(event) => setMockTest({ ...mockTest, name: event.target.value })}*/}
      {/*            helperText="Enter a unique name"*/}
      {/*          />*/}
      {/*        </Grid>*/}
      {/*        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} padding={1}>*/}
      {/*          <FormControl fullWidth>*/}
      {/*            <InputLabel id="mock-test-level">Level</InputLabel>*/}
      {/*            <Select*/}
      {/*              fullWidth*/}
      {/*              labelId="mock-test-level"*/}
      {/*              id="mock-test-level"*/}
      {/*              value={mockTest.level}*/}
      {/*              label="Level"*/}
      {/*              onChange={(event) => setMockTest({ ...mockTest, level: event.target.value })}*/}
      {/*              variant='outlined'*/}
      {/*            >*/}
      {/*              <MenuItem value="EASY">EASY</MenuItem>*/}
      {/*              <MenuItem value="MEDIUM">MEDIUM</MenuItem>*/}
      {/*              <MenuItem value="HARD">HARD</MenuItem>*/}
      {/*            </Select>*/}
      {/*          </FormControl>*/}
      {/*        </Grid>*/}
      {/*        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>*/}
      {/*          <TextField*/}
      {/*            fullWidth*/}
      {/*            disabled*/}
      {/*            id="mock-test-id"*/}
      {/*            label="Mock Test Id"*/}
      {/*            value={mockTestId}*/}
      {/*            helperText="This is auto generated."*/}
      {/*          />*/}
      {/*        </Grid>*/}
      {/*        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>*/}
      {/*          <TextField*/}
      {/*            fullWidth*/}
      {/*            id="mock-test-duration"*/}
      {/*            label="Duration"*/}
      {/*            type="number"*/}
      {/*            value={mockTest.duration}*/}
      {/*            onChange={(event) => setMockTest({ ...mockTest, duration: event.target.value })}*/}
      {/*            helperText="Enter time in minutes"*/}
      {/*          />*/}
      {/*        </Grid>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}

      {/*    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} padding={1}>*/}
      {/*      <TextField*/}
      {/*        fullWidth*/}
      {/*        multiline*/}
      {/*        rows={5.3}*/}
      {/*        inputProps={{ maxLength: 500 }}*/}
      {/*        id="mock-test-description"*/}
      {/*        label="Description"*/}
      {/*        value={mockTest.description}*/}
      {/*        onChange={(event) => setMockTest({ ...mockTest, description: event.target.value })}*/}
      {/*        helperText="Describe this mock test"*/}
      {/*      />*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}

      {/*  <Divider>*/}
      {/*    <Chip label="Questions" />*/}
      {/*  </Divider>*/}

      {/*  <Reorder.Group*/}
      {/*    values={selectedQuestions}*/}
      {/*    onReorder={setSelectedQuestions}*/}
      {/*    as="ol"*/}
      {/*  >*/}
      {/*    {selectedQuestions.map((question) => (*/}
      {/*      <Reorder.Item*/}
      {/*        value={question}*/}
      {/*        key={question.$id}*/}
      {/*        onDragStart={() => setDragStarted(true)}*/}
      {/*        onDragEnd={() => setDragStarted(false)}*/}
      {/*      >*/}
      {/*        <Card sx={{ m: 1, cursor: dragStarted ? "grabbing" : "grab" }}>*/}
      {/*          <Divider sx={{ mt: 1 }}>*/}
      {/*            <Chip label={question?.qnId} />*/}
      {/*          </Divider>*/}
      {/*          <CardHeader*/}
      {/*            title={*/}
      {/*              <ReactKatex>{question?.contentQuestion || ""}</ReactKatex>*/}
      {/*            }*/}
      {/*          ></CardHeader>*/}
      {/*          {*/}
      {/*            <CardContent>*/}
      {/*              {question?.coverQuestion && (*/}
      {/*                <Image*/}
      {/*                  disabledEffect*/}
      {/*                  alt="Question"*/}
      {/*                  src={question?.coverQuestion}*/}
      {/*                  sx={{ borderRadius: 1, ml: 2, width: 300 }}*/}
      {/*                />*/}
      {/*              )}*/}

      {/*              <Grid container>*/}
      {/*                <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                  <Alert*/}
      {/*                    variant={*/}
      {/*                      question?.answerOption?.includes("A")*/}
      {/*                        ? "filled"*/}
      {/*                        : "outlined"*/}
      {/*                    }*/}
      {/*                    severity={*/}
      {/*                      question?.answerOption?.includes("A")*/}
      {/*                        ? "success"*/}
      {/*                        : "info"*/}
      {/*                    }*/}
      {/*                    icon={<Iconify icon="mdi:alphabet-a-box" />}*/}
      {/*                    sx={{ m: 0.5 }}*/}
      {/*                  >*/}
      {/*                    <Stack direction="column">*/}
      {/*                      <ReactKatex>*/}
      {/*                        {question?.contentOptionA || ""}*/}
      {/*                      </ReactKatex>*/}
      {/*                      {question?.coverOptionA && (*/}
      {/*                        <Image*/}
      {/*                          disabledEffect*/}
      {/*                          alt="option A"*/}
      {/*                          src={question?.coverOptionA}*/}
      {/*                          sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                        />*/}
      {/*                      )}*/}
      {/*                    </Stack>*/}
      {/*                  </Alert>*/}
      {/*                </Grid>*/}

      {/*                <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                  <Alert*/}
      {/*                    variant={*/}
      {/*                      question?.answerOption?.includes("B")*/}
      {/*                        ? "filled"*/}
      {/*                        : "outlined"*/}
      {/*                    }*/}
      {/*                    severity={*/}
      {/*                      question?.answerOption?.includes("B")*/}
      {/*                        ? "success"*/}
      {/*                        : "info"*/}
      {/*                    }*/}
      {/*                    icon={<Iconify icon="mdi:alphabet-b-box" />}*/}
      {/*                    sx={{ m: 0.5 }}*/}
      {/*                  >*/}
      {/*                    <Stack direction="column">*/}
      {/*                      <ReactKatex>*/}
      {/*                        {question?.contentOptionB || ""}*/}
      {/*                      </ReactKatex>*/}
      {/*                      {question?.coverOptionB && (*/}
      {/*                        <Image*/}
      {/*                          disabledEffect*/}
      {/*                          alt="option B"*/}
      {/*                          src={question?.coverOptionB}*/}
      {/*                          sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                        />*/}
      {/*                      )}*/}
      {/*                    </Stack>*/}
      {/*                  </Alert>*/}
      {/*                </Grid>*/}

      {/*                <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                  <Alert*/}
      {/*                    variant={*/}
      {/*                      question?.answerOption?.includes("C")*/}
      {/*                        ? "filled"*/}
      {/*                        : "outlined"*/}
      {/*                    }*/}
      {/*                    severity={*/}
      {/*                      question?.answerOption?.includes("C")*/}
      {/*                        ? "success"*/}
      {/*                        : "info"*/}
      {/*                    }*/}
      {/*                    icon={<Iconify icon="mdi:alphabet-c-box" />}*/}
      {/*                    sx={{ m: 0.5 }}*/}
      {/*                  >*/}
      {/*                    <Stack direction="column">*/}
      {/*                      <ReactKatex>*/}
      {/*                        {question?.contentOptionC || ""}*/}
      {/*                      </ReactKatex>*/}
      {/*                      {question?.coverOptionC && (*/}
      {/*                        <Image*/}
      {/*                          disabledEffect*/}
      {/*                          alt="option C"*/}
      {/*                          src={question?.coverOptionC}*/}
      {/*                          sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                        />*/}
      {/*                      )}*/}
      {/*                    </Stack>*/}
      {/*                  </Alert>*/}
      {/*                </Grid>*/}

      {/*                <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                  <Alert*/}
      {/*                    variant={*/}
      {/*                      question?.answerOption?.includes("D")*/}
      {/*                        ? "filled"*/}
      {/*                        : "outlined"*/}
      {/*                    }*/}
      {/*                    severity={*/}
      {/*                      question?.answerOption?.includes("D")*/}
      {/*                        ? "success"*/}
      {/*                        : "info"*/}
      {/*                    }*/}
      {/*                    icon={<Iconify icon="mdi:alphabet-d-box" />}*/}
      {/*                    sx={{ m: 0.5 }}*/}
      {/*                  >*/}
      {/*                    <Stack direction="column">*/}
      {/*                      <ReactKatex>*/}
      {/*                        {question?.contentOptionD || ""}*/}
      {/*                      </ReactKatex>*/}
      {/*                      {question?.coverOptionD && (*/}
      {/*                        <Image*/}
      {/*                          disabledEffect*/}
      {/*                          alt="option D"*/}
      {/*                          src={question?.coverOptionD}*/}
      {/*                          sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                        />*/}
      {/*                      )}*/}
      {/*                    </Stack>*/}
      {/*                  </Alert>*/}
      {/*                </Grid>*/}
      {/*              </Grid>*/}
      {/*            </CardContent>*/}
      {/*          }*/}
      {/*        </Card>*/}
      {/*      </Reorder.Item>*/}
      {/*    ))}*/}
      {/*  </Reorder.Group>*/}

      {/*  <Button*/}
      {/*    fullWidth*/}
      {/*    variant="outlined"*/}
      {/*    sx={{ height: 200 }}*/}
      {/*    onClick={() => setDialogeOpen(true)}*/}
      {/*  >*/}
      {/*    Add / Remove Questions*/}
      {/*  </Button>*/}

      {/*  <Dialog*/}
      {/*    fullScreen*/}
      {/*    open={dialogeOpen}*/}
      {/*    scroll="body"*/}
      {/*    onClose={() => setDialogeOpen(false)}*/}
      {/*    TransitionComponent={Transition}*/}
      {/*  >*/}
      {/*    <AppBar sx={{ position: "sticky" }}>*/}
      {/*      <Toolbar>*/}
      {/*        <IconButton*/}
      {/*          edge="start"*/}
      {/*          color="inherit"*/}
      {/*          onClick={() => setDialogeOpen(false)}*/}
      {/*          aria-label="close"*/}
      {/*        >*/}
      {/*          <ArrowBackIcon />*/}
      {/*        </IconButton>*/}
      {/*        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">*/}
      {/*          Pick questions*/}
      {/*        </Typography>*/}
      {/*      </Toolbar>*/}
      {/*    </AppBar>*/}
      {/*    <Paper*/}
      {/*      variant="outlined"*/}
      {/*      sx={{*/}
      {/*        p: 1,*/}
      {/*        my: 1,*/}
      {/*        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Grid container>*/}
      {/*        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} padding={1}>*/}
      {/*          {allQuestions.map((question) => (*/}
      {/*            <div key={question?.$id}>*/}
      {/*              <Divider>*/}
      {/*                <Chip label={question?.qnId} />*/}
      {/*              </Divider>*/}

      {/*              <Card sx={{ m: 1 }}>*/}
      {/*                <CardHeader*/}
      {/*                  title={*/}
      {/*                    <ReactKatex>*/}
      {/*                      {question?.contentQuestion || ""}*/}
      {/*                    </ReactKatex>*/}
      {/*                  }*/}
      {/*                  action={*/}
      {/*                    <Checkbox*/}
      {/*                      defaultChecked={*/}
      {/*                        selectedQuestions.findIndex(*/}
      {/*                          (value) => value?.$id === question?.$id*/}
      {/*                        ) !== -1*/}
      {/*                      }*/}
      {/*                      onChange={(event) => {*/}
      {/*                        var y = selectedQuestions;*/}
      {/*                        if (event.target.checked) {*/}
      {/*                          y.push(question);*/}
      {/*                        } else {*/}
      {/*                          const x = y.findIndex(*/}
      {/*                            (value) => value?.$id === question?.$id*/}
      {/*                          );*/}
      {/*                          y.splice(x, 1);*/}
      {/*                        }*/}
      {/*                        setSelectedQuestions(y);*/}
      {/*                      }}*/}
      {/*                    />*/}
      {/*                  }*/}
      {/*                ></CardHeader>*/}
      {/*                <CardContent>*/}
      {/*                  {question?.coverQuestion && (*/}
      {/*                    <Image*/}
      {/*                      disabledEffect*/}
      {/*                      alt="Question"*/}
      {/*                      src={question?.coverQuestion}*/}
      {/*                      sx={{ borderRadius: 1, ml: 2, width: 300 }}*/}
      {/*                    />*/}
      {/*                  )}*/}

      {/*                  <Grid container>*/}
      {/*                    <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                      <Alert*/}
      {/*                        variant={*/}
      {/*                          question?.answerOption?.includes("A")*/}
      {/*                            ? "filled"*/}
      {/*                            : "outlined"*/}
      {/*                        }*/}
      {/*                        severity={*/}
      {/*                          question?.answerOption?.includes("A")*/}
      {/*                            ? "success"*/}
      {/*                            : "info"*/}
      {/*                        }*/}
      {/*                        icon={<Iconify icon="mdi:alphabet-a-box" />}*/}
      {/*                        sx={{ m: 0.5 }}*/}
      {/*                      >*/}
      {/*                        <Stack direction="column">*/}
      {/*                          <ReactKatex>*/}
      {/*                            {question?.contentOptionA || ""}*/}
      {/*                          </ReactKatex>*/}
      {/*                          {question?.coverOptionA && (*/}
      {/*                            <Image*/}
      {/*                              disabledEffect*/}
      {/*                              alt="option A"*/}
      {/*                              src={question?.coverOptionA}*/}
      {/*                              sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                            />*/}
      {/*                          )}*/}
      {/*                        </Stack>*/}
      {/*                      </Alert>*/}
      {/*                    </Grid>*/}

      {/*                    <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                      <Alert*/}
      {/*                        variant={*/}
      {/*                          question?.answerOption?.includes("B")*/}
      {/*                            ? "filled"*/}
      {/*                            : "outlined"*/}
      {/*                        }*/}
      {/*                        severity={*/}
      {/*                          question?.answerOption?.includes("B")*/}
      {/*                            ? "success"*/}
      {/*                            : "info"*/}
      {/*                        }*/}
      {/*                        icon={<Iconify icon="mdi:alphabet-b-box" />}*/}
      {/*                        sx={{ m: 0.5 }}*/}
      {/*                      >*/}
      {/*                        <Stack direction="column">*/}
      {/*                          <ReactKatex>*/}
      {/*                            {question?.contentOptionB || ""}*/}
      {/*                          </ReactKatex>*/}
      {/*                          {question?.coverOptionB && (*/}
      {/*                            <Image*/}
      {/*                              disabledEffect*/}
      {/*                              alt="option B"*/}
      {/*                              src={question?.coverOptionB}*/}
      {/*                              sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                            />*/}
      {/*                          )}*/}
      {/*                        </Stack>*/}
      {/*                      </Alert>*/}
      {/*                    </Grid>*/}

      {/*                    <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                      <Alert*/}
      {/*                        variant={*/}
      {/*                          question?.answerOption?.includes("C")*/}
      {/*                            ? "filled"*/}
      {/*                            : "outlined"*/}
      {/*                        }*/}
      {/*                        severity={*/}
      {/*                          question?.answerOption?.includes("C")*/}
      {/*                            ? "success"*/}
      {/*                            : "info"*/}
      {/*                        }*/}
      {/*                        icon={<Iconify icon="mdi:alphabet-c-box" />}*/}
      {/*                        sx={{ m: 0.5 }}*/}
      {/*                      >*/}
      {/*                        <Stack direction="column">*/}
      {/*                          <ReactKatex>*/}
      {/*                            {question?.contentOptionC || ""}*/}
      {/*                          </ReactKatex>*/}
      {/*                          {question?.coverOptionC && (*/}
      {/*                            <Image*/}
      {/*                              disabledEffect*/}
      {/*                              alt="option C"*/}
      {/*                              src={question?.coverOptionC}*/}
      {/*                              sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                            />*/}
      {/*                          )}*/}
      {/*                        </Stack>*/}
      {/*                      </Alert>*/}
      {/*                    </Grid>*/}

      {/*                    <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>*/}
      {/*                      <Alert*/}
      {/*                        variant={*/}
      {/*                          question?.answerOption?.includes("D")*/}
      {/*                            ? "filled"*/}
      {/*                            : "outlined"*/}
      {/*                        }*/}
      {/*                        severity={*/}
      {/*                          question?.answerOption?.includes("D")*/}
      {/*                            ? "success"*/}
      {/*                            : "info"*/}
      {/*                        }*/}
      {/*                        icon={<Iconify icon="mdi:alphabet-d-box" />}*/}
      {/*                        sx={{ m: 0.5 }}*/}
      {/*                      >*/}
      {/*                        <Stack direction="column">*/}
      {/*                          <ReactKatex>*/}
      {/*                            {question?.contentOptionD || ""}*/}
      {/*                          </ReactKatex>*/}
      {/*                          {question?.coverOptionD && (*/}
      {/*                            <Image*/}
      {/*                              disabledEffect*/}
      {/*                              alt="option D"*/}
      {/*                              src={question?.coverOptionD}*/}
      {/*                              sx={{ borderRadius: 1, ml: 2, width: 400 }}*/}
      {/*                            />*/}
      {/*                          )}*/}
      {/*                        </Stack>*/}
      {/*                      </Alert>*/}
      {/*                    </Grid>*/}
      {/*                  </Grid>*/}
      {/*                </CardContent>*/}
      {/*              </Card>*/}
      {/*            </div>*/}
      {/*          ))}*/}
      {/*        </Grid>*/}
      {/*        <Divider orientation="vertical" flexItem />*/}
      {/*      </Grid>*/}
      {/*    </Paper>*/}
      {/*  </Dialog>*/}
    </Fragment>
  );
}