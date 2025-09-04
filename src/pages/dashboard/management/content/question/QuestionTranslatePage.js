import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { lang } from "assets/data/lang";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { appwriteDatabases, appwriteFunctions } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { sarthakAPIPath } from "assets/data";
import { Query } from "appwrite";
import { useSnackbar } from "components/snackbar";

export default function QuestionTranslatePage() {
  const { id: questionId, targetLang } = useParams();
  const navigate = useNavigate();
  const { questionsData, updateQuestion } = useContent();
  const [question, setQuestion] = useState(questionsData[questionId]);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    contentQuestion: "",
    contentOptions: [],
    contentAnswer: "",
  });
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await updateQuestion(questionId);
      const x = questionsData[questionId];
      setQuestion(x);
      setForm({
        contentQuestion: x[targetLang].contentQuestion || "",
        contentOptions: x[targetLang].contentOptions
          ? x[targetLang].contentOptions
          : [],
        contentAnswer: x[targetLang].contentAnswer || "",
      });
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  if (loading || !question) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const sourceLang = question.lang || "en";

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleOptionChange = (idx, value) => {
    setForm((prev) => {
      const newOptions = [...prev.contentOptions];
      newOptions[idx] = value;
      return { ...prev, contentOptions: newOptions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const objId = (
        await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedQuestions,
          [
            Query.equal("questionId", questionId),
            Query.equal("lang", targetLang),
          ]
        )
      ).documents[0].$id;
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.translatedQuestions,
        objId,
        {
          contentQuestion: form.contentQuestion,
          contentOptions: form.contentOptions,
          contentAnswer: form.contentAnswer,
        }
      );
      enqueueSnackbar(
        "Translation successfully saved. You can close the page."
      );
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
    setSaving(false);
  };

  const handleAITranslate = async () => {
    setTranslating(true);
    setError(null);
    try {
      const response = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({
          questionId,
          sourceLang,
          targetLang,
        }),
        false,
        sarthakAPIPath.question.translate
      );
      const res = JSON.parse(response.responseBody);
      if (res.status === "success") {
        setForm({
          contentQuestion: res.translatedContent.contentQuestion || "",
          contentOptions: res.translatedContent.contentOptions || [],
          contentAnswer: res.translatedContent.contentAnswer || "",
        });
      } else {
        setError(res.error || "Translation failed");
      }
    } catch (err) {
      setError(err.message || "Translation failed");
    }
    setTranslating(false);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Translate Question
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography variant="subtitle1">
            Source Language:
            <b style={{ marginLeft: 8 }}>
              {lang[sourceLang]?.level} {lang[sourceLang]?.symbol}
            </b>
          </Typography>
          <Typography variant="subtitle1">→</Typography>
          <Typography variant="subtitle1">
            Target Language:
            <b style={{ marginLeft: 8 }}>
              {lang[targetLang]?.level} {lang[targetLang]?.symbol}
            </b>
          </Typography>
          <Button
            variant="outlined"
            color="info"
            sx={{ ml: "auto" }}
            onClick={handleAITranslate}
            disabled={translating}
            startIcon={<Iconify icon="mdi:sparkles" />}
          >
            {translating ? <CircularProgress size={20} /> : "AI Translate"}
          </Button>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Question Statement */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Original ({lang[sourceLang]?.level}):
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  whiteSpace: "pre-line",
                  bgcolor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {question.contentQuestion || ""}
              </Typography>
              <TextField
                label={`Question Statement (${lang[targetLang]?.level})`}
                value={form.contentQuestion}
                onChange={(e) =>
                  handleChange("contentQuestion", e.target.value)
                }
                fullWidth
                multiline
                minRows={2}
              />
            </Box>
            {/* Options */}
            <Box>
              <Typography variant="subtitle1" mb={1}>
                Options
              </Typography>
              <Stack spacing={2}>
                {question.contentOptions.map((opt, idx) => (
                  <Box key={idx}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Original ({lang[sourceLang]?.level}) - Option{" "}
                      {String.fromCharCode(65 + idx)}:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        whiteSpace: "pre-line",
                        bgcolor: "#f5f5f5",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {question.contentOptions && question.contentOptions[idx]
                        ? question.contentOptions[idx]
                        : ""}
                    </Typography>
                    <TextField
                      label={`Option ${String.fromCharCode(65 + idx)} (${
                        lang[targetLang]?.level
                      })`}
                      value={
                        form.contentOptions && form.contentOptions[idx]
                          ? form.contentOptions[idx]
                          : ""
                      }
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      fullWidth
                      multiline
                      minRows={1}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
            {/* Answer */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Original ({lang[sourceLang]?.level}):
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  whiteSpace: "pre-line",
                  bgcolor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {question.contentAnswer || ""}
              </Typography>
              <TextField
                label={`Answer (${lang[targetLang]?.level})`}
                value={form.contentAnswer}
                onChange={(e) => handleChange("contentAnswer", e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? <CircularProgress size={20} /> : "Submit Translation"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
