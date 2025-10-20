import {
  Alert,
  Box,
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
  Typography,
} from "@mui/material";
import Image from "components/image/Image";
import ReactKatex from "@pkasila/react-katex";
import { Fragment, useEffect, useState } from "react";
import Iconify from "components/iconify/Iconify";
import { useAuthContext } from "auth/useAuthContext";
import { useSnackbar } from "components/snackbar";
import PermissionDeniedComponent from "components/sub-component/PermissionDeniedComponent";
import { appwriteDatabases, appwriteFunctions } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { LoadingButton } from "@mui/lab";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { ID, Query } from "appwrite";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate, useSearchParams } from "react-router-dom";
import { labels, sarthakAPIPath } from "assets/data";
import { lang } from "assets/data/lang";
import { Marker } from "react-mark.js";
import QuestionMetadata from "sections/@dashboard/management/content/question/component/QuestionMetadata";
import QuestionMockTestList from "sections/@dashboard/management/content/question/component/QuestionMockTestList";

export default function QuestionRowComponent({
  questionId,
  defaultExpanded = true,
  showImages = true,
  showAnswer = true,
}) {
  const { getQuestion } = useContent();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(
    localStorage.getItem(`question_${questionId}`) ? false : true
  );
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false);
  const [openLanguageAssignmentDialog, setOpenLanguageAssignmentDialog] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [question, setQuestion] = useState(
    localStorage.getItem(`question_${questionId}`)
      ? JSON.parse(localStorage.getItem(`question_${questionId}`))
      : {}
  );
  const [langContent, setLangContent] = useState(
    localStorage.getItem(`question_${questionId}`)
      ? {
          contentQuestion: JSON.parse(
            localStorage.getItem(`question_${questionId}`)
          )?.contentQuestion,
          contentOptions: JSON.parse(
            localStorage.getItem(`question_${questionId}`)
          )?.contentOptions,
          contentAnswer: JSON.parse(
            localStorage.getItem(`question_${questionId}`)
          )?.contentAnswer,
        }
      : {}
  );
  const [currLang, setCurrLang] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  // Check if question has a language assigned
  const hasLanguageAssigned = () => {
    return (
      question?.lang && question.lang !== null && question.lang !== undefined
    );
  };

  // Handle language assignment
  const handleLanguageAssignment = async () => {
    if (!selectedLanguage) {
      enqueueSnackbar("Please select a language", { variant: "error" });
      return;
    }

    try {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        {
          lang: selectedLanguage,
          updater: user.$id,
        }
      );

      enqueueSnackbar(
        `Language assigned successfully: ${lang[selectedLanguage]?.level}`,
        { variant: "success" }
      );
      setOpenLanguageAssignmentDialog(false);
      setSelectedLanguage(null);
      await fetchData(); // Refresh the question data
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // Get available languages for translation (languages not yet translated)
  const getAvailableLanguagesForTranslation = () => {
    const translatedLanguages = question?.translatedLang || [];
    const primaryLanguage = question?.lang;

    return Object.keys(lang).filter(
      (langCode) =>
        langCode !== primaryLanguage && !translatedLanguages.includes(langCode)
    );
  };

  const fetchData = async () => {
    try {
      const x = await getQuestion(questionId);
      if (x) {
        setLangContent({
          contentQuestion: x?.contentQuestion,
          contentOptions: x?.contentOptions,
          contentAnswer: x?.contentAnswer,
        });
        setCurrLang(x?.lang);
      }
      setQuestion(x);
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

  const deleteQuestion = async () => {
    setDeleting(true);
    const canDelete =
      (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          questionId,
          [Query.select("published")]
        )
      ).published === false;
    if (!canDelete) {
      enqueueSnackbar(
        "Cannot delete question as it is associated with mock tests. De-reference them first.",
        { variant: "error" }
      );
      setDeleting(false);
      setOpenDeleteDialog(false);
      return;
    }
    // Delete other language versions
    if (question.translatedLang.length > 0) {
      for (const langCode of question.translatedLang) {
        // Get translated question document ID
        const translatedQuestionDocs = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedQuestions,
          [Query.equal("questionId", questionId), Query.equal("lang", langCode)]
        );
        // Delete translated question document
        await appwriteDatabases.deleteDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedQuestions,
          translatedQuestionDocs.documents[0].$id
        );
      }
    }
    await appwriteDatabases.deleteDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      questionId
    );
    setDeleting(false);
    setOpenDeleteDialog(false);
    enqueueSnackbar(`Question Deleted Successfully with ID: [${questionId}]`, {
      variant: "success",
    });
    localStorage.removeItem(`question_${questionId}`);
    navigate(PATH_DASHBOARD.question.list);
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

  if (question === null) {
    return (
      <Fragment>
        <Card sx={{ m: 1 }}>
          <CardHeader
            title={
              <Divider>
                <Chip
                  label={questionId}
                  color="error"
                  icon={
                    <Iconify icon="fluent-color:chat-bubbles-question-16" />
                  }
                />
              </Divider>
            }
          />

          <CardContent>
            <Stack
              alignItems="center"
              spacing={2}
              sx={{ textAlign: "center", py: 2 }}
            >
              <Iconify
                icon="eva:alert-triangle-fill"
                width={56}
                height={56}
                style={{ color: "#d32f2f" }}
              />
              <Typography variant="h6">Question Not Found</Typography>
              <Chip label="Error: QNF-404" color="error" size="small" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 680 }}
              >
                The requested question could not be found. It may have been
                deleted, or the provided question ID is invalid. Please verify
                the ID and try again.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(PATH_DASHBOARD.question.list)}
                >
                  Back to Questions
                </Button>
              </Stack>
            </Stack>
          </CardContent>
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
                label={question?.qnId}
                color="primary"
                icon={<Iconify icon="fluent-color:chat-bubbles-question-16" />}
              />
            </Divider>
          }
          action={
            <Stack direction="row">
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
            <ReactKatex>{langContent?.contentQuestion || ""}</ReactKatex>
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
                        {langContent?.contentOptions[index] || ""}
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
                  <ReactKatex>{langContent?.contentAnswer || ""}</ReactKatex>
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
          {question?.published && (
            <>
              <Tooltip title="Published">
                <Iconify icon="noto:locked" sx={{ m: 1 }} />
              </Tooltip>

              <Tooltip title="Unpublish">
                <IconButton onClick={() => {}}>
                  <Iconify icon="mdi:lock-open-outline" color="#ff2889" />
                </IconButton>
              </Tooltip>
            </>
          )}

          {!question?.published && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() =>
                    navigate(PATH_DASHBOARD.question.edit(questionId))
                  }
                >
                  <Iconify icon="fluent-color:edit-16" />
                </IconButton>
              </Tooltip>

              {user.labels.findIndex(
                (label) => label === labels.founder || label === labels.admin
              ) !== -1 && (
                <>
                  <Tooltip title="Publish">
                    <IconButton
                      disabled={question?.published}
                      onClick={() => setOpenPublishDialog(true)}
                    >
                      <Iconify icon="ic:round-publish" color="#ff2889" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Iconify icon="mdi:delete" color="red" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </>
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

          <Tooltip
            title={hasLanguageAssigned() ? "View Languages" : "Assign Language"}
          >
            <IconButton
              onClick={() => {
                if (hasLanguageAssigned()) {
                  setOpenLanguageDialog(true);
                } else {
                  setOpenLanguageAssignmentDialog(true);
                }
              }}
            >
              <Iconify
                icon="mdi:translate"
                color={hasLanguageAssigned() ? "#4caf50" : "#ff9800"}
              />
            </IconButton>
          </Tooltip>
        </CardActions>

        {defaultExpanded && (
          <CardContent>
            <QuestionMetadata question={question} />

            <Box sx={{ m: 1 }} />

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

      {/* Delete Question Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogTitle id="alert-dialog-title">
              Are you sure to Delete it?
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText id="alert-dialog-description">
                If you click AGREE, question will be deleted.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={deleting}
                onClick={() => setOpenDeleteDialog(false)}
              >
                Disagree
              </Button>
              <LoadingButton
                loading={deleting}
                onClick={deleteQuestion}
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

      {/* Language Management Dialog */}
      <Dialog
        open={openLanguageDialog}
        onClose={() => setOpenLanguageDialog(false)}
        aria-labelledby="language-dialog-title"
        aria-describedby="language-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="language-dialog-title">
          Languages for Question {question?.qnId}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="language-dialog-description" sx={{ mb: 2 }}>
            {hasLanguageAssigned()
              ? `Primary language: ${lang[question.lang]?.level}`
              : "No language assigned to this question."}
          </DialogContentText>

          {/* Primary Language Section */}
          {hasLanguageAssigned() && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary">
                Primary Language
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 1,
                  border: "2px solid",
                  borderColor: "primary.main",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "primary.lighter"
                      : theme.palette.action.hover,
                })}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5">
                    {lang[question.lang]?.symbol}
                  </Typography>

                  <Typography variant="h6">
                    {lang[question.lang]?.level}
                  </Typography>

                  <Chip
                    label="Primary"
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                </Stack>

                {currLang !== question?.lang && (
                  <LoadingButton
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      setLangContent({
                        contentQuestion: question?.contentQuestion,
                        contentOptions: question?.contentOptions,
                        contentAnswer: question?.contentAnswer,
                      });
                      setOpenLanguageDialog(false);
                      setCurrLang(question?.lang);
                    }}
                    startIcon={<Iconify icon="mdi:eye-circle" />}
                  >
                    View
                  </LoadingButton>
                )}
              </Stack>
            </Stack>
          )}

          {/* Translated Languages Section */}
          {question?.translatedLang && question.translatedLang.length > 0 && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" color="success.main">
                Available Translations
              </Typography>

              <Stack spacing={1}>
                {question.translatedLang.map((langCode) => (
                  <Stack
                    key={langCode}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={(theme) => ({
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "success.main",
                      bgcolor:
                        theme.palette.mode === "light"
                          ? "success.lighter"
                          : theme.palette.action.hover,
                    })}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6">
                        {lang[langCode]?.symbol}
                      </Typography>

                      <Typography variant="body1">
                        {lang[langCode]?.level}
                      </Typography>

                      <Chip
                        label="Translated"
                        size="small"
                        color="success"
                        variant="filled"
                      />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      {currLang !== langCode && (
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={async () => {
                            setLangContent({
                              contentQuestion:
                                question[langCode]?.contentQuestion,
                              contentOptions:
                                question[langCode]?.contentOptions,
                              contentAnswer: question[langCode]?.contentAnswer,
                            });
                            setOpenLanguageDialog(false);
                            setCurrLang(langCode);
                          }}
                          startIcon={<Iconify icon="mdi:eye-circle" />}
                        >
                          View
                        </LoadingButton>
                      )}

                      {user.labels.findIndex(
                        (label) =>
                          label === labels.founder || label === labels.admin
                      ) !== -1 && (
                        <LoadingButton
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={async () => {
                            navigate(
                              `/dashboard/question/${questionId}/translate/${langCode}`
                            );
                          }}
                          startIcon={<Iconify icon="mdi:eye-circle" />}
                        >
                          Edit
                        </LoadingButton>
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {user.labels.findIndex(
            (label) => label === labels.founder || label === labels.admin
          ) !== -1 && (
            <>
              {/* Available for Translation Section */}
              {getAvailableLanguagesForTranslation().length > 0 && (
                <Stack spacing={2}>
                  <Typography variant="h6" color="warning.main">
                    Available for Translation
                  </Typography>
                  <Stack spacing={1}>
                    {getAvailableLanguagesForTranslation().map((langCode) => (
                      <Stack
                        key={langCode}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6">
                            {lang[langCode]?.symbol}
                          </Typography>
                          <Typography variant="body1">
                            {lang[langCode]?.level}
                          </Typography>
                        </Stack>
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={async () => {
                            setTranslating(true);
                            await appwriteDatabases.createDocument(
                              APPWRITE_API.databaseId,
                              APPWRITE_API.collections.translatedQuestions,
                              ID.unique(),
                              {
                                questionId: questionId,
                                lang: langCode,
                              }
                            );
                            const c = question?.translatedLang || [];
                            await appwriteDatabases.updateDocument(
                              APPWRITE_API.databaseId,
                              APPWRITE_API.collections.questions,
                              questionId,
                              {
                                translatedLang: [...c, langCode],
                              }
                            );
                            setTranslating(false);
                            navigate(
                              `/dashboard/question/${questionId}/translate/${langCode}`
                            );
                          }}
                          loading={translating}
                          startIcon={<Iconify icon="mdi:translate" />}
                        >
                          Translate
                        </LoadingButton>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}

              {/* No translations available */}
              {getAvailableLanguagesForTranslation().length === 0 &&
                (!question?.translatedLang ||
                  question.translatedLang.length === 0) &&
                hasLanguageAssigned() && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    All available languages have been translated for this
                    question.
                  </Alert>
                )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLanguageDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Language Assignment Dialog */}
      <Dialog
        open={openLanguageAssignmentDialog}
        onClose={() => setOpenLanguageAssignmentDialog(false)}
        aria-labelledby="language-assignment-dialog-title"
        aria-describedby="language-assignment-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="language-assignment-dialog-title">
          Assign Language for Question {question?.qnId}
        </DialogTitle>
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogContent dividers>
              <DialogContentText id="language-assignment-dialog-description">
                This question doesn't have a language assigned. Please select a
                language from the list below:
              </DialogContentText>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {Object.entries(lang).map(([code, language]) => (
                  <Stack
                    key={code}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={(theme) => ({
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor:
                        selectedLanguage === code ? "primary.main" : "divider",
                      bgcolor:
                        selectedLanguage === code
                          ? theme.palette.mode === "light"
                            ? "primary.lighter"
                            : theme.palette.action.hover
                          : theme.palette.background.paper,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor:
                          selectedLanguage === code
                            ? theme.palette.mode === "light"
                              ? "primary.lighter"
                              : theme.palette.action.hover
                            : theme.palette.action.hover,
                      },
                    })}
                    onClick={() => setSelectedLanguage(code)}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6">{language.symbol}</Typography>
                      <Typography variant="body1">{language.level}</Typography>
                    </Stack>
                    {selectedLanguage === code && (
                      <Iconify icon="eva:checkmark-fill" color="primary.main" />
                    )}
                  </Stack>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLanguageAssignmentDialog(false)}>
                Cancel
              </Button>
              <LoadingButton
                onClick={handleLanguageAssignment}
                disabled={!selectedLanguage}
                variant="contained"
              >
                Assign Language
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
