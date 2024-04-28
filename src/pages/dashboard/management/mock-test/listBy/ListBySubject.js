import { Button, Container, Divider, Grid, TextField } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs";
import Iconify from "../../../../../components/iconify";
import MockLoaderSkeleton from "../../../../../sections/@dashboard/mock-test/MockLoaderSkeleton";
import MockTestTile from "../../../../../sections/@dashboard/mock-test/MockTestTile";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { useSettingsContext } from "../../../../../components/settings";
import { useEffect, useState } from "react";
import { MockTest } from "../../../../../auth/MockTest";
import { Question } from "../../../../../auth/Question";
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

export default function ListBySubject() {
  const standardId = window.location.pathname.split('/')[5];
  const { themeStretch } = useSettingsContext();
  const [standardList, setStandardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [standardName, setStandardName] = useState("standardName");

  const [mrp, setMRP] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [updating, setUpdating] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await MockTest.getMockTestSubjectList(standardId);
      setStandardList(data);
      const data2 = await Question.getStandardName(standardId);
      setStandardName(data2);
      const data3 = await MockTest.getMockTestPrice(standardId, null, null, null);
      setSellPrice(data3.sellPrice);
      setMRP(data3.mrp);
      setLoading(false)
    }
    fetchData();
  }, [standardId])

  const onsubmitmitPrice = async () => {
    setUpdating(true)
    try {
      await MockTest.updateMockTestPrice(standardId, null, null, null, parseFloat(mrp), parseFloat(sellPrice));
      enqueueSnackbar('Successfully Updated')
    } catch (error) {
      enqueueSnackbar(error.message, {variant: 'error'})
    }
    setUpdating(false)
  }

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
              to={PATH_DASHBOARD.question.list + "?status=Active&standardId=" + standardId}
              variant="contained"
            >
              View Available Question
            </Button>
          }
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
                    to={PATH_DASHBOARD.mockTest.new + "?standardId=" + standardId}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    Add New
                  </Button>
                </Grid>
              </Grid>
            </>
        }

      </Container >
    </>
  )
}