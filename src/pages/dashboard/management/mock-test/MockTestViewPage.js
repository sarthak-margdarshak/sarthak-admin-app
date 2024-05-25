import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useSettingsContext } from "../../../../components/settings";
import { forwardRef, useEffect, useState } from "react";
import ReactKatex from "@pkasila/react-katex";
import Image from "../../../../components/image/Image";
import Iconify from "../../../../components/iconify";
import { APPWRITE_API } from "../../../../config-global";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../../../auth/AppwriteHelper";
import StandardDisplayUI from "../../../../sections/@dashboard/question/view/StandardDisplayUI";
import SubjectDisplayUI from "../../../../sections/@dashboard/question/view/SubjectDisplayUI";
import ChapterDisplayUI from "../../../../sections/@dashboard/question/view/ChapterDisplayUI";
import ConceptDisplayUI from "../../../../sections/@dashboard/question/view/ConceptDisplayUI";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { appwriteDatabases } from "../../../../auth/AppwriteContext";

export default function MockTestViewPage() {
  const id = window.location.pathname.split("/")[3];

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [mockTest, setMockTest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      var x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        id
      );
      var mtd = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        [Query.equal("mtdId", x.mockTestDriverId)]
      );
      setMockTest(x);
    };
    fetchData();
  }, [setMockTestDriverList]);

  return (
    <>
      <Helmet>
        <title> Mock-Test : View | Standard</title>
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
              Edit
            </LoadingButton>
          }
        />

        <Grid container>
          <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4} padding={1}>
            <FormControl fullWidth>
              <InputLabel id="mock-test-driver-select">
                Mock Test Driver Id
              </InputLabel>
              <Select
                disabled
                labelId="mock-test-driver-select"
                id="mock-test-driver-select"
                value={mockTestDriverId}
                label="Mock Test Driver Id"
              >
                <MenuItem value={mockTestDriverId}>{mockTestDriverId}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
            <Stack direction="column">
              <Typography variant="subtitle1">Standards</Typography>
              {standards.map((value) => (
                <StandardDisplayUI key={value} id={value} />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
            <Stack direction="column">
              <Typography variant="subtitle1">Subjects</Typography>
              {subjects.map((value) => (
                <SubjectDisplayUI key={value} id={value} />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
            <Stack direction="column">
              <Typography variant="subtitle1">Chapters</Typography>
              {chapters.map((value) => (
                <ChapterDisplayUI key={value} id={value} />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4} lg={2.4} xl={2.4} padding={1}>
            <Stack direction="column">
              <Typography variant="subtitle1">Concepts</Typography>
              {concepts.map((value) => (
                <ConceptDisplayUI key={value} id={value} />
              ))}
            </Stack>
          </Grid>
        </Grid>

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

        {selectedQuestions.map((question) => (
          <Card sx={{ m: 1 }}>
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
    </>
  );
}
