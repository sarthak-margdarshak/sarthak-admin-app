import { Card, Container, Divider, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { MockTest } from "../../../../../auth/MockTest";
import { Question } from "../../../../../auth/Question";
import MockLoaderSkeleton from "../../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";
import MockTestTile from "../../../../../sections/@dashboard/mock-test/MockTestTile";
import { useSettingsContext } from "../../../../../components/settings";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

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

  const [mrp, setMRP] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [updating, setUpdating] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

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
      const data7 = await MockTest.getMockTestPrice(standardId, subjectId, chapterId, conceptId);
      setSellPrice(data7.sellPrice);
      setMRP(data7.mrp);
      setLoading(false)
    }
    fetchData();
  }, [standardId, subjectId, chapterId, conceptId])

  const onsubmitmitPrice = async () => {
    setUpdating(true)
    try {
      await MockTest.updateMockTestPrice(standardId, subjectId, chapterId, conceptId, parseFloat(mrp), parseFloat(sellPrice));
      enqueueSnackbar('Successfully Updated')
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
    setUpdating(false)
  }

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
            <>
              <Grid container spacing={2} padding={2}>
                <Grid item lg={4} xl={4} md={4} sm={12} xs={12}>
                  <TextField fullWidth id="outlined-basic-mrp" label="MRP" variant="outlined" value={mrp} onChange={(event) => setMRP(event.target.value)} />
                </Grid>
                <Grid item lg={4} xl={4} md={4} sm={12} xs={12}>
                  <TextField fullWidth id="outlined-basic-sell" label="Sell Price" variant="outlined" value={sellPrice} onChange={(event) => setSellPrice(event.target.value)} />
                </Grid>
                <Grid item lg={4} xl={4} md={4} sm={12} xs={12}>
                  <LoadingButton loading={updating} onClick={onsubmitmitPrice} >Update Price</LoadingButton>
                </Grid>
              </Grid>
              <Divider />
              <Grid container spacing={3} marginTop={1}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Card sx={{ p: 2 }}>
                    {"No of question per mock test - " + questionCnt}
                  </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Card sx={{ p: 2 }}>
                    {"Mock Test Duration - " + time}
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
            </>
        }

      </Container >
    </>
  )
}