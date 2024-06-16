import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "../../../../components/settings";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { useSnackbar } from "notistack";
import Iconify from "../../../../components/iconify";
import { Link as RouterLink } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import PermissionDeniedComponent from "../../../../sections/_examples/PermissionDeniedComponent";
import StandardDisplayUI from "../../../../sections/@dashboard/question/view/StandardDisplayUI";
import SubjectDisplayUI from "../../../../sections/@dashboard/question/view/SubjectDisplayUI";
import ChapterDisplayUI from "../../../../sections/@dashboard/question/view/ChapterDisplayUI";
import ConceptDisplayUI from "../../../../sections/@dashboard/question/view/ConceptDisplayUI";
import { SarthakUserDisplayUI } from "../../../../sections/@dashboard/user/profile";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import {
  appwriteDatabases,
  appwriteFunctions,
  appwriteStorage,
} from "../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../config-global";
import ReactKatex from "@pkasila/react-katex";
import { CarouselAnimation } from "../../../../components/carousel";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function ProductViewPage() {
  const id = window.location.pathname.split("/")[3];

  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const { userProfile } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeMockTest, setActiveMockTest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      var x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        id
      );
      for (let i in x.mockTestIds) {
        var tmpMockTest = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          x.mockTestIds[i]
        );
        var tmpQuestions = [];
        for (let j in tmpMockTest.questions) {
          const y = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.questions,
            tmpMockTest.questions[j]
          );
          tmpQuestions.push(y);
        }
        tmpMockTest.questions = tmpQuestions;
        x.mockTestIds[i] = tmpMockTest;
      }

      var tmpImages = [];
      for (let i in x.images) {
        const y = appwriteStorage.getFileDownload(
          APPWRITE_API.buckets.productFiles,
          x.images[i]
        ).href;
        tmpImages.push({
          id: x.images[i],
          image: y,
        });
      }
      x.images = tmpImages;
      setProduct(x);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const publishProduct = async () => {
    setPublishing(true);
    try {
      await appwriteFunctions.createExecution(
        APPWRITE_API.functions.publishProduct,
        JSON.stringify({
          productId: id,
          userId: userProfile.$id,
        })
      );
      setOpenPublishDialog(false);
      setProduct({
        ...product,
        published: true,
        publishedBy: userProfile.$id,
        publishedAt: new Date(),
      });
      enqueueSnackbar("Published Successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setPublishing(false);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{"Product : View | " + id}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Product"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Mock-Test",
              href: PATH_DASHBOARD.product.root,
            },
            {
              name: product?.name,
            },
          ]}
          action={
            !loading && (
              <React.Fragment>
                {product?.published ? (
                  <Alert
                    icon={<Iconify icon="icon-park-solid:correct" />}
                    severity="success"
                    variant="standard"
                    sx={{ m: 1 }}
                  >
                    Published
                  </Alert>
                ) : (
                  <Button
                    startIcon={<Iconify icon="ic:round-publish" />}
                    variant="outlined"
                    sx={{ m: 1 }}
                    onClick={() => setOpenPublishDialog(true)}
                  >
                    Publish
                  </Button>
                )}
                {!product?.published && (
                  <Button
                    startIcon={<Iconify icon="ic:baseline-edit" />}
                    variant="contained"
                    sx={{ m: 1 }}
                    to={PATH_DASHBOARD.product.edit(id)}
                    component={RouterLink}
                  >
                    Edit
                  </Button>
                )}
              </React.Fragment>
            )
          }
        />

        {loading ? (
          <Skeleton height={400} />
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              my: 1,
              mb: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={12} md={2.3} lg={2.3} xl={2.3} padding={1}>
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Mock Test Driver Ids -
                  </Typography>
                  {product?.mockTestDriverIds?.map((driver) => (
                    <Typography
                      key={driver}
                      variant="body2"
                      sx={{
                        alignSelf: "center",
                      }}
                    >
                      {driver}
                    </Typography>
                  ))}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Standards -
                  </Typography>
                  {product?.standards.length === 0 ? (
                    <Typography variant="body2">All</Typography>
                  ) : (
                    product?.standards.map((value) => (
                      <StandardDisplayUI key={value} id={value} />
                    ))
                  )}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Subjects -
                  </Typography>
                  {product?.subjects.length === 0 ? (
                    <Typography variant="body2">All</Typography>
                  ) : (
                    product?.subjects.map((value) => (
                      <SubjectDisplayUI key={value} id={value} />
                    ))
                  )}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Chapters -
                  </Typography>
                  {product?.chapters.length === 0 ? (
                    <Typography variant="body2">All</Typography>
                  ) : (
                    product?.chapters.map((value) => (
                      <ChapterDisplayUI key={value} id={value} />
                    ))
                  )}
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid
                item
                xs={5.9}
                sm={5.9}
                md={2.3}
                lg={2.3}
                xl={2.3}
                padding={1}
              >
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecorationLine: "underline",
                    }}
                  >
                    Concepts -
                  </Typography>
                  {product?.concepts.length === 0 ? (
                    <Typography variant="body2">All</Typography>
                  ) : (
                    product?.concepts.map((value) => (
                      <ConceptDisplayUI key={value} id={value} />
                    ))
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ m: 1 }} />

            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9}>
                <Stack direction="column" sx={{ m: 2 }}>
                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                    >
                      Created By -
                    </Typography>
                    <SarthakUserDisplayUI userId={product?.createdBy} />
                  </Stack>

                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                      variant="subtitle2"
                    >
                      Created At -
                    </Typography>
                    <Tooltip
                      title={new Date(product?.$createdAt).toUTCString()}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textDecorationLine: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {timeAgo.format(new Date(product?.$createdAt))}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9}>
                <Stack direction="column" sx={{ m: 2 }}>
                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                      variant="subtitle2"
                    >
                      Updated By -
                    </Typography>
                    <SarthakUserDisplayUI userId={product?.updatedBy} />
                  </Stack>

                  <Stack direction="row" sx={{ alignSelf: "center" }}>
                    <Typography
                      sx={{
                        mr: 1,
                        textDecorationLine: "underline",
                      }}
                      variant="subtitle2"
                    >
                      Updated At -
                    </Typography>
                    <Tooltip
                      title={new Date(product?.$updatedAt).toUTCString()}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textDecorationLine: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {timeAgo.format(new Date(product?.$updatedAt))}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9}>
                {product.published && (
                  <Stack direction="column" sx={{ m: 2 }}>
                    <Stack direction="row" sx={{ alignSelf: "center" }}>
                      <Typography
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                        variant="subtitle2"
                      >
                        Published By -
                      </Typography>
                      <SarthakUserDisplayUI userId={product?.publishedBy} />
                    </Stack>

                    <Stack direction="row" sx={{ alignSelf: "center" }}>
                      <Typography
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                        variant="subtitle2"
                      >
                        Published At -
                      </Typography>
                      <Tooltip
                        title={new Date(product?.publishedAt).toUTCString()}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            textDecorationLine: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {timeAgo.format(new Date(product?.publishedAt))}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Stack>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ m: 1 }} />

            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container>
                  <Grid
                    item
                    xs={5.9}
                    sm={5.9}
                    md={5.9}
                    lg={5.9}
                    xl={5.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Product Name -
                      </Typography>
                      <Typography variant="body2">{product?.name}</Typography>
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={5.9}
                    sm={5.9}
                    md={5.9}
                    lg={5.9}
                    xl={5.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Product Id -
                      </Typography>
                      <Typography variant="body2">
                        {product?.productId}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ m: 1 }} />

                <Grid container>
                  <Grid
                    item
                    xs={3.9}
                    sm={3.9}
                    md={3.9}
                    lg={3.9}
                    xl={3.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Type -
                      </Typography>
                      <Typography variant="body2">{product?.type}</Typography>
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={3.9}
                    sm={3.9}
                    md={3.9}
                    lg={3.9}
                    xl={3.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        MRP -
                      </Typography>
                      <Typography variant="body2">{product?.mrp}</Typography>
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={3.9}
                    sm={3.9}
                    md={3.9}
                    lg={3.9}
                    xl={3.9}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mr: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        Sell Price -
                      </Typography>
                      <Typography variant="body2">
                        {product?.sellPrice}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs={12} sm={12} md={5.9} lg={5.9} xl={5.9} padding={1}>
                <Stack direction="column" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mr: 1,
                      textDecorationLine: "underline",
                    }}
                  >
                    Description -
                  </Typography>
                  <Typography variant="body2">
                    {product?.description}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            sx={{
              p: 1,
            }}
          >
            <Card>
              <CardHeader title="Product Images" />
              <CardContent>
                <CarouselAnimation data={product?.images} />
              </CardContent>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            sx={{
              p: 1,
            }}
          >
            <Card>
              <CardHeader title="Product Publish Info" />
              <CardContent>
                <Button fullWidth sx={{ height: 300 }} disabled>
                  To be displayed soon. Working hard on it
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 1 }}>
          <Chip label="Mock Tests / Products" />
        </Divider>

        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            sx={{
              p: 1,
            }}
          >
            {product?.mockTestIds?.map((mockTest) => (
              <Card
                variant="outlined"
                key={mockTest?.$id}
                sx={{
                  m: 1,
                  pb: 2.5,
                  mr: mockTest?.$id === activeMockTest?.$id ? -5 : 2,
                }}
              >
                <CardHeader
                  title={mockTest.name + " (" + mockTest.mtId + ")"}
                  subheader={mockTest.description}
                  action={
                    mockTest === activeMockTest ? (
                      <IconButton onClick={() => setActiveMockTest(null)}>
                        <Iconify
                          icon="icon-park-solid:view-list"
                          style={{
                            color: theme.palette.primary.main,
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => setActiveMockTest(mockTest)}>
                        <Iconify icon="icon-park-outline:view-list" />
                      </IconButton>
                    )
                  }
                />
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Stack direction="row" sx={{ m: 3 }}>
              <Typography variant="h6">{"Mock Test Id - "}</Typography>
              <Link
                component={RouterLink}
                onClick={() =>
                  window.open(
                    window.location.origin +
                      "/dashboard/mock-test/" +
                      activeMockTest?.$id,
                    "_blank"
                  )
                }
              >
                <Typography variant="h6">{activeMockTest?.mtId}</Typography>
              </Link>
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                m: 2,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              {activeMockTest === null ? (
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  sx={{ height: 200 }}
                >
                  Select the Icon of mock test to view its questions
                </Button>
              ) : (
                <div>
                  {activeMockTest?.questions?.map((question) => (
                    <Card sx={{ m: 1 }} key={question.$id}>
                      <Divider sx={{ mt: 1 }}>
                        <Chip label={question?.qnId} />
                      </Divider>
                      <CardHeader
                        title={
                          <ReactKatex>
                            {question?.contentQuestion || ""}
                          </ReactKatex>
                        }
                      ></CardHeader>

                      <CardContent>
                        <Grid container>
                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("A")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("A")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-a-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionA || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>

                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("B")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("B")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-b-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionB || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>

                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("C")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("C")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-c-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionC || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>

                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("D")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("D")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-d-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionD || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={openPublishDialog}
        onClose={() => setOpenPublishDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {userProfile.createTeam ? (
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">
              Are you sure to Publish it?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you click AGREE, mock-test will be published. After that
                there won't be any edit entertained. You can click DISAGREE, if
                you feel that the mock-test is not ready to be published.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={publishing}
                onClick={() => setOpenPublishDialog(false)}
              >
                Disagree
              </Button>
              <LoadingButton
                loading={publishing}
                onClick={publishProduct}
                autoFocus
              >
                Agree
              </LoadingButton>
            </DialogActions>
          </React.Fragment>
        ) : (
          <DialogContent>
            <PermissionDeniedComponent />
          </DialogContent>
        )}
      </Dialog>
    </React.Fragment>
  );
}
