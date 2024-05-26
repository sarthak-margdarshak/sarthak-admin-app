import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { Question } from "../../../auth/Question";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { ID } from "appwrite";

export default function CreateMockTestDriverModel({ onSave }) {
  const [standard, setStandard] = useState([]);
  const [subject, setSubject] = useState([]);
  const [chapter, setChapter] = useState([]);
  const [concept, setConcept] = useState([]);

  const [creating, setCreating] = useState(false);

  const [standardList, setStandardList] = useState([]);
  const [isStandardListLoading, setIsStandardListLoading] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [isSubjectListLoading, setIsSubjectListLoading] = useState(false);
  const [chapterList, setChapterList] = useState([]);
  const [isChapterListLoading, setIsChapterListLoading] = useState(false);
  const [conceptList, setConceptList] = useState([]);
  const [isConceptListLoading, setIsConceptListLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const createQuestion = async () => {
    setCreating(true);
    try {
      var standardIds = [];
      for (let i in standard) {
        standardIds.push(await Question.getStandardId(standard[i]));
      }
      var subjectIds = [];
      for (let i in subject) {
        subjectIds.push(await Question.getSubjectId(subject[i]));
      }
      var chapterIds = [];
      for (let i in chapter) {
        chapterIds.push(await Question.getChapterId(chapter[i]));
      }
      var conceptIds = [];
      for (let i in concept) {
        conceptIds.push(await Question.getConceptId(concept[i]));
      }
      const x =
        (
          await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.mockTestDriver
          )
        ).total + 1;
      await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestDriver,
        ID.unique(),
        {
          standardIds: standardIds,
          subjectIds: subjectIds,
          conceptIds: conceptIds,
          chapterIds: chapterIds,
          mtdId: "MTD" + x.toString().padStart(5, 0),
        }
      );
      enqueueSnackbar(
        "MTD" +
          x.toString().padStart(5, 0) +
          " mock test driver successfully created"
      );
      onSave();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setCreating(false);
  };

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
        <CardHeader
          title="Create a mock-test-driver"
          subheader="Information enterd here cannot be edited in future. Please enter the data carefully"
        />
        <CardContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                multiple
                filterSelectedOptions
                autoComplete
                loading={isStandardListLoading}
                options={standardList}
                onFocus={async (event, value) => {
                  setIsStandardListLoading(true);
                  try {
                    const tem = await Question.getStandardList(value);
                    setStandardList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsStandardListLoading(false);
                }}
                onInputChange={async (event, value) => {
                  setIsStandardListLoading(true);
                  try {
                    const tem = await Question.getStandardList(value);
                    setStandardList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsStandardListLoading(false);
                }}
                onChange={(event, value) => setStandard(value)}
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={props.key}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Standard"
                    helperText="If left empty, all standards will be considered"
                  />
                )}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                multiple
                filterSelectedOptions
                autoComplete
                loading={isSubjectListLoading}
                options={subjectList}
                onFocus={async (event, value) => {
                  setIsSubjectListLoading(true);
                  try {
                    const tem = await Question.getSubjectList(value);
                    setSubjectList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsSubjectListLoading(false);
                }}
                onInputChange={async (event, value) => {
                  setIsSubjectListLoading(true);
                  try {
                    const tem = await Question.getSubjectList(value);
                    setSubjectList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsSubjectListLoading(false);
                }}
                onChange={(event, value) => setSubject(value)}
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={props.key}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subject"
                    helperText="If left empty, all subjects will be considered"
                  />
                )}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                multiple
                filterSelectedOptions
                autoComplete
                loading={isChapterListLoading}
                options={chapterList}
                onFocus={async (event, value) => {
                  setIsChapterListLoading(true);
                  try {
                    const tem = await Question.getChapterList(value);
                    setChapterList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsChapterListLoading(false);
                }}
                onInputChange={async (event, value) => {
                  setIsChapterListLoading(true);
                  try {
                    const tem = await Question.getChapterList(value);
                    setChapterList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsChapterListLoading(false);
                }}
                onChange={(event, value) => setChapter(value)}
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={props.key}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chapter"
                    helperText="If left empty, all chapters will be considered"
                  />
                )}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Autocomplete
                fullWidth
                multiple
                filterSelectedOptions
                autoComplete
                loading={isConceptListLoading}
                options={conceptList}
                onFocus={async (event, value) => {
                  setIsConceptListLoading(true);
                  try {
                    const tem = await Question.getConceptList(value);
                    setConceptList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsConceptListLoading(false);
                }}
                onInputChange={async (event, value) => {
                  setIsConceptListLoading(true);
                  try {
                    const tem = await Question.getConceptList(value);
                    setConceptList(tem);
                  } catch (error) {
                    console.log(error);
                  }
                  setIsConceptListLoading(false);
                }}
                onChange={(event, value) => setConcept(value)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={props.key}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Concept"
                    helperText="If left empty, all concepts will be considered"
                  />
                )}
                sx={{ mt: 2 }}
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
  );
}
