import { Button, Container, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";
import Iconify from "../../../../../components/iconify";
import MockLoaderSkeleton from "../../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";
import MockTestTile from "../../../../../sections/@dashboard/mock-test/MockTestTile";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { useSettingsContext } from "../../../../../components/settings";
import { useEffect, useState } from "react";
import { MockTest, Question } from "../../../../../auth/AppwriteContext";
import { Link as RouterLink } from 'react-router-dom';

export default function ListBySubject() {
  const standardId = window.location.pathname.split('/')[5];
  const { themeStretch } = useSettingsContext();
  const [standardList, setStandardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [standardName, setStandardName] = useState("standardName");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await MockTest.getMockTestSubjectList(standardId);
      setStandardList(data);
      const data2 = await Question.getStandardName(standardId);
      setStandardName(data2);
      setLoading(false)
    }
    fetchData();
  }, [standardId])

  return (
    <>
      <Helmet>
        <title> Mock-Test: List | Subject</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mock Test - Subjects"
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
            }
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.mockTest.new+"?standardId="+standardId}
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
                      tileLink={PATH_DASHBOARD.mockTest.chapterList(standardId, value.id)}
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
                  to={PATH_DASHBOARD.mockTest.new+"?standardId="+standardId}
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