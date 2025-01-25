import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Divider,
  Typography,
  Skeleton,
  styled,
  Paper,
  Grid,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem, Chip,
} from "@mui/material";
import { useSnackbar } from "components/snackbar";
import QuestionRowComponent from "./QuestionRowComponent";
import {appwriteDatabases} from "auth/AppwriteContext";
import {APPWRITE_API} from "config-global";
import {Query} from "appwrite";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useSearchParams} from "react-router-dom";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Iconify from "components/iconify";
import FilterOption from "./filter/FilterOption";
import FilterDialog from "./filter/FilterDialog";
import {PATH_DASHBOARD} from "routes/paths";

const sortOptions = [
  "Sort By Latest Created",
  "Sort By Early Created",
  "Sort By Latest Updated",
  "Sort By Early Updated",
  "Sort By Latest Approved",
  "Sort By Early Approved",
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ebebeb',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function QuestionListComponent() {
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const anchorRef = useRef(null);

  const [questionIdLst, setQuestionIdLst] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [lastSyncedId, setLastSyncedId] = useState(null);
  const [sortSelectedIndex, setSortSelectedIndex] = useState(searchParams.get('sortBy') !== null ? parseInt(searchParams.get('sortBy')) : 0);
  const [sortMenuOpened, setSortMenuOpened] = useState(false);
  const [searchParameterOptions, setSearchParameterOptions] = useState([
    { value: "bookIndex", label: "Index", isSelected: searchParams.get('bookIndex') !== null, content: searchParams.get('bookIndex') },
    { value: "content", label: "Content", isSelected: searchParams.get('content') !== null, content: searchParams.get('content') ? decodeURIComponent(searchParams.get('content')) : null },
    { value: "published", label: "Published", isSelected: searchParams.get('published') !== null, content: searchParams.get('published') !== null ? searchParams.get('published') === 'true' : false },
    { value: "creator", label: "Created By", isSelected: searchParams.get('creator') !== null, content: searchParams.get('creator') },
    { value: "updater", label: "Updated By", isSelected: searchParams.get('updater') !== null, content: searchParams.get('updater') },
    { value: "approver", label: "Approved By", isSelected: searchParams.get('approver') !== null, content: searchParams.get('approver') },
  ]);
  const [searchParamsChanged, setSearchParamsChanged] = useState(false);
  const [filterWindowOpen, setFilterWindowOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    setIsFetchingData(true);
    try {
      let queries = [Query.limit(100), Query.select("$id")]
      let orQueries = []

      if(lastSyncedId) {
        queries.push(Query.cursorAfter(lastSyncedId));
      }

      const sortInd = searchParams.get('sortBy') ? parseInt(searchParams.get('sortBy')) : 0
      if (sortInd === 5) {
        queries.push(Query.orderAsc("approvedAt"))
      } else if (sortInd === 4) {
        queries.push(Query.orderDesc("approvedAt"))
      } else if (sortInd === 3) {
        queries.push(Query.orderAsc("$updatedAt"))
      } else if (sortInd === 2) {
        queries.push(Query.orderDesc("$updatedAt"))
      } else if (sortInd === 1) {
        queries.push(Query.orderAsc("$createdAt"))
      } else {
        queries.push(Query.orderDesc("$createdAt"))
      }

      if(searchParams.get('bookIndex')) {
        orQueries.push(Query.equal("bookIndex", searchParams.get('bookIndex')));
      }

      if(searchParams.get('content')) {
        orQueries.push(Query.search("contentQuestion", decodeURIComponent(searchParams.get('content'))));
        orQueries.push(Query.contains("contentOptions", [decodeURIComponent(searchParams.get('content'))]));
        orQueries.push(Query.search("contentAnswer", decodeURIComponent(searchParams.get('content'))));
      }

      if(searchParams.get('published')) {
        orQueries.push(Query.equal("published", searchParams.get('published') === 'true'));
      }

      if(searchParams.get('creator')) {
        orQueries.push(Query.equal("creator", searchParams.get('creator')));
      }

      if(searchParams.get('updater')) {
        orQueries.push(Query.equal("updater", searchParams.get('updater')));
      }

      if(searchParams.get('approver')) {
        orQueries.push(Query.equal("approver", searchParams.get('approver')));
      }

      if (orQueries.length > 1) {
        queries.push(Query.or(orQueries));
      } else {
        queries = queries.concat(orQueries);
      }

      const data = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        queries
      )
      let tmpLst = questionIdLst
      tmpLst = tmpLst.concat(data.documents.map((doc) => doc.$id))
      setTotalCount(data.total);
      setQuestionIdLst(tmpLst);
      if (data.documents.length > 0) setLastSyncedId(data.documents[data.documents.length - 1].$id)
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setIsFetchingData(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setSortMenuOpened(false);
  };

  return (
    <React.Fragment>
      <FilterDialog
        filterWindowOpen={filterWindowOpen}
        searchParams={searchParameterOptions}
        handleClose={() => setFilterWindowOpen(!filterWindowOpen)}
        onAddParam={(param) => {
          const tmpOptions = searchParameterOptions
          const ind = tmpOptions.findIndex((option) => param.value === option.value);
          if (ind !== -1) {
            tmpOptions[ind] = param;
            setSearchParameterOptions(tmpOptions);
            setSearchParamsChanged(true)
          }
        }}
      />

      <Box component="section" sx={{ border: '1px solid grey', borderRadius: 1 }}>
        <Item>
          <Divider sx={{m: 1}}>
            <Chip
              label='Sort & Filter'
              color="success"
              icon={<Iconify icon='flat-color-icons:filled-filter' />}
            />
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={8} md={8} lg={9} xl={9}>
              <Grid container spacing={1}>
                {searchParameterOptions.filter((option) => option.isSelected).map((option, index) =>
                  <FilterOption
                    key={crypto.randomUUID()}
                    option={option}
                    onDelete={(value) => {
                      const tmpOptions = searchParameterOptions
                      const ind = tmpOptions.findIndex((option1) => option1.value === value);
                      if (ind !== -1) {
                        tmpOptions[ind] = {...tmpOptions[ind], isSelected: false};
                        setSearchParameterOptions(tmpOptions);
                        setSearchParamsChanged(true)
                      }
                    }}
                  />
                )}

                {searchParameterOptions.some((option) => !option.isSelected) &&
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button fullWidth startIcon={<Iconify icon='material-symbols:category-rounded' />} onClick={() => setFilterWindowOpen(!filterWindowOpen)}>Add More Category</Button>
                  </Grid>
                }
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={4} lg={3} xl={3}>
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonGroup
                    ref={anchorRef}
                  >
                    <Button fullWidth onClick={() => console.log("Clicked")} variant='outlined'>
                      {sortOptions[sortSelectedIndex]}
                    </Button>
                    <Button onClick={() => setSortMenuOpened(!sortMenuOpened)} variant='contained'>
                      <ArrowDropDownIcon />
                    </Button>
                  </ButtonGroup>
                  <Popper
                    sx={{ zIndex: 1 }}
                    open={sortMenuOpened}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu" autoFocusItem>
                              {sortOptions.map((option, index) => (
                                <MenuItem
                                  key={option}
                                  selected={index === sortSelectedIndex}
                                  onClick={(event) => {
                                    setSortSelectedIndex(index)
                                    setSearchParamsChanged(true)
                                    setSortMenuOpened(false)
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Grid>

                <Grid item>
                  <Button
                    disabled={!searchParamsChanged}
                    onClick={() => {
                      let url = PATH_DASHBOARD.question.list
                      let ret = [encodeURIComponent('sortBy') + "=" + encodeURIComponent(sortSelectedIndex)]
                      for (let option of searchParameterOptions) {
                        if (option.isSelected) {
                          ret.push(encodeURIComponent(option.value) + "=" + encodeURIComponent(option.content))
                        }
                      }
                      if(ret.length > 0) {
                        url += "?" + ret.join("&")
                      }
                      window.open(url, "_self")
                    }}
                    variant='outlined'
                    endIcon={<FilterAltIcon />}
                  >
                    Apply Filter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Item>
      </Box>

      <Divider sx={{ m: 1 }}>
        <Chip
          label={"Total Question - " + totalCount}
          color="info"
          icon={<Iconify icon='arcticons:tally-counter' />}
        />
      </Divider>

      <Box sx={{ minHeight: 400 }}>
        {!isFetchingData && questionIdLst?.length === 0 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" color={"gray"}>
              No Question found
            </Typography>
          </Box>
        )}

        {questionIdLst?.map((item) => (
          <QuestionRowComponent
            questionId={item}
            key={item}
            defaultExpanded={false}
            showImages={false}
            showAnswer={false}
          />
        ))}

        {isFetchingData && (
          <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={400} />
        )}

        {questionIdLst.length !== totalCount && (
          <Button
            fullWidth
            disabled={isFetchingData}
            startIcon={<KeyboardDoubleArrowDownIcon />}
            endIcon={<KeyboardDoubleArrowDownIcon />}
            onClick={fetchData}
          >
            {"Loaded " + questionIdLst.length + " out of " + totalCount + "! Load More"}
          </Button>
        )}
      </Box>

    </React.Fragment>
  );
}
