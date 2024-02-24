import { Card, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { MockTest, Question } from "../../../../../auth/AppwriteContext";
import MockLoaderSkeleton from "../../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";
import MockTestTile from "../../../../../sections/@dashboard/mock-test/MockTestTile";
import { useSettingsContext } from "../../../../../components/settings";

export default function List() {
  const standardId = window.location.pathname.split('/')[5];
  const subjectId = window.location.pathname.split('/')[7];
  const chapterId = window.location.pathname.split('/')[9];
  const conceptId = window.location.pathname.split('/')[11];

  const { themeStretch } = useSettingsContext();
  const [loading, setLoading] = useState(false);
  const [standardName, setStandardName] = useState("Standard Name");
  const [subjectName, setSubjectName] = useState("Subject Name");
  const [chapterName, setChapterName] = useState("Chapter Name");
  const [conceptName, setConceptName] = useState("Concept Name");
  const [mockTest, setMockTestList] = useState([]);

  const [time, setTime] = useState();
  const [questionCnt, setQuestionCnt] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await MockTest.getMockTestList(standardId, subjectId, chapterId, conceptId);
      setMockTestList(data);
      const data2 = await Question.getStandardName(standardId);
      setStandardName(data2);
      const data3 = await Question.getSubjectName(subjectId);
      setSubjectName(data3);
      const data4 = await Question.getChapterName(chapterId);
      setChapterName(data4);
      const data5 = await Question.getConceptName(conceptId);
      setConceptName(data5);
      const data6 = await MockTest.getMockTestDriver(standardId, subjectId, chapterId, conceptId);
      setTime(data6.documents[0].time);
      setQuestionCnt(data6.documents[0].questionCount);
      setLoading(false)
    }
    fetchData();
  }, [standardId, subjectId, chapterId, conceptId])

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
              href: PATH_DASHBOARD.mockTest.conceptList(standardId, subjectId, chapterId),
            },
            {
              name: conceptName,
            }
          ]}
        />

        {
          loading
            ?
            <MockLoaderSkeleton />
            :
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Card sx={{p:2}}>
                  {"No of question per mock test - "+time}
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Card sx={{p:2}}>
              {"Mock Test Duration - "+questionCnt}
                </Card>
              </Grid>
              {
                mockTest.map((value) =>
                  <Grid item key={value.id}>
                    <MockTestTile
                      tileValue={value.name}
                      tileLink={PATH_DASHBOARD.mockTest.view(value.id)}
                      cnt={-1}
                    />
                  </Grid>
                )
              }
            </Grid>
        }

      </Container >
    </>
  )
}