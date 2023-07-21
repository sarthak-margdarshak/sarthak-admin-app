import { useEffect, useState } from "react";
// @mui
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  TextField,
  Divider,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Components
import Iconify from "../../../../components/iconify/Iconify";
import DateRangePicker, { useDateRangePicker } from '../../../../components/date-range-picker';
import {
  useTable,
  getComparator,
} from '../../../../components/table';
import { useSnackbar } from '../../../../components/snackbar';
// utils
import { fDate } from '../../../../utils/formatTime';
// Auth
import { Question, User } from "../../../../auth/AppwriteContext";

import QuestionRowComponent from "./QuestionRowComponent";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All', 'Initialize', 'SentForReview', 'ReviewedBack', 'Approved', 'Active'];

// ----------------------------------------------------------------------

export default function QuestionListComponent() {

  const pickerInput = useDateRangePicker();
  const { enqueueSnackbar } = useSnackbar();

  const {
    order,
    orderBy,
  } = useTable();

  const [standard, setStandard] = useState([]);
  const [standardList, setStandardList] = useState([]);

  const [subject, setSubject] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [chapter, setChapter] = useState([]);
  const [chapterList, setChapterList] = useState([]);

  const [concept, setConcept] = useState([]);
  const [conceptList, setConceptList] = useState([]);

  const [createdBy, setCreatedBy] = useState([]);
  const [userList, setUserList] = useState([]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [tableData, setTableData] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const handleFilterStatus = (event, newValue) => {
    setFilterStatus(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        var data = await Question.getStandardList();
        setStandardList(data);

        data = await Question.getSubjectList();
        setSubjectList(data);

        data = await Question.getChapterList();
        setChapterList(data);

        data = await Question.getConceptList();
        setConceptList(data);

        data = await User.getUserList();
        setUserList(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setIsLoadingData(false);
    }
    fetchData();
  }, [isLoadingData, enqueueSnackbar])

  const applyFilter = async () => {
    setIsFetchingData(true);
    try {
      const data = await Question.getFilteredQuestionList(standard, subject, chapter, concept, fDate(pickerInput.startDate, 'yyyy-MM-dd'), fDate(pickerInput.endDate, 'yyyy-MM-dd'), createdBy);
      setTableData(data);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsFetchingData(false);
  }

  const dataFiltered = applyFilterOnCurrentData({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterStatus: filterStatus
  });

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader title='Filter' />
        <CardContent>
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                disableCloseOnSelect
                loading={isLoadingData}
                options={standardList}
                onChange={(event, value) => {
                  setStandard(value?.map((item) => item?.$id));
                }}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Standard" />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                disableCloseOnSelect
                loading={isLoadingData}
                options={subjectList}
                onChange={(event, value) => {
                  setSubject(value?.map((item) => item?.$id));
                }}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Subject" />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                disableCloseOnSelect
                loading={isLoadingData}
                options={chapterList}
                onChange={(event, value) => {
                  setChapter(value?.map((item) => item?.$id));
                }}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Chapter" />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                disableCloseOnSelect
                loading={isLoadingData}
                options={conceptList}
                onChange={(event, value) => {
                  setConcept(value?.map((item) => item?.$id));
                }}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Concept" />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                fullWidth
                label='Created date'
                placeholder="DD MMM YYYY-DD MMM YYYY"
                value={pickerInput.startDate && fDate(pickerInput.startDate) + '-' + fDate(pickerInput.endDate)}
                onClick={pickerInput.onOpen}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Autocomplete
                fullWidth
                autoComplete
                multiple
                disableCloseOnSelect
                loading={isLoadingData}
                options={userList}
                onChange={(event, value) => {
                  setCreatedBy(value?.map((item) => item?.$id));
                }}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option?.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Created By" />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ textAlign: 'right', mb: 2, mr: 2 }}>
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

      <Divider />

      <Card sx={{ mt: 2 }}>
        <Tabs
          value={filterStatus}
          onChange={handleFilterStatus}
          sx={{
            mb: 2,
            px: 2,
            bgcolor: 'background.neutral',
          }}
        >
          {STATUS_OPTIONS.map((tab) => {
            return <Tab key={tab} label={tab} value={tab} />
          })}
        </Tabs>

        <Box sx={{ minHeight: 400 }}>
          {dataFiltered.length === 0 && <Box sx={{ textAlign: 'center' }}><Typography variant="caption" color={"gray"}>Apply Filter to see some Question</Typography></Box>}
          {dataFiltered.map((item) => <QuestionRowComponent onSave={applyFilter} question={item} key={item?.$id} />)}
        </Box>

      </Card>

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

function applyFilterOnCurrentData({ inputData, comparator, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterStatus !== 'All') {
    inputData = inputData.filter((row) => row.status === filterStatus);
  }

  var filtered = [];
  var count = 1;
  for (let i in inputData) {
    filtered.push(
      {
        ...inputData[i],
        sn: count,
      }
    );
    count++;
  }
  return filtered;
}