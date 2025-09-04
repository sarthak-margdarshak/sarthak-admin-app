import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { Query } from "appwrite";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Reorder } from "framer-motion";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import QuestionRowComponent from "sections/@dashboard/management/content/question/component/QuestionRowComponent";
import { alpha, useTheme } from "@mui/material/styles";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import Iconify from "components/iconify";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { LoadingButton } from "@mui/lab";
import { useAuthContext } from "auth/useAuthContext";
import { PATH_DASHBOARD } from "routes/paths";

export default function MockTestEditForm({ mockTestId }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mockTestsData, updateMockTest } = useContent();
  const { user } = useAuthContext();

  const [dragStarted, setDragStarted] = useState(false);
  const [mockTest, setMockTest] = useState(mockTestsData[mockTestId]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState({
    loadedOnce: false,
    loading: true,
    total: 0,
    questions: [],
    lastSyncId: null,
    selected: [],
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const update = async () => {
      let x = mockTest;
      setIsDataLoading(true);
      if (x === undefined) {
        x = await updateMockTest(mockTestId);
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
          x = await updateMockTest(mockTestId);
        }
      }
      setMockTest(x);
      setSelectedQuestions(x.questions);
      setIsDataLoading(false);
    };
    update().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  const loadQuestions = async (lastSyncId) => {
    setAllQuestions({ ...allQuestions, loading: true });
    let query = [];
    if (lastSyncId !== null) {
      query.push(Query.cursorAfter(lastSyncId));
    }
    query.push(Query.limit(10));
    query.push(Query.select("$id"));
    query.push(Query.orderDesc("$createdAt"));
    query.push(Query.equal("published", true));
    query.push(
      Query.or([
        Query.equal("bookIndex", mockTest?.bookIndex?.$id),
        Query.equal("standard", mockTest?.bookIndex?.$id),
        Query.equal("subject", mockTest?.bookIndex?.$id),
        Query.equal("chapter", mockTest?.bookIndex?.$id),
        Query.equal("concept", mockTest?.bookIndex?.$id),
      ])
    );
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      query
    );
    let tempAllQuestions = allQuestions.questions.concat(
      x.documents.map((q) => q.$id)
    );
    let tempSelected = allQuestions.selected.concat(
      new Array(x.documents.length).fill(false)
    );
    mockTest.questions.forEach((question) => {
      const x = tempAllQuestions.findIndex((q) => q === question);
      if (x !== -1) {
        tempSelected[x] = true;
      }
    });
    setAllQuestions({
      loadedOnce: true,
      loading: false,
      total: x.total,
      questions: tempAllQuestions,
      lastSyncId: x.documents[x.documents.length - 1].$id,
      selected: tempSelected,
    });
  };

  const saveMockTest = async () => {
    setIsSaving(true);
    try {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        mockTest.$id,
        {
          name: mockTest.name,
          description: mockTest.description,
          questions: selectedQuestions,
          duration: parseInt(mockTest.duration),
          level: mockTest.level,
          updater: user.$id,
        }
      );
      enqueueSnackbar("Successfully Saved");
      navigate(PATH_DASHBOARD.mockTest.view(mockTestId));
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setIsSaving(false);
  };

  if (isDataLoading) {
    return <Skeleton height={150} />;
  }

  if (mockTest?.published) {
    navigate(PATH_DASHBOARD.mockTest.view(mockTestId));
  }

  return (
    <Fragment>
      <Divider>
        <Chip label={mockTest?.mtId} color="info" />
      </Divider>

      <Stack alignItems="center" justifyContent="space-between" direction="row">
        <Breadcrumbs sx={{ mb: 1, mt: 1 }}>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            {mockTest?.standard?.standard}
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            {mockTest?.subject?.subject}
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            {mockTest?.chapter?.chapter}
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            {mockTest?.concept?.concept}
          </Link>
        </Breadcrumbs>
        <LoadingButton
          variant="contained"
          loading={isSaving}
          onClick={saveMockTest}
        >
          Save
        </LoadingButton>
      </Stack>

      <Divider>
        <Chip label="Meta data" color="warning" />
      </Divider>

      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} padding={1}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 100 }}
                id="mock-test-name"
                label="Mock Test Name"
                value={mockTest.name || ""}
                onChange={(event) =>
                  setMockTest({ ...mockTest, name: event.target.value })
                }
                helperText="Enter a unique name"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>
              <FormControl fullWidth>
                <InputLabel id="mock-test-level">Level</InputLabel>
                <Select
                  fullWidth
                  labelId="mock-test-level"
                  id="mock-test-level"
                  value={mockTest.level || ""}
                  label="Level"
                  onChange={(event) =>
                    setMockTest({ ...mockTest, level: event.target.value })
                  }
                  variant="outlined"
                >
                  <MenuItem value="">NO_OPTION</MenuItem>
                  <MenuItem value="EASY">EASY</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HARD">HARD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>
              <TextField
                fullWidth
                id="mock-test-duration"
                label="Duration"
                type="number"
                value={mockTest.duration || ""}
                onChange={(event) =>
                  setMockTest({ ...mockTest, duration: event.target.value })
                }
                helperText="Enter time in minutes"
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
            value={mockTest.description || ""}
            onChange={(event) =>
              setMockTest({ ...mockTest, description: event.target.value })
            }
            helperText="Describe this mock test"
          />
        </Grid>
      </Grid>

      <Divider>
        <Chip label="Questions" color="secondary" />
      </Divider>

      <Reorder.Group
        values={selectedQuestions}
        onReorder={setSelectedQuestions}
        as="ol"
      >
        {selectedQuestions.map((question) => (
          <Reorder.Item
            value={question}
            key={question}
            onDragStart={() => setDragStarted(true)}
            onDragEnd={() => setDragStarted(false)}
          >
            <Box sx={{ m: 1, cursor: dragStarted ? "grabbing" : "grab" }}>
              <QuestionRowComponent
                questionId={question}
                defaultExpanded={false}
                showAnswer={false}
                showImages={false}
              />
            </Box>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Button
        fullWidth
        variant="outlined"
        sx={{ height: 200 }}
        onClick={async () => {
          setDrawerOpen(true);
          if (!allQuestions.loadedOnce) {
            await loadQuestions(allQuestions.lastSyncId);
          }
        }}
      >
        Add / Remove Questions
      </Button>

      <Drawer
        anchor={"right"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Alert
          severity="info"
          sx={{ m: 2 }}
          icon={<Iconify icon="oui:app-index-rollup" />}
        >
          <Stack spacing={1} direction="row">
            <Typography sx={{ fontWeight: "bold" }}>
              {"All published questions under index  :-  "}
            </Typography>
            <IndexView id={mockTest.bookIndex.$id} />
          </Stack>
        </Alert>

        <Fab
          sx={{ width: 110, borderRadius: 1, ml: 2 }}
          onClick={() => {
            setSelectedQuestions(
              allQuestions.questions.filter(
                (q, index) => allQuestions.selected[index]
              )
            );
            setDrawerOpen(false);
          }}
        >
          <KeyboardDoubleArrowLeftIcon sx={{ mr: 1 }} />
          Update
        </Fab>

        {allQuestions.questions.map((question, index) => (
          <Box
            key={question}
            component="section"
            sx={{
              width: 900,
              p: 1,
              m: 1,
              border: "1px solid grey",
              backgroundColor: allQuestions.selected[index]
                ? alpha(theme.palette.primary.light, 0.5)
                : theme.palette.background.default,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <Checkbox
                  checked={allQuestions.selected[index]}
                  onChange={(event, checked) => {
                    allQuestions.selected[index] = checked;
                    setAllQuestions({
                      ...allQuestions,
                      selected: allQuestions.selected,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={11}>
                <QuestionRowComponent
                  questionId={question}
                  defaultExpanded={false}
                  showAnswer={false}
                  showImages={false}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {allQuestions.questions.length !== allQuestions.total && (
          <Button
            fullWidth
            disabled={allQuestions.loading}
            startIcon={<KeyboardDoubleArrowDownIcon />}
            endIcon={<KeyboardDoubleArrowDownIcon />}
            onClick={async () => await loadQuestions(allQuestions.lastSyncId)}
            sx={{ mb: 5 }}
          >
            {"Loaded " +
              allQuestions.questions.length +
              " out of " +
              allQuestions.total +
              "! Load More"}
          </Button>
        )}
      </Drawer>
    </Fragment>
  );
}
