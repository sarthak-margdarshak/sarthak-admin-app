import { forwardRef, useEffect, useState } from "react";
// @mui
import { Autocomplete, Box, Card, CardContent, CardHeader, Grid, TextField, Divider, Tabs, Typography, Skeleton, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, Select, MenuItem, InputLabel, FormControl, Stack, TablePagination, styled, Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from "@mui/lab";
// Components
import Iconify from "../../../../components/iconify/Iconify";
import DateRangePicker, { useDateRangePicker } from '../../../../components/date-range-picker';
import { useSnackbar } from '../../../../components/snackbar';
// utils
import { fDate } from '../../../../utils/formatTime';
// Auth
import { Question } from "../../../../auth/Question";
import { User } from "../../../../auth/User";
// Display UI
import StandardDisplayUI from "./StandardDisplayUI";
import SubjectDisplayUI from "./SubjectDisplayUI";
import ConceptDisplayUI from "./ConceptDisplayUI";
import ChapterDisplayUI from "./ChapterDisplayUI";
import StatusDisplayUI from "./StatusDisplayUI";
import { SarthakUserDisplayUI } from "../../user/profile";
import QuestionRowComponent from "./QuestionRowComponent";

// ----------------------------------------------------------------------

const addSubtractDate = require("add-subtract-date");

// ----------------------------------------------------------------------

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// ----------------------------------------------------------------------

const searchParameterOptions = [
  { value: 'standardId', label: 'Standard' },
  { value: 'subjectId', label: 'Subject' },
  { value: 'chapterId', label: 'Chapter' },
  { value: 'conceptId', label: 'Concept' },
  { value: 'status', label: 'Status' },
  { value: 'createdBy', label: 'Created By' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedBy', label: 'Updated By' },
  { value: 'updatedAt', label: 'Updated At' },
  { value: 'approvedBy', label: 'Approved By' },
  { value: 'approvedAt', label: 'Approved At' },
  { value: 'sentForReviewTo', label: 'Sent For Review To' },
  { value: 'sentForReviewAt', label: 'Sent For Review At' },
  { value: 'reviewedBackTo', label: 'Reviewed Back To' },
  { value: 'reviewedBackAt', label: 'Reviewed Back At' },
]

// ----------------------------------------------------------------------

export default function QuestionListComponent() {

  // Extract info from link
  const rawParameters = window.location.href.replaceAll(window.location.origin + window.location.pathname, '').substring(1).split('&');
  var tempParameters = {};
  for (let i in rawParameters) {
    if (i !== '') {
      const x = rawParameters[i].split('=');
      tempParameters[x[0]] = x[1];
    }
  }

  const [parameters, setParameters] = useState(tempParameters);
  const [filterWindowOpen, setFilterWindowOpen] = useState(false);
  const [currentParameter, setCurrentParameter] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [expanded, setExpanded] = useState(true);

  // Create parameter component
  var ParametersComponent = [];
  for (let i in parameters) {
    const key = i;
    const value = parameters[i];
    if (key === 'standardId') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Standard - </Typography>
            <StandardDisplayUI id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'subjectId') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Subject - </Typography>
            <SubjectDisplayUI id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'chapterId') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Chapter - </Typography>
            <ChapterDisplayUI id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'conceptId') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Concept - </Typography>
            <ConceptDisplayUI id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'status') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Status - </Typography>
            <StatusDisplayUI status={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'createdBy') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Created By - </Typography>
            <SarthakUserDisplayUI userId={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'createdAt') {
      const dates = value.split('to');
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Created At - </Typography>
            <Typography variant="body2">{fDate(dates[0], 'dd/MM/yyyy HH:mm:ss') + ' - ' + fDate(dates[1], 'dd/MM/yyyy HH:mm:ss')}</Typography>
            <Typography id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'updatedBy') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Updated By - </Typography>
            <SarthakUserDisplayUI userId={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'updatedAt') {
      const dates = value.split('to');
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Updated At - </Typography>
            <Typography variant="body2">{fDate(dates[0], 'dd/MM/yyyy HH:mm:ss') + ' - ' + fDate(dates[1], 'dd/MM/yyyy HH:mm:ss')}</Typography>
            <Typography id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'approvedBy') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Approved By - </Typography>
            <SarthakUserDisplayUI userId={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'approvedAt') {
      const dates = value.split('to');
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Approved At - </Typography>
            <Typography variant="body2">{fDate(dates[0], 'dd/MM/yyyy HH:mm:ss') + ' - ' + fDate(dates[1], 'dd/MM/yyyy HH:mm:ss')}</Typography>
            <Typography id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'sentForReviewTo') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Sent For Review To - </Typography>
            <SarthakUserDisplayUI userId={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'sentForReviewAt') {
      const dates = value.split('to');
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Sent For Review At - </Typography>
            <Typography variant="body2">{fDate(dates[0], 'dd/MM/yyyy HH:mm:ss') + ' - ' + fDate(dates[1], 'dd/MM/yyyy HH:mm:ss')}</Typography>
            <Typography id={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'reviewedBackTo') {
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Reviewed Back To - </Typography>
            <SarthakUserDisplayUI userId={value} />
          </Stack>
        </Grid>
      )
    } else if (key === 'reviewedBackAt') {
      const dates = value.split('to');
      ParametersComponent.push(
        <Grid item xs={12} sm={12} md={6} xl={6} lg={4} key={key + value}>
          <Stack direction='row' sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }}>Reviewed Back At - </Typography>
            <Typography variant="body2">{fDate(dates[0], 'dd/MM/yyyy HH:mm:ss') + ' - ' + fDate(dates[1], 'dd/MM/yyyy HH:mm:ss')}</Typography>
            <Typography id={value} />
          </Stack>
        </Grid>
      )
    }
  }

  const d1 = new Date();
  addSubtractDate.subtract(d1, 7, "day");
  const d2 = new Date();
  const pickerInput = useDateRangePicker(d1, d2);
  const { enqueueSnackbar } = useSnackbar();

  const [standard, setStandard] = useState([]);
  const [standardList, setStandardList] = useState([]);
  const [isStandardListLoading, setIsStandardListLoading] = useState(false);

  const [subject, setSubject] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [isSubjectListLoading, setIsSubjectListLoading] = useState(false);

  const [chapter, setChapter] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [isChapterListLoading, setIsChapterListLoading] = useState(false);

  const [concept, setConcept] = useState([]);
  const [conceptList, setConceptList] = useState([]);
  const [isConceptListLoading, setIsConceptListLoading] = useState(false);

  const [users, setUsers] = useState({});
  const [userList, setUserList] = useState([]);
  const [isUserListLoading, setIsUserListLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = async (event, newPage) => {
    try {
      setIsFetchingData(true);
      setCurrentPage(newPage);
      const data = await Question.getQuestionList(tempParameters, newPage * rowsPerPage, rowsPerPage);
      setTableData(data.documents)
      setIsFetchingData(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  const handleChangeRowsPerPage = async (event) => {
    try {
      setIsFetchingData(true);
      setRowsPerPage(parseInt(event.target.value, 10));
      setCurrentPage(0);
      const data = await Question.getQuestionList(tempParameters, 0, rowsPerPage);
      setTableData(data.documents)
      setIsFetchingData(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        const data = await Question.getQuestionList(tempParameters, 0, rowsPerPage);
        setTotalCount(data.total)
        setTableData(data.documents)
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setIsFetchingData(false);
    }
    fetchData();
  }, [setIsFetchingData, enqueueSnackbar, rowsPerPage])

  const applyFilter = async () => {
    var filterUrl = '';
    for (let key in parameters) {
      if (key !== '') {
        if (filterUrl === '') {
          filterUrl += key + '=' + parameters[key];
        } else {
          filterUrl += '&' + key + '=' + parameters[key];
        }
      }
    }
    if (filterUrl !== '') {
      filterUrl = '?' + filterUrl;
    }
    window.open(window.location.origin + '/dashboard/question/list' + filterUrl, '_self')
  }

  const FilterMenuItem = searchParameterOptions.map((value) => {
    return <MenuItem key={value.value} value={value.value}>{value.label}</MenuItem>
  })

  return (
    <>
      <Dialog
        open={filterWindowOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Add Filters</DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 1, minWidth: 500 }}>
            <InputLabel id="parameters">Parameter</InputLabel>

            <Select
              labelId="parameters"
              defaultValue={''}
              value={currentParameter}
              label="Parameter"
              onChange={(event) => {
                setCurrentParameter(event.target.value)
                setCurrentValue(parameters[event.target.value])
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {FilterMenuItem}
            </Select>

            {currentParameter === 'standardId' &&
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
                  setStandard(value?.name);
                  setCurrentValue(value?.$id);
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
                  <TextField {...params} label="Value" />
                )}
                sx={{ mt: 2 }}
              />
            }

            {currentParameter === 'subjectId' &&
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
                  setCurrentValue(value?.$id);
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
                  <TextField {...params} label="Value" />
                )}
                sx={{ mt: 2 }}
              />
            }

            {currentParameter === 'chapterId' &&
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
                  setCurrentValue(value?.$id);
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
                  <TextField {...params} label="Value" />
                )}
                sx={{ mt: 2 }}
              />
            }

            {currentParameter === 'conceptId' &&
              <Autocomplete
                fullWidth
                autoComplete
                value={concept}
                loading={isConceptListLoading}
                filterSelectedOptions
                options={conceptList}
                onFocus={async (event, value) => {
                  try {
                    setIsConceptListLoading(true);
                    const tem = await Question.getConceptList(value?.$id ? value?.name : value);
                    setConceptList(tem);
                    setIsConceptListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onInputChange={async (event, value) => {
                  try {
                    setIsConceptListLoading(true);
                    const tem = await Question.getConceptList(value?.$id ? value?.name : value);
                    setConceptList(tem);
                    setIsConceptListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onChange={(event, value) => {
                  setCurrentValue(value?.$id);
                  setConcept(value?.name);
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
                  <TextField {...params} label="Value" />
                )}
                sx={{ mt: 2 }}
              />
            }

            {currentParameter === 'status' &&
              <FormControl sx={{ mt: 2, minWidth: 500 }}>
                <InputLabel id="statusId">Status</InputLabel>
                <Select
                  labelId="statusId"
                  value={currentValue}
                  label="Status"
                  onChange={(event) => {
                    setCurrentValue(event.target.value)
                  }}
                >
                  <MenuItem value="Initialize">Initialize</MenuItem>
                  <MenuItem value="SentForReview">SentForReview</MenuItem>
                  <MenuItem value="ReviewedBack">ReviewedBack</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                </Select>
              </FormControl>
            }

            {(currentParameter === 'createdBy' ||
              currentParameter === 'updatedBy' ||
              currentParameter === 'approvedBy' ||
              currentParameter === 'sentForReviewTo' ||
              currentParameter === 'reviewedBackTo') &&
              <Autocomplete
                fullWidth
                autoComplete
                value={users[currentParameter]}
                loading={isUserListLoading}
                options={userList}
                onFocus={async (event, value) => {
                  try {
                    setIsUserListLoading(true);
                    const tem = await User.getUserList(value?.$id ? value?.name : value);
                    setUserList(tem);
                    setIsUserListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onInputChange={async (event, value) => {
                  try {
                    setIsUserListLoading(true);
                    const tem = await User.getUserList(value?.$id ? value?.name : value);
                    setUserList(tem);
                    setIsUserListLoading(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onChange={async (event, value) => {
                  users[currentParameter] = value?.name;
                  setUsers(users);
                  setCurrentValue(value?.$id);
                }}
                getOptionLabel={(option) => option?.name || option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option?.name + ' (' + option?.empId + ')'}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Value" />
                )}
                sx={{ mt: 2 }}
              />
            }

            {(currentParameter === 'createdAt' ||
              currentParameter === 'updatedAt' ||
              currentParameter === 'approvedAt' ||
              currentParameter === 'sentForReviewAt' ||
              currentParameter === 'reviewedBackAt') &&
              <TextField
                fullWidth
                label='Created date'
                placeholder="DD MMM YYYY-DD MMM YYYY"
                value={pickerInput.startDate && fDate(pickerInput.startDate) + '-' + fDate(pickerInput.endDate)}
                onClick={pickerInput.onOpen}
                sx={{ mt: 2 }}
              />
            }
          </FormControl>
        </DialogContent>
        <DialogActions>
          {currentParameter && <Button onClick={() => {
            delete parameters[currentParameter]
            setParameters(parameters)
            setCurrentValue(null);
            setFilterWindowOpen(false)
          }}>Delete</Button>}
          <Button onClick={() => setFilterWindowOpen(false)}>Discard</Button>
          <Button onClick={() => {
            if (currentParameter === 'createdAt' ||
              currentParameter === 'updatedAt' ||
              currentParameter === 'approvedAt' ||
              currentParameter === 'sentForReviewAt' ||
              currentParameter === 'reviewedBackAt') {
              if (pickerInput.startDate && pickerInput.endDate) {
                parameters[currentParameter] = pickerInput.startDate.toISOString() + 'to' + pickerInput.endDate.toISOString();
                setParameters(parameters);
              }
            }
            else {
              if (currentValue) {
                parameters[currentParameter] = currentValue;
                setParameters(parameters);
              } else {
                delete parameters[currentParameter]
                setParameters(parameters)
              }
            }
            setCurrentValue(null);
            setFilterWindowOpen(false)
          }}>Add</Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ mb: 1 }} />

      <Card sx={{ mb: 2 }}>
        <CardHeader
          title='Filter'
          action={
            <>
              <IconButton aria-label="edit" onClick={() => setFilterWindowOpen(true)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="add" onClick={() => setFilterWindowOpen(true)}>
                <AddIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </>
          }
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container>
              {ParametersComponent}
            </Grid>
          </CardContent>
        </Collapse>
        <Box sx={{ textAlign: 'right', m: 2 }}>
          <LoadingButton
            variant="contained"
            endIcon={<Iconify icon="majesticons:filter" />}
            onClick={applyFilter}
            loading={isFetchingData}
          >
            Apply
          </LoadingButton>
        </Box>
      </Card>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': { my: 1 },
      }}>
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Card sx={{ mt: 2, bgcolor: theme?.palette.mode === 'dark' ? 'ActiveBorder' : '#DCDCDC' }}>
        <Tabs
          value='no-filter'
          sx={{
            mb: 2,
            px: 2,
            bgcolor: 'background.neutral',
          }}
        >
        </Tabs>

        <Box sx={{ minHeight: 400 }}>
          {isFetchingData &&
            <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={400} />
          }
          {tableData?.length === 0 && <Box sx={{ textAlign: 'center' }}><Typography variant="caption" color={"gray"}>No Question found</Typography></Box>}
          {!isFetchingData && tableData?.map((item) => <QuestionRowComponent onSave={applyFilter} question={item} key={item?.$id} />)}
        </Box>

      </Card>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': { my: 1 },
      }}>
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <DateRangePicker
        open={pickerInput.open}
        startDate={pickerInput.startDate}
        endDate={pickerInput.endDate}
        onChangeStartDate={pickerInput.onChangeStartDate}
        onChangeEndDate={pickerInput.onChangeEndDate}
        onClose={pickerInput.onClose}
        isError={pickerInput.isError}
      />
    </>
  )
}