import { useEffect, useState } from "react";
import { MockTest, Question } from "../../../../../auth/AppwriteContext";
import { useSettingsContext } from "../../../../../components/settings";
import { Helmet } from "react-helmet-async";
import { Button, Container, Grid } from "@mui/material";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import Iconify from "../../../../../components/iconify";
import { Link as RouterLink } from "react-router-dom";
import MockLoaderSkeleton from "../../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";
import MockTestTile from "../../../../../sections/@dashboard/mock-test/MockTestTile";

export default function ListByChapter() {
  const standardId = window.location.pathname.split('/')[5];
  const subjectId = window.location.pathname.split('/')[7];
  const { themeStretch } = useSettingsContext();
  const [standardList, setStandardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [standardName, setStandardName] = useState("Standard Name");
  const [subjectName, setSubjectName] = useState("Subject Name");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await MockTest.getMockTestChapterList(standardId, subjectId);
      setStandardList(data);
      const data2 = await Question.getStandardName(standardId);
      setStandardName(data2);
      const data3 = await Question.getSubjectName(subjectId);
      setSubjectName(data3);
      setLoading(false)
    }
    fetchData();
  }, [standardId, subjectId])

  return (
    <>
      <Helmet>
        <title> Mock-Test: List | Chapter</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mock Test - Chapters"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Mock-Test',
              href: PATH_DASHBOARD.mockTest.root,
            },
            {
              name: standardName,
              href: PATH_DASHBOARD.mockTest.subjectList(standardId),
            },
            {
              name: subjectName,
            }
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.mockTest.new+'?standardId='+standardId+'&subjectId='+subjectId}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Mock-Test
            </Button>
          }
        />

        {
          loading
            ?
            <MockLoaderSkeleton />
            :
            <Grid container spacing={3}>
              {
                standardList.map((value) =>
                  <Grid item key={value.id}>
                    <MockTestTile
                      tileValue={value.name}
                      tileLink={PATH_DASHBOARD.mockTest.conceptList(standardId, subjectId, value.id)}
                      cnt={value.mockTestCnt}
                    />
                  </Grid>
                )
              }
              <Grid item>
                <Button
                  sx={{ width: 128, height: 128 }}
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.mockTest.new+'?standardId='+standardId+'&subjectId='+subjectId}
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
        }

      </Container >
    </>
  )
}