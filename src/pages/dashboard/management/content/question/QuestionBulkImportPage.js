import { Helmet } from "react-helmet-async";
import {
  Container,
  Paper,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Button,
  Box,
  Divider,
  Chip,
  Grid,
  LinearProgress,
} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { Fragment, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormProvider from "components/hook-form/FormProvider";
import { LoadingButton } from "@mui/lab";
import { appwriteAccount, appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { ID } from "appwrite";
import { useSnackbar } from "notistack";
import { useLocation, Link } from "react-router-dom";
import { Item } from "components/item/Item";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "components/accordion";
import ReactKatex from "@pkasila/react-katex";
import AceEditor from "react-ace";
import ace from "ace-builds";
import Iconify from "components/iconify";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/worker-json";
import "ace-builds/webpack-resolver";
import "katex/dist/katex.min.css";

// Configure Ace to use the correct path for workers
ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");

export default function QuestionBulkImportPage() {
  const { themeStretch } = useSettingsContext();
  const [jsonError, setJsonError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [questionStatuses, setQuestionStatuses] = useState([]);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [editorDisabled, setEditorDisabled] = useState(false);
  const location = useLocation();
  const [bookIndexId] = useState(location.pathname.split("/")[3]);
  const [selectedBookIndex, setSelectedBookIndex] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [subjectId, setSubjectId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [chapterId, setChapterId] = useState("");

  useEffect(() => {
    const fetchBookIndex = async () => {
      try {
        if (bookIndexId) {
          const bookIndex = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.bookIndex,
            bookIndexId
          );
          setChapterId(bookIndex.chapter);
          setSubjectId(bookIndex.subject);
          setStandardId(bookIndex.standard);
          bookIndex.chapter = (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.bookIndex,
              bookIndex.chapter
            )
          ).chapter;
          bookIndex.standard = (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.bookIndex,
              bookIndex.standard
            )
          ).standard;
          bookIndex.subject = (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.bookIndex,
              bookIndex.subject
            )
          ).subject;
          setSelectedBookIndex(bookIndex);
        }
      } catch (error) {
        console.error("Error fetching book index:", error);
        enqueueSnackbar("Error fetching book index details", {
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookIndex();
  }, [bookIndexId, enqueueSnackbar]);

  const defaultValues = {
    jsonInput: "",
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const validateJson = (jsonString) => {
    try {
      console.log("Validating JSON:", jsonString);
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return "Input must be an array of questions";
      }
      // Validate each question has required fields
      for (const question of parsed) {
        if (!question.contentQuestion)
          return "Each question must have a 'contentQuestion' field";
        if (!Array.isArray(question.contentOptions))
          return "Each question must have an 'contentOptions' array";
        if (!Array.isArray(question.answerOptions))
          return "Each question must have an 'answerOptions' array";
        if (!question.contentAnswer)
          return "Each question must have a 'contentAnswer' field";
      }
      return null;
    } catch (e) {
      return "Invalid JSON format";
    }
  };

  const onSubmit = async (data) => {
    const error = validateJson(data.jsonInput);
    if (error) {
      setJsonError(error);
      return;
    }
    setJsonError("");

    try {
      const questions = JSON.parse(data.jsonInput);
      setIsUploading(true);
      setEditorDisabled(true);
      setQuestionStatuses(new Array(questions.length).fill("pending"));
      setUploadedQuestions([]);
      const newStatuses = [...questionStatuses];

      for (let i = 0; i < questions.length; i++) {
        try {
          const response = await appwriteDatabases.createDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.questions,
            ID.unique(),
            {
              ...questions[i],
              bookIndex: bookIndexId,
              published: false,
              standard: standardId,
              subject: subjectId,
              chapter: chapterId,
              concept: bookIndexId,
              creator: (await appwriteAccount.get()).$id,
              updater: (await appwriteAccount.get()).$id,
            }
          );

          newStatuses[i] = "success";
          setQuestionStatuses(newStatuses);

          setUploadedQuestions((prev) => [...prev, response]);
          setUploadProgress(((i + 1) / questions.length) * 100);
        } catch (error) {
          newStatuses[i] = "error";
          setQuestionStatuses(newStatuses);
          console.error(`Error uploading question ${i + 1}:`, error);
        }
      }

      enqueueSnackbar("Upload process completed", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error processing questions:", error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = () => {
    const error = validateJson(methods.getValues("jsonInput"));
    if (error) {
      setJsonError(error);
      return;
    }
    setJsonError("");
    setPreviewQuestions(JSON.parse(methods.getValues("jsonInput")));
    setShowPreview(true);
  };

  return (
    <Fragment>
      <Helmet>
        <title> Question: Bulk Import | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Bulk Import Questions"
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
              name: "Bulk Import",
            },
          ]}
        />

        <Paper sx={{ p: 3, mt: 3 }}>
          <Stack spacing={3}>
            <div>
              <Item>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1">Selected Index →</Typography>
                  {selectedBookIndex ? (
                    <Typography variant="body2">
                      {selectedBookIndex.standard +
                        " 🢒 " +
                        selectedBookIndex.subject +
                        " 🢒 " +
                        selectedBookIndex.chapter +
                        " 🢒 " +
                        selectedBookIndex.concept}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No index selected
                    </Typography>
                  )}
                </Stack>
              </Item>
            </div>

            {isLoading ? (
              <CircularProgress />
            ) : (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="subtitle1">
                  Paste your questions JSON array below:
                </Typography>

                <Controller
                  name="jsonInput"
                  control={methods.control}
                  render={({ field }) => (
                    <AceEditor
                      mode="json"
                      theme="github"
                      value={field.value}
                      onChange={field.onChange}
                      name={field.name}
                      width="100%"
                      height="400px"
                      fontSize={14}
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      readOnly={editorDisabled}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                        wrap: true,
                      }}
                      placeholder={`[
  {
    "contentQuestion": "What is...",
    "contentOptions": ["A", "B", "C", "D"],
    "answerOptions": [true, false, false, false],
    "contentAnswer": "Explain..."
  },
  ...
]`}
                    />
                  )}
                />

                {jsonError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {jsonError}
                  </Alert>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={handlePreview}
                    disabled={isUploading || isSubmitting || editorDisabled}
                  >
                    Preview Questions
                  </Button>

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isUploading || editorDisabled}
                  >
                    Upload Questions
                  </LoadingButton>
                </Stack>
              </FormProvider>
            )}

            {isUploading && (
              <Box sx={{ width: "100%", mb: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  Uploading Questions: {Math.round(uploadProgress)}%
                </Typography>
              </Box>
            )}

            {showPreview && (
              <Box>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Preview Questions
                </Typography>
                {previewQuestions.map((question, index) => (
                  <Accordion key={index}>
                    <AccordionSummary>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        <Typography>{`Question ${index + 1}`}</Typography>
                        {questionStatuses[index] && (
                          <Chip
                            label={questionStatuses[index]}
                            color={
                              questionStatuses[index] === "success"
                                ? "success"
                                : questionStatuses[index] === "error"
                                ? "error"
                                : "default"
                            }
                            size="small"
                          />
                        )}
                        {questionStatuses[index] === "success" &&
                          uploadedQuestions[index] && (
                            <Link
                              to={PATH_DASHBOARD.question.view(
                                uploadedQuestions[index].$id
                              )}
                              target="_blank"
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={
                                  <Iconify icon="eva:external-link-fill" />
                                }
                              >
                                View Question
                              </Button>
                            </Link>
                          )}
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1">
                        <ReactKatex>{question.contentQuestion}</ReactKatex>
                      </Typography>

                      <Divider sx={{ m: 1 }}>
                        <Chip
                          label="Options"
                          variant="outlined"
                          color="info"
                          icon={<Iconify icon="famicons:options" />}
                        />
                      </Divider>

                      <Grid container>
                        {question.contentOptions?.map((option, index) => (
                          <Grid
                            item
                            sm={12}
                            xs={12}
                            md={6}
                            lg={6}
                            xl={6}
                            key={index}
                          >
                            <Alert
                              variant={
                                question.answerOptions[index]
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question.answerOptions[index]
                                  ? "success"
                                  : "info"
                              }
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
                                <ReactKatex>{option || ""}</ReactKatex>
                              </Stack>
                            </Alert>
                          </Grid>
                        ))}
                      </Grid>

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
                          <ReactKatex>
                            {question.contentAnswer || ""}
                          </ReactKatex>
                        </Alert>
                      </Fragment>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </Fragment>
  );
}
