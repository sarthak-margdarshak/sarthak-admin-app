import { Container, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useEffect, useState } from "react";
import { MockTest, Question } from "../../../../auth/AppwriteContext";
import { useSettingsContext } from "../../../../components/settings";
import QuestionInMock from "../../../../sections/@dashboard/mock-test/QuestionInMock";
import MockLoaderSkeleton from "../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";

export default function MockTestPage() {
  const mockTestId = window.location.pathname.split('/')[3];

  const { themeStretch } = useSettingsContext();

  const [mockTest, setMockTest] = useState();
  const [standardName, setStandardName] = useState("Standard Name");
  const [subjectName, setSubjectName] = useState("Subject Name");
  const [chapterName, setChapterName] = useState("Chapter Name");
  const [conceptName, setConceptName] = useState("Concept Name");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await MockTest.getMockTest(mockTestId);
      console.log(data)
      setStandardName(await Question.getStandardName(data.standardId));
      setSubjectName(await Question.getSubjectName(data.subjectId));
      setChapterName(await Question.getChapterName(data.chapterId));
      setConceptName(await Question.getConceptName(data.conceptId));
      setMockTest(data);
      setLoading(false)
    }
    fetchData();
  }, [mockTestId])

  return (
    <>
      <Helmet>
        <title>Mock-Test</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mock Test"
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
              href: PATH_DASHBOARD.mockTest.subjectList(mockTest?.standardId),
            },
            {
              name: subjectName,
              href: PATH_DASHBOARD.mockTest.chapterList(mockTest?.standardId, mockTest?.subjectId),
            },
            {
              name: chapterName,
              href: PATH_DASHBOARD.mockTest.conceptList(mockTest?.standardId, mockTest?.subjectId, mockTest?.chapterId),
            },
            {
              name: conceptName,
              href: PATH_DASHBOARD.mockTest.conceptList(mockTest?.standardId, mockTest?.subjectId, mockTest?.chapterId, mockTest?.conceptId),
            },
            {
              name: mockTest?.name
            }
          ]}
        />

        {
          loading
            ?
            <MockLoaderSkeleton />
            :
            <Grid container spacing={3}>
              {
                mockTest?.questions?.map((value, index) => 
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={value}>
                    <QuestionInMock
                      sn={index+1}
                      questionId={value} />
                  </Grid>
                )
              }
            </Grid>
        }

      </Container >
    </>
  )
}