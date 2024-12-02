import {
  AppBar,
  Button,
  Container,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
  Card,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { useSettingsContext } from "../../../../../components/settings";
import CreateMockTestDriverModel from "../../../../../sections/@dashboard/mock-test/CreateMockTestDriverModel";
import Iconify from "../../../../../components/iconify";
import React, { forwardRef, useCallback, useState, useEffect } from "react";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import {
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "../../../../../components/table";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { Query } from "appwrite";
import { useSnackbar } from "notistack";
import Scrollbar from "../../../../../components/scrollbar/Scrollbar";
import MockTestDriverTableRow from "../../../../../sections/@dashboard/mock-test/MockTestDriverTableRow";
import { useNavigate, useSearchParams } from "react-router-dom";

const TABLE_HEAD = [
  { id: "id", label: "ID", align: "left" },
  { id: "standard", label: "Standard", align: "left" },
  { id: "subject", label: "Subject", align: "left" },
  { id: "chapter", label: "Chapter", align: "left" },
  { id: "concept", label: "Concept", align: "left" },
  { id: "count", label: "Mock Test Count", align: "center" },
  { id: "view" },
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MockTestDriverListPage() {
  const [searchParams] = useSearchParams();
  const row = parseInt(searchParams.get("row")) || 5;
  const page = parseInt(searchParams.get("page")) || 0;

  const { themeStretch } = useSettingsContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mockTestDriver, setmockTestDriver] = useState([]);
  const [totalSize, setTotalSize] = useState(-1);
  const [update, setUpdate] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setUpdate(true);
    try {
      const mtd = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestDriver,
        [
          Query.orderDesc("$createdAt"),
          Query.offset(page * row),
          Query.limit(row),
        ]
      );

      setTotalSize(mtd.total);
      setmockTestDriver(mtd.documents);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setUpdate(false);
  }, [row, page, enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <React.Fragment>
      <Helmet>
        <title> Mock-Test: Driver | List</title>
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
              name: "Driver",
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setDialogOpen(true)}
            >
              New Mock Test Driver
            </Button>
          }
        />

        <Card>
          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              {update ? (
                <LinearProgress />
              ) : (
                <Table size={"medium"} sx={{ minWidth: 800 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} />

                  <TableBody>
                    {mockTestDriver.map((row) => (
                      <MockTestDriverTableRow
                        key={row.$id}
                        id={row.$id}
                        mtdId={row.mtdId}
                        standardIds={row.standardIds}
                        subjectIds={row.subjectIds}
                        chapterIds={row.chapterIds}
                        conceptIds={row.conceptIds}
                      />
                    ))}

                    <TableEmptyRows height={72} />
                  </TableBody>
                </Table>
              )}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalSize}
            page={page}
            rowsPerPage={row}
            onPageChange={(event, changedPage) =>
              navigate(
                PATH_DASHBOARD.mockTest.driver +
                  "?page=" +
                  changedPage +
                  "&row=" +
                  row
              )
            }
            onRowsPerPageChange={(event) =>
              navigate(
                PATH_DASHBOARD.product.list +
                  "?page=0&row=" +
                  event.target.value
              )
            }
          />
        </Card>

        <Dialog
          fullScreen
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDialogOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Mock Test Driver
              </Typography>
            </Toolbar>
          </AppBar>
          <CreateMockTestDriverModel
            onSave={() => {
              setDialogOpen(false);
              fetchData();
            }}
          />
        </Dialog>
      </Container>
    </React.Fragment>
  );
}
