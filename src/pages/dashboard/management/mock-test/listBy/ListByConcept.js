import { useEffect, useState } from "react";
import { MockTest, Question } from "../../../../../auth/AppwriteContext";
import { useSettingsContext } from "../../../../../components/settings";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { Button, Container, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../../../../../components/iconify";
import MockLoaderSkeleton from "../../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";
import MockTestTile from "../../../../../sections/@dashboard/mock-test/MockTestTile";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";

export default function ListByConcept() {
  const standardId = window.location.pathname.split('/')[5];
  const subjectId = window.location.pathname.split('/')[7];
  const chapterId = window.location.pathname.split('/')[9];
  const { themeStretch } = useSettingsContext();
  const [conceptList, setConceptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [standardName, setStandardName] = useState("Standard Name");
  const [subjectName, setSubjectName] = useState("Subject Name");
  const [chapterName, setChapterName] = useState("Chapter Name");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await MockTest.getMockTestConceptList(standardId, subjectId, chapterId);
      setConceptList(data);
      const data2 = await Question.getStandardName(standardId);
      setStandardName(data2);
      const data3 = await Question.getSubjectName(subjectId);
      setSubjectName(data3);
      const data4 = await Question.getChapterName(chapterId);
      setChapterName(data4);
      setLoading(false)
    }
    fetchData();
  }, [standardId, subjectId, chapterId])

  return (
    <>
      <Helmet>
        <title> Mock-Test: List | Chapter</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mock Test - Lists"
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
              href: PATH_DASHBOARD.mockTest.chapterList(standardId, subjectId),
            },
            {
              name: chapterName,
            }
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.mockTest.new+'?standardId='+standardId+'&subjectId='+subjectId+'&chapterId='+chapterId}
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
                conceptList.map((value) =>
                  <Grid item key={value.id}>
                    <MockTestTile
                      tileValue={value.name}
                      tileLink={PATH_DASHBOARD.mockTest.list(standardId, subjectId, chapterId, value.id)}
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
                  to={PATH_DASHBOARD.mockTest.new+'?standardId='+standardId+'&subjectId='+subjectId+'&chapterId='+chapterId}
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