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
  Chip,
} from "@mui/material";
import { appwriteDatabases, appwriteFunctions } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { Query } from "appwrite";
import { sarthakAPIPath } from "assets/data";
import { useSnackbar } from "components/snackbar";
import Iconify from "components/iconify/Iconify";

export default function MockTestTranslatePage() {
  const { id: mockTestId, targetLang } = useParams();
  const navigate = useNavigate();
  const { getMockTest } = useContent();
  const [mockTest, setMockTest] = useState(
    localStorage.getItem(`mockTest_${mockTestId}`)
      ? JSON.parse(localStorage.getItem(`mockTest_${mockTestId}`))
      : {}
  );
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const x = await getMockTest(mockTestId);
        if (x) {
          setMockTest(x);
        }

        // fetch translated mockTest doc
        const listRes = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedMockTest,
          [
            Query.equal("mockTestId", mockTestId),
            Query.equal("lang", targetLang),
          ]
        );

        if (!listRes || !listRes.documents || listRes.documents.length === 0) {
          setError(
            "Translated mock test not found. Please create translation first."
          );
        } else {
          const obj = listRes.documents[0];
          setForm({ name: obj.name || "", description: obj.description || "" });
        }
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to load translation");
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  if (loading) {
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

  const sourceLang = mockTest.lang || "en";

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const listRes = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.translatedMockTest,
        [Query.equal("mockTestId", mockTestId), Query.equal("lang", targetLang)]
      );

      if (!listRes || !listRes.documents || listRes.documents.length === 0) {
        enqueueSnackbar("Translated mock test not found.", {
          variant: "error",
        });
        setSaving(false);
        return;
      }

      const objId = listRes.documents[0].$id;
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.translatedMockTest,
        objId,
        {
          name: form.name,
          description: form.description,
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
        JSON.stringify({ mockTestId, sourceLang: sourceLang, targetLang }),
        false,
        sarthakAPIPath.mockTest.translate
      );
      const res = JSON.parse(response.responseBody);
      if (res.status === "success") {
        setForm({
          name: res.translatedContent.name || "",
          description: res.translatedContent.description || "",
        });
      } else {
        setError(res.error || "Translation failed");
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "Translation failed");
    }
    setTranslating(false);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="h4">Translate Mock Test</Typography>
          <Chip size="small" label={`#${mockTest.mtId || mockTestId}`} />
        </Stack>

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
            startIcon={<Iconify icon="mdi:sparkles" />}
            onClick={handleAITranslate}
            disabled={translating}
          >
            {translating ? <CircularProgress size={20} /> : "AI Translate"}
          </Button>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Name */}
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
                sx={(theme) => ({
                  mb: 1,
                  whiteSpace: "pre-line",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "#f5f5f5"
                      : theme.palette.action.hover,
                  p: 1,
                  borderRadius: 1,
                })}
              >
                {mockTest.name || ""}
              </Typography>

              <TextField
                label={`Name (${lang[targetLang]?.level})`}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
              />
            </Box>

            {/* Description */}
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
                sx={(theme) => ({
                  mb: 1,
                  whiteSpace: "pre-line",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "#f5f5f5"
                      : theme.palette.action.hover,
                  p: 1,
                  borderRadius: 1,
                })}
              >
                {mockTest.description || ""}
              </Typography>

              <TextField
                label={`Description (${lang[targetLang]?.level})`}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                fullWidth
                multiline
                minRows={3}
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
