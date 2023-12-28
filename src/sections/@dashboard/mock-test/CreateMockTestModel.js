import { Autocomplete, Card, CardContent, CardHeader, Grid, Paper, TextField } from "@mui/material";
import { alpha } from '@mui/material/styles';
import { useState } from "react";
import { MockTest, Question } from "../../../auth/AppwriteContext";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function CreateMockTestModel() {

  const [mockTestId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [standard, setStandard] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [standardId, setStandardId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [time, setTime] = useState(0);

  const [creating, setCreating] = useState(false);

  const [standardList, setStandardList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [chapterList, setChapterList] = useState([]);

  const [isStandardListLoading, setIsStandardListLoading] = useState(false);
  const [isSubjectListLoading, setIsSubjectListLoading] = useState(false);
  const [isChapterListLoading, setIsChapterListLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const createQuestion = async () => {
    if (name.length === 0) {
      enqueueSnackbar('Name cannot be empty', { variant: 'error' });
      return;
    }
    if (description.length === 0) {
      enqueueSnackbar('Description cannot be empty', { variant: 'error' });
      return;
    }
    if (standard.length === 0) {
      enqueueSnackbar('Standard cannot be empty', { variant: 'error' });
      return;
    }
    if (subject.length === 0) {
      enqueueSnackbar('Subject cannot be empty', { variant: 'error' });
      return;
    }
    if (chapter.length === 0) {
      enqueueSnackbar('Chapter cannot be empty', { variant: 'error' });
      return;
    }
    if (time <= 0) {
      enqueueSnackbar('Duration cannot less than or equal to 0', { variant: 'error' });
      return;
    }
    setCreating(true);
    const id = await MockTest.createMockTest(name, description, standardId, subjectId, chapterId, time);
    setCreating(false);
    window.location.href = PATH_DASHBOARD.mockTest.view(id);
  }

  return (
    <Paper
      sx={{
        p: 1,
        my: 1,
        minHeight: 120,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Card>
        <CardHeader title="Create a mock-test" subheader="Information enterd here cannot be edited in future. Please enter the data carefully" />
        <CardContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                disabled
                value={mockTestId}
                label='ID'
                helperText='ID is automatically generated by the system.'
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                value={name}
                label='Name'
                helperText='Name of mock-test to be displayed in app.'
                onChange={(event) => {
                  setName(event.target.value);
                }}

              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                value={description}
                variant="outlined"
                label='Description'
                helperText='Description of mock-test to be displayed in app. This will help student to understand the importance of this mock-test'
                multiline
                maxRows={4}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                autoComplete
                value={standard}
                loading={isStandardListLoading}
                options={standardList}
                onFocus={async (event, value) => {
                  try {
                    setIsStandardListLoading(true);
                    const tem = await Question.getStandardList(value?.$id ? value?.name : value);
                    setStandardList(tem);
                    setIsStandardListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onInputChange={async (event, value) => {
                  try {
                    setIsStandardListLoading(true);
                    const tem = await Question.getStandardList(value?.$id ? value?.name : value);
                    setStandardList(tem);
                    setIsStandardListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onChange={async (event, value) => {
                  setStandardId(value?.$id)
                  setStandard(value?.name);
                }}
                getOptionLabel={(option) => {
                  if (typeof (option) === 'string') return option;
                  else return option.name || '';
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Standard" />
                )}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                autoComplete
                value={subject}
                loading={isSubjectListLoading}
                options={subjectList}
                onFocus={async (event, value) => {
                  try {
                    setIsSubjectListLoading(true);
                    const tem = await Question.getSubjectList(value?.$id ? value?.name : value);
                    setSubjectList(tem);
                    setIsSubjectListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onInputChange={async (event, value) => {
                  try {
                    setIsSubjectListLoading(true);
                    const tem = await Question.getSubjectList(value?.$id ? value?.name : value);
                    setSubjectList(tem);
                    setIsSubjectListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onChange={(event, value) => {
                  setSubjectId(value?.$id)
                  setSubject(value?.name);
                }}
                getOptionLabel={(option) => {
                  if (typeof (option) === 'string') return option;
                  else return option.name || '';
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Subject" />
                )}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                autoComplete
                value={chapter}
                loading={isChapterListLoading}
                options={chapterList}
                onFocus={async (event, value) => {
                  try {
                    setIsChapterListLoading(true);
                    const tem = await Question.getChapterList(value?.$id ? value?.name : value);
                    setChapterList(tem);
                    setIsChapterListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onInputChange={async (event, value) => {
                  try {
                    setIsChapterListLoading(true);
                    const tem = await Question.getChapterList(value?.$id ? value?.name : value);
                    setChapterList(tem);
                    setIsChapterListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onChange={(event, value) => {
                  setChapterId(value?.$id)
                  setChapter(value?.name);
                }}
                getOptionLabel={(option) => {
                  if (typeof (option) === 'string') return option;
                  else return option.name || '';
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Chapter" />
                )}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                value={time}
                label='Duration'
                type="number"
                helperText='Number of minutes as duration of test.'
                onChange={(event) => {
                  setTime(event.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <LoadingButton
                variant="contained"
                fullWidth
                onClick={createQuestion}
                loading={creating}
              >
                Create
              </LoadingButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  )
}