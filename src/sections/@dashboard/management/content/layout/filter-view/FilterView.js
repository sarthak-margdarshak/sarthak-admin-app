import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "components/snackbar";
import { Fragment, useEffect, useRef, useState } from "react";
import { Query } from "appwrite";
import { APPWRITE_API } from "config-global";
import FilterDialog from "./FilterDialog";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  ClickAwayListener,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Skeleton,
  Switch,
  Typography,
} from "@mui/material";
import Iconify from "components/iconify";
import FilterOption from "sections/@dashboard/management/content/layout/filter-view/FilterOption";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import QuestionListTable from "sections/@dashboard/management/content/question/component/QuestionListTable";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import MockTestListTable from "sections/@dashboard/management/content/mock-test/component/MockTestListTable";
import ProductListTable from "sections/@dashboard/management/content/product/component/ProductListTable";
import { Item } from "components/item/Item";

const sortOptions = [
  "Sort By Latest Created",
  "Sort By Early Created",
  "Sort By Latest Updated",
  "Sort By Early Updated",
  "Sort By Latest Approved",
  "Sort By Early Approved",
];

export default function FilterView({ collection }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const anchorRef = useRef(null);
  const { loadSearchList, searchList } = useContent();

  const [dataIdLst, setDataIdLst] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [sortSelectedIndex, setSortSelectedIndex] = useState(0);
  const [sortMenuOpened, setSortMenuOpened] = useState(false);
  const [searchParameterOptions, setSearchParameterOptions] = useState([]);
  const [filterWindowOpen, setFilterWindowOpen] = useState(false);
  const [narrowSearch, setNarrowSearch] = useState(false);
  const [searchId, setSearchId] = useState(crypto.randomUUID());
  const [limit] = useState(100);

  const fetchData = async (sortInd, params, narrow, id) => {
    setIsFetchingData(true);
    try {
      let queries = [Query.limit(limit)];
      let conditionalQueries = [];

      if (sortInd === 5) {
        queries.push(Query.orderAsc("approvedAt"));
      } else if (sortInd === 4) {
        queries.push(Query.orderDesc("approvedAt"));
      } else if (sortInd === 3) {
        queries.push(Query.orderAsc("$updatedAt"));
      } else if (sortInd === 2) {
        queries.push(Query.orderDesc("$updatedAt"));
      } else if (sortInd === 1) {
        queries.push(Query.orderAsc("$createdAt"));
      } else {
        queries.push(Query.orderDesc("$createdAt"));
      }

      params.forEach((q) => {
        if (q.value === "bookIndex" && q.isSelected) {
          if (collection === APPWRITE_API.collections.products) {
            conditionalQueries.push(
              Query.or([
                Query.equal("bookIndex", q.content),
                Query.equal("standard", q.content),
                Query.equal("subject", q.content),
              ])
            );
          } else {
            conditionalQueries.push(
              Query.or([
                Query.equal("bookIndex", q.content),
                Query.equal("standard", q.content),
                Query.equal("subject", q.content),
                Query.equal("chapter", q.content),
                Query.equal("concept", q.content),
              ])
            );
          }
        }

        if (q.value === "content" && q.isSelected) {
          if (collection === APPWRITE_API.collections.questions) {
            conditionalQueries.push(
              Query.or([
                Query.search("contentQuestion", q.content),
                Query.contains("contentOptions", [q.content]),
                Query.search("contentAnswer", q.content),
              ])
            );
          } else {
            conditionalQueries.push(
              Query.or([
                Query.search("name", q.content),
                Query.search("description", q.content),
              ])
            );
          }
        }

        if (q.value === "published" && q.isSelected) {
          conditionalQueries.push(Query.equal("published", q.content));
        }

        if (q.value === "creator" && q.isSelected) {
          conditionalQueries.push(Query.equal("creator", q.content));
        }

        if (q.value === "updater" && q.isSelected) {
          conditionalQueries.push(Query.equal("updater", q.content));
        }

        if (q.value === "approver" && q.isSelected) {
          conditionalQueries.push(Query.equal("approver", q.content));
        }
      });

      if (conditionalQueries.length > 1) {
        if (narrow) {
          queries.push(Query.and(conditionalQueries));
        } else {
          queries.push(Query.or(conditionalQueries));
        }
      } else {
        queries = queries.concat(conditionalQueries);
      }

      await loadSearchList(id, queries, collection);
      setDataIdLst(searchList[id]);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setIsFetchingData(false);
  };

  useEffect(() => {
    const tempId = crypto.randomUUID()
    setSearchId(tempId)
    const dataSort =
      searchParams.get("sortBy") !== null
        ? parseInt(searchParams.get("sortBy"))
        : 0;
    setSortSelectedIndex(dataSort);

    const dataParams = [
      {
        value: "bookIndex",
        label: "Index",
        isSelected: searchParams.get("bookIndex") !== null,
        content: searchParams.get("bookIndex"),
      },
      {
        value: "content",
        label: "Content",
        isSelected: searchParams.get("content") !== null,
        content: searchParams.get("content")
          ? decodeURIComponent(searchParams.get("content"))
          : null,
      },
      {
        value: "published",
        label: "Published",
        isSelected: searchParams.get("published") !== null,
        content:
          searchParams.get("published") !== null
            ? searchParams.get("published") === "true"
            : false,
      },
      {
        value: "creator",
        label: "Created By",
        isSelected: searchParams.get("creator") !== null,
        content: searchParams.get("creator"),
      },
      {
        value: "updater",
        label: "Updated By",
        isSelected: searchParams.get("updater") !== null,
        content: searchParams.get("updater"),
      },
      {
        value: "approver",
        label: "Approved By",
        isSelected: searchParams.get("approver") !== null,
        content: searchParams.get("approver"),
      },
    ];
    setSearchParameterOptions(dataParams);

    const dataNarrow =
      searchParams.get("narrowSearch") !== null
        ? searchParams.get("narrowSearch") === "true"
        : false;
    setNarrowSearch(dataNarrow);

    fetchData(dataSort, dataParams, dataNarrow, tempId).then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setSortMenuOpened(false);
  };

  const addParameter = (param) => {
    const tmpOptions = searchParameterOptions;
    const ind = tmpOptions.findIndex((option) => param.value === option.value);
    if (ind !== -1) {
      tmpOptions[ind] = param;
      setSearchParameterOptions(tmpOptions);
      navigateCustom(tmpOptions, sortSelectedIndex, narrowSearch);
    }
  };

  const deleteParameter = (value) => {
    const tmpOptions = searchParameterOptions;
    const ind = tmpOptions.findIndex((option1) => option1.value === value);
    if (ind !== -1) {
      tmpOptions[ind] = { ...tmpOptions[ind], isSelected: false };
      setSearchParameterOptions(tmpOptions);
      navigateCustom(tmpOptions, sortSelectedIndex, narrowSearch);
    }
  };

  const navigateCustom = (tmpOptions, sortInd, narrow) => {
    let url = window.location.pathname;
    let ret = [
      encodeURIComponent("sortBy") + "=" + encodeURIComponent(sortInd),
      encodeURIComponent("narrowSearch") + "=" + encodeURIComponent(narrow),
    ];
    for (let option of tmpOptions) {
      if (option.isSelected) {
        ret.push(
          encodeURIComponent(option.value) +
            "=" +
            encodeURIComponent(option.content)
        );
      }
    }
    if (ret.length > 0) {
      url += "?" + ret.join("&");
    }
    setSearchId(crypto.randomUUID())
    navigate(url);
  };

  return (
    <Fragment>
      <FilterDialog
        filterWindowOpen={filterWindowOpen}
        searchParams={searchParameterOptions}
        handleClose={() => setFilterWindowOpen(!filterWindowOpen)}
        onAddParam={addParameter}
      />

      <Box
        component="section"
        sx={{ border: "1px solid grey", borderRadius: 1 }}
      >
        <Item>
          <Divider sx={{ m: 1 }}>
            <Chip
              label="Sort & Filter"
              color="success"
              icon={<Iconify icon="flat-color-icons:filled-filter" />}
            />
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={8} md={8} lg={9} xl={9}>
              <Grid container spacing={1}>
                {searchParameterOptions
                  .filter((option) => option.isSelected)
                  .map((option) => (
                    <FilterOption
                      key={crypto.randomUUID()}
                      option={option}
                      onDelete={deleteParameter}
                    />
                  ))}

                {searchParameterOptions.some(
                  (option) => !option.isSelected
                ) && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      startIcon={
                        <Iconify icon="material-symbols:category-rounded" />
                      }
                      onClick={() => setFilterWindowOpen(!filterWindowOpen)}
                    >
                      Add More Category
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={4} lg={3} xl={3}>
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonGroup ref={anchorRef}>
                    <Button
                      fullWidth
                      onClick={() => console.log("Clicked")}
                      variant="outlined"
                    >
                      {sortOptions[sortSelectedIndex]}
                    </Button>
                    <Button
                      onClick={() => setSortMenuOpened(!sortMenuOpened)}
                      variant="contained"
                    >
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
                            placement === "bottom"
                              ? "center top"
                              : "center bottom",
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu" autoFocusItem>
                              {sortOptions.map((option, index) => (
                                <MenuItem
                                  key={option}
                                  selected={index === sortSelectedIndex}
                                  onClick={() => {
                                    setSortSelectedIndex(index);
                                    navigateCustom(
                                      searchParameterOptions,
                                      index,
                                      narrowSearch
                                    );
                                    setSortMenuOpened(false);
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
                  <FormControlLabel
                    control={
                      <Switch
                        checked={narrowSearch}
                        onChange={(event, checked) => {
                          setNarrowSearch(checked);
                          navigateCustom(
                            searchParameterOptions,
                            sortSelectedIndex,
                            checked
                          );
                        }}
                        name="gilad"
                      />
                    }
                    label="Narrow Search"
                  />
                  <FormHelperText>
                    Checking above switch will fetch the results, which will
                    fulfill all given conditions on the left.
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Item>
      </Box>

      <Divider sx={{ m: 1 }}>
        <Chip
          label={"Total Result - " + dataIdLst?.total || 0}
          color="info"
          icon={<Iconify icon="arcticons:tally-counter" />}
        />
      </Divider>

      <Box sx={{ minHeight: 400 }}>
        {!isFetchingData && dataIdLst?.list?.length === 0 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" color={"gray"}>
              No Result found
            </Typography>
          </Box>
        )}

        {collection === APPWRITE_API.collections.questions && (
          <QuestionListTable data={dataIdLst?.list || []} searchId={searchId} />
        )}

        {collection === APPWRITE_API.collections.mockTest && (
          <MockTestListTable data={dataIdLst?.list || []} searchId={searchId} />
        )}

        {collection === APPWRITE_API.collections.products && (
          <ProductListTable data={dataIdLst?.list || []} searchId={searchId} />
        )}

        {isFetchingData && (
          <Skeleton
            animation="wave"
            sx={{ m: 2, pl: 2 }}
            variant="rounded"
            height={400}
          />
        )}

        {dataIdLst?.list?.length !== dataIdLst?.total && (
          <Button
            fullWidth
            disabled={isFetchingData}
            startIcon={<KeyboardDoubleArrowDownIcon />}
            endIcon={<KeyboardDoubleArrowDownIcon />}
            onClick={() =>
              fetchData(sortSelectedIndex, searchParameterOptions, narrowSearch, searchId)
            }
          >
            {"Loaded " +
              dataIdLst?.list?.length +
              " out of " +
              dataIdLst?.total +
              "! Load More"}
          </Button>
        )}
      </Box>
    </Fragment>
  );
}
