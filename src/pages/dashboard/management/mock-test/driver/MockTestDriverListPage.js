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
import { forwardRef, useCallback, useState, useEffect } from "react";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import {
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  emptyRows,
  useTable,
} from "../../../../../components/table";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { Query } from "appwrite";
import { useSnackbar } from "notistack";
import Scrollbar from "../../../../../components/scrollbar/Scrollbar";
import MockTestDriverTableRow from "../../../../../sections/@dashboard/mock-test/MockTestDriverTableRow";
import { Question } from "../../../../../auth/Question";

const TABLE_HEAD = [
  { id: "view" },
  { id: "id", label: "ID", align: "left" },
  { id: "standard", label: "Standard", align: "left" },
  { id: "subject", label: "Subject", align: "left" },
  { id: "chapter", label: "Chapter", align: "left" },
  { id: "concept", label: "Concept", align: "left" },
  { id: "count", label: "Mock Test Count", align: "center" },
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MockTestDriverListPage() {
  const { themeStretch } = useSettingsContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mockTestDriver, setmockTestDriver] = useState([]);
  const [update, setUpdate] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const fetchData = useCallback(async () => {
    setUpdate(true);
    try {
      const mtd = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestDriver,
        [Query.orderDesc("$createdAt"), Query.limit(100)]
      );
      for (let j in mtd.documents) {
        var standards = "";
        for (let i in mtd.documents[j].standardIds) {
          if (i !== "0") {
            standards += ", ";
          }
          standards += await Question.getStandardName(
            mtd.documents[j].standardIds[i]
          );
        }

        var subjects = "";
        for (let i in mtd.documents[j].subjectIds) {
          if (i !== "0") {
            subjects += ", ";
          }
          subjects += await Question.getSubjectName(
            mtd.documents[j].subjectIds[i]
          );
        }

        var chapters = "";
        for (let i in mtd.documents[j].chapterIds) {
          if (i !== "0") {
            chapters += ", ";
          }
          chapters += await Question.getChapterName(
            mtd.documents[j].chapterIds[i]
          );
        }

        var concepts = "";
        for (let i in mtd.documents[j].conceptIds) {
          if (i !== "0") {
            concepts += ", ";
          }
          concepts += await Question.getConceptName(
            mtd.documents[j].conceptIds[i]
          );
        }
        mtd.documents[j].standardIds = standards;
        mtd.documents[j].subjectIds = subjects;
        mtd.documents[j].chapterIds = chapters;
        mtd.documents[j].conceptIds = concepts;
      }

      setmockTestDriver(mtd.documents);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setUpdate(false);
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
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
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                  />

                  <TableBody>
                    {mockTestDriver
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <MockTestDriverTableRow key={row.$id} row={row} />
                        );
                      })}

                    <TableEmptyRows
                      height={72}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        mockTestDriver.length
                      )}
                    />
                  </TableBody>
                </Table>
              )}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={mockTestDriver.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
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
    </>
  );
}
