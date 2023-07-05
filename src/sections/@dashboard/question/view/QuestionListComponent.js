import { Autocomplete, Box, Card, CardContent, CardHeader, Checkbox, Grid, TextField, Divider, LinearProgress, Tab, Table, TableBody, TableContainer, Tabs } from "@mui/material";
import Iconify from "../../../../components/iconify/Iconify";
import { useEffect, useState } from "react";
import DateRangePicker, { useDateRangePicker } from '../../../../components/date-range-picker';
// utils
import { fDate } from '../../../../utils/formatTime';
import { Question, User } from "../../../../auth/AppwriteContext";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {
  useTable,
  getComparator,
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import QuestionTableRow from "./QuestionTableRow";
import { LoadingButton } from "@mui/lab";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useSnackbar } from '../../../../components/snackbar';
import { PATH_DASHBOARD } from "../../../../routes/paths";

const STATUS_OPTIONS = ['All', 'Initialize', 'SentForReview', 'ReviewedBack', 'Approved', 'Active'];

const TABLE_HEAD = [
  { id: 'sn', },
  { id: 'question', label: 'Question', align: 'left' },
  { id: 'standard', label: 'Standard', align: 'left' },
  { id: 'subject', label: 'Subject', align: 'left' },
  { id: 'createdDate', label: 'Created Date', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
];

export default function QuestionListComponent() {

  const pickerInput = useDateRangePicker(new Date(), new Date());
  const { enqueueSnackbar } = useSnackbar();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const denseHeight = 72;

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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
          <Card>
            <CardHeader title='Filter' />
            <CardContent>
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

              <TextField
                fullWidth
                label='Created date'
                value={fDate(pickerInput.startDate) + '-' + fDate(pickerInput.endDate)}
                onClick={pickerInput.onOpen}
                sx={{ mb: 2 }}
              />

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
            {dataFiltered.map((row) => {
              return <FroalaEditorView key={row?.$id} model={row?.question} />
            })}
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={8} lg={10} xl={9}>
          <Card>
            <Tabs
              value={filterStatus}
              onChange={handleFilterStatus}
              sx={{
                px: 2,
                bgcolor: 'background.neutral',
              }}
            >
              {STATUS_OPTIONS.map((tab) => {
                return <Tab key={tab} label={tab} value={tab} />
              })}
            </Tabs>

            <Divider />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                {isFetchingData ?
                  <LinearProgress /> :
                  <Table size={'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      onSort={onSort}
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <QuestionTableRow
                              key={row.$id}
                              index={row?.sn}
                              row={row}
                              onClickRow={PATH_DASHBOARD.question.view(row?.$id)}
                            />
                          )
                        })}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                      />
                    </TableBody>
                  </Table>
                }
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
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