import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Card,
  Skeleton,
  CardHeader,
  CardContent,
  Breadcrumbs,
  Tooltip,
  IconButton,
  FormControlLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import "katex/dist/katex.min.css";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import ContentEditor from "sections/@dashboard/management/content/question/component/ContentEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { appwriteDatabases, appwriteStorage } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { ID, Query } from "appwrite";
import { PATH_DASHBOARD } from "routes/paths";
import { useTheme } from "@mui/material/styles";
import Iconify from "components/iconify";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import { lang } from "assets/data/lang";

export default function QuestionEditForm({ questionId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { getQuestion } = useContent();
  const theme = useTheme();
  let textInput = useRef(null);

  const [question, setQuestion] = useState(
    localStorage.getItem(`question_${questionId}`)
      ? JSON.parse(localStorage.getItem(`question_${questionId}`))
      : {}
  );
  const [covers, setCovers] = useState({
    coverQuestion: null,
    coverOptions: [],
    coverAnswer: null,
  });
  const [idOptions, setIdOptions] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [expanded, setExpanded] = useState("question");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [availableLangEntries, setAvailableLangEntries] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      if (panel === "options") {
        if (question.contentOptions.length > 0) {
          setTimeout(() => {
            textInput.current.focus();
          }, 100);
        }
      } else {
        setTimeout(() => {
          textInput.current.focus();
        }, 100);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const x = await getQuestion(questionId);
        setCovers({
          coverQuestion: x.coverQuestion,
          coverAnswer: x.coverAnswer,
          coverOptions: x.coverOptions,
        });
        setQuestion(x);
        setIdOptions(x.answerOptions.map(() => crypto.randomUUID()));
        setSelectedLanguage(x.lang || "");
        setAvailableLangEntries(
          Object.entries(lang).filter(
            ([code]) => !(question?.translatedLang || []).includes(code)
          )
        );
        setIsDataLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const saveQuestion = async () => {
    setIsSaving(true);
    try {
      const coverQuestion = await uploadCover(covers.coverQuestion, -1);
      const coverAnswer = await uploadCover(covers.coverAnswer, -2);
      let coveOptions = [];
      for (let index in covers.coverOptions) {
        coveOptions.push(await uploadCover(covers.coverOptions[index], index));
      }

      delete question.$id;
      delete question.$collectionId;
      delete question.$createdAt;
      delete question.$databaseId;
      delete question.$permissions;
      delete question.$updatedAt;
      delete question.lastSynced;
      delete question.qnId;
      question.translatedLang.forEach((l) => {
        delete question[l];
      });

      setQuestion(
        await appwriteDatabases.updateDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          questionId,
          {
            ...question,
            coverQuestion: coverQuestion,
            coverAnswer: coverAnswer,
            coverOptions: coveOptions,
            lang: selectedLanguage || null,
            updater: user.$id,
          }
        )
      );

      enqueueSnackbar("Saved successfully", { variant: "success" });
      navigate(PATH_DASHBOARD.question.view(questionId));
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setIsSaving(false);
  };

  const uploadCover = async (coverFile, index) => {
    let coverId = "";
    if (typeof coverFile !== "string" && coverFile) {
      coverId = (
        await appwriteStorage.createFile(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          ID.unique(),
          coverFile
        )
      ).$id;
    }

    const currQuestion = await appwriteDatabases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId,
      [Query.select(["coverQuestion", "coverOptions", "coverAnswer"])]
    );

    let currentCoverFile;

    if (index === -1) {
      currentCoverFile = currQuestion.coverQuestion;
    } else if (index === -2) {
      currentCoverFile = currQuestion.coverAnswer;
    } else {
      currentCoverFile = currQuestion.coverOptions[index];
    }

    if (typeof coverFile !== "string") {
      if (
        currentCoverFile === null &&
        currentCoverFile === "" &&
        currentCoverFile === undefined
      ) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          currentCoverFile
        );
      }
    } else {
      coverId = currentCoverFile;
    }

    return coverId;
  };

  const handleDropFile = useCallback(
    (acceptedFiles, index) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        if (index === -1) setCovers({ ...covers, coverQuestion: newFile });
        else if (index === -2) setCovers({ ...covers, coverAnswer: newFile });
        else {
          covers.coverOptions[index] = newFile;
          setCovers({ ...covers, coverOptions: covers.coverOptions });
        }
      }
    },
    [covers]
  );

  if (isDataLoading) {
    return (
      <Fragment>
        <Divider>
          <Chip label={question?.$id} />
        </Divider>

        <Card sx={{ m: 1 }}>
          <CardHeader title="Question Content" />
          <CardContent>
            <Skeleton variant="rounded" height={100} />
          </CardContent>
        </Card>

        <Card sx={{ m: 1 }}>
          <CardHeader title="Options Content" />
          <CardContent>
            <Skeleton variant="rounded" height={100} />
          </CardContent>
        </Card>

        <Card sx={{ m: 1 }}>
          <CardHeader title="Answer Content" />
          <CardContent>
            <Skeleton variant="rounded" height={100} />
          </CardContent>
        </Card>
      </Fragment>
    );
  }

  if (question?.published) {
    navigate(PATH_DASHBOARD.question.view(questionId));
  }

  return (
    <Fragment>
      <Divider />

      <Breadcrumbs sx={{ mb: 1, mt: 1 }}>
        <IndexView id={question.bookIndexId} />
      </Breadcrumbs>

      <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Box sx={{ bgcolor: "secondary.lighter", borderRadius: 2, p: 1 }}>
              <Iconify icon="mdi:translate" width={36} height={36} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Select Language</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Select a language for this question.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel id="question-lang-select-label">
                    Language
                  </InputLabel>
                  <Select
                    labelId="question-lang-select-label"
                    value={selectedLanguage}
                    label="Language"
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <MenuItem value="">(None)</MenuItem>
                    {availableLangEntries.map(([code, info]) => (
                      <MenuItem key={code} value={code}>
                        {info.level} ({code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Chip
                  label={
                    selectedLanguage
                      ? `${lang[selectedLanguage]?.level} (${selectedLanguage})`
                      : "No Language selected"
                  }
                  size="small"
                  color={selectedLanguage ? "primary" : "default"}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Divider sx={{ mb: 1 }}>
          <Chip label={question?.qnId} />
        </Divider>

        <Accordion
          elevation={15}
          expanded={expanded === "question"}
          onChange={handleChange("question")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Question Content</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component="section"
              sx={{
                p: 2,
                border: "1px dashed grey",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1A2027" : "#f5f5f5",
                  border: "1px solid",
                },
              }}
            >
              <ContentEditor
                value={question?.contentQuestion || ""}
                onChange={(newVal) =>
                  setQuestion({ ...question, contentQuestion: newVal })
                }
                requiredCover={true}
                cover={covers?.coverQuestion}
                onDrop={(acceptedFiles) => handleDropFile(acceptedFiles, -1)}
                onDelete={() => {
                  setCovers({ ...covers, coverQuestion: null });
                }}
                textInput={expanded === "question" ? textInput : null}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion
          elevation={15}
          expanded={expanded === "options"}
          onChange={handleChange("options")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Options Content</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {question?.contentOptions?.map((option, index) => (
                <Grid item xs={12} key={idOptions[index]}>
                  <Box
                    component="section"
                    sx={{
                      p: 1,
                      mb: 1,
                      border: "1px dashed grey",
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark" ? "#1A2027" : "#f5f5f5",
                        border: "1px solid",
                      },
                    }}
                  >
                    <Grid container spacing={1} sx={{ p: 1 }}>
                      <Grid item xs={1.5}>
                        <Chip label={index + 1} />
                      </Grid>

                      <Grid item xs={8.5}>
                        <ContentEditor
                          value={option || ""}
                          onChange={(newVal) => {
                            question.contentOptions[index] = newVal;
                            setQuestion({
                              ...question,
                              contentOptions: question.contentOptions,
                            });
                          }}
                          requiredCover={true}
                          cover={covers.coverOptions[index]}
                          onDrop={(acceptedFiles) =>
                            handleDropFile(acceptedFiles, index)
                          }
                          onDelete={() => {
                            covers.coverOptions[index] = null;
                            setCovers({
                              ...covers,
                              coverOptions: covers.coverOptions,
                            });
                          }}
                          textInput={expanded === "options" ? textInput : null}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={question.answerOptions[index]}
                              onChange={() => {
                                question.answerOptions[index] =
                                  !question.answerOptions[index];
                                setQuestion({
                                  ...question,
                                  answerOptions: question.answerOptions,
                                });
                              }}
                            />
                          }
                          labelPlacement="bottom"
                          label="Correct"
                        />
                      </Grid>
                    </Grid>

                    <Tooltip title="Remove the option">
                      <IconButton
                        aria-label="settings"
                        onClick={async () => {
                          question?.contentOptions.splice(index, 1);
                          question?.coverOptions.splice(index, 1);
                          question.answerOptions.splice(index, 1);
                          idOptions.splice(index, 1);
                          setIdOptions(idOptions);
                          setQuestion({
                            ...question,
                            contentOptions: question?.contentOptions,
                            coverOptions: question?.coverOptions,
                            answerOptions: question.answerOptions,
                          });
                        }}
                      >
                        <Iconify
                          icon="fluent:delete-48-filled"
                          color="#d11a2a"
                          width={20}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button
              onClick={() => {
                question?.contentOptions.push(null);
                question?.coverOptions.push(null);
                question?.answerOptions.push(false);
                idOptions.push(crypto.randomUUID());
                setIdOptions(idOptions);
                setQuestion({
                  ...question,
                  contentOptions: question.contentOptions,
                  coverOptions: question.coverOptions,
                  answerOptions: question.answerOptions,
                });
                covers.coverOptions.push(null);
                setCovers(covers);
              }}
            >
              Add Option
            </Button>
          </AccordionDetails>
        </Accordion>

        <Accordion
          elevation={15}
          expanded={expanded === "answer"}
          onChange={handleChange("answer")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Answers Content</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component="section"
              sx={{
                p: 2,
                border: "1px dashed grey",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1A2027" : "#f5f5f5",
                  border: "1px solid",
                },
              }}
            >
              <ContentEditor
                value={question?.contentAnswer || ""}
                onChange={(newVal) =>
                  setQuestion({ ...question, contentAnswer: newVal })
                }
                requiredCover={true}
                cover={covers.coverAnswer}
                onDrop={(acceptedFiles) => handleDropFile(acceptedFiles, -2)}
                onDelete={() => {
                  setCovers({ ...covers, coverAnswer: null });
                }}
                textInput={expanded === "answer" ? textInput : null}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <LoadingButton
          sx={{ mt: 1 }}
          variant="contained"
          loading={isSaving}
          onClick={saveQuestion}
        >
          Save
        </LoadingButton>
      </Box>
    </Fragment>
  );
}
