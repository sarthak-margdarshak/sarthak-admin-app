import {
  Card,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "../../../../../components/settings";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import Scrollbar from "../../../../../components/scrollbar/Scrollbar";
import {
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "../../../../../components/table";
import MockTestTableRow from "../../../../../sections/@dashboard/mock-test/MockTestTableRow";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Query } from "appwrite";
import {
  ChapterDisplayUI,
  ConceptDisplayUI,
  StandardDisplayUI,
  SubjectDisplayUI,
} from "../../../../../sections/@dashboard/question/view";

const TABLE_HEAD = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "description", label: "Description", align: "left" },
  { id: "published", label: "Published", align: "left" },
  { id: "view" },
];

export default function MockTestDriverViewPage(params) {
  const mtdId = window.location.pathname.split("/")[4];
  console.log(mtdId);
  const [searchParams] = useSearchParams();
  const row = parseInt(searchParams.get("row")) || 5;
  const page = parseInt(searchParams.get("page")) || 0;

  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const [update, setUpdate] = useState(true);
  const [totalSize, setTotalSize] = useState(-1);
  const [mockTestDriver, setMockTestDriver] = useState({});
  const [mockTests, setMockTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setUpdate(true);
      const x = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestDriver,
        [Query.equal("mtdId", mtdId)]
      );
      setMockTestDriver(x.documents[0]);

      const y = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        [
          Query.equal("mockTestDriverId", mtdId),
          Query.orderDesc("$createdAt"),
          Query.offset(page * row),
          Query.limit(row),
        ]
      );
      setMockTests(y.documents);
      setTotalSize(y.total);
      setUpdate(false);
    };
    fetchData();
  }, [mtdId, row, page]);

  return (
    <React.Fragment>
      <Helmet>
        <title> Mock-Test: Driver | View</title>
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
              href: PATH_DASHBOARD.mockTest.driver,
            },
            {
              name: mtdId,
            },
          ]}
        />

        <Card>
          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              {update ? (
                <LinearProgress />
              ) : (
                <>
                  <Grid container>
                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3} padding={1}>
                      <Stack direction="column">
                        <Typography variant="subtitle1">Standards</Typography>
                        {mockTestDriver.standardIds.map((value) => (
                          <StandardDisplayUI key={value} id={value} />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3} padding={1}>
                      <Stack direction="column">
                        <Typography variant="subtitle1">Subjects</Typography>
                        {mockTestDriver.subjectIds.map((value) => (
                          <SubjectDisplayUI key={value} id={value} />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3} padding={1}>
                      <Stack direction="column">
                        <Typography variant="subtitle1">Chapters</Typography>
                        {mockTestDriver.chapterIds.map((value) => (
                          <ChapterDisplayUI key={value} id={value} />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3} padding={1}>
                      <Stack direction="column">
                        <Typography variant="subtitle1">Concepts</Typography>
                        {mockTestDriver.conceptIds.map((value) => (
                          <ConceptDisplayUI key={value} id={value} />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>

                  <Table size={"medium"} sx={{ minWidth: 800 }}>
                    <TableHeadCustom headLabel={TABLE_HEAD} />

                    <TableBody>
                      {mockTests.map((row) => (
                        <MockTestTableRow key={row.$id} mockTest={row} />
                      ))}

                      <TableEmptyRows height={72} />
                    </TableBody>
                  </Table>
                </>
              )}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalSize}
            page={page}
            rowsPerPage={row}
            onPageChange={(event, changedPage) =>
              navigate(
                PATH_DASHBOARD.mockTest.list(mtdId) +
                  "?page=" +
                  changedPage +
                  "&row=" +
                  row
              )
            }
            onRowsPerPageChange={(event) =>
              navigate(
                PATH_DASHBOARD.mockTest.list(mtdId) +
                  "?page=0&row=" +
                  event.target.value
              )
            }
          />
        </Card>
      </Container>
    </React.Fragment>
  );
}
